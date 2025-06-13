import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { redis } from "@/lib/redis";
import { v4 as uuidv4 } from "uuid";
import type { ChatRoom, Message } from "@/types/chat";

const getRoomKey = (roomId: string) => `chat:room:${roomId}`;
const getMessagesKey = (roomId: string) => `chat:messages:${roomId}`;

export async function GET() {
  try {
    const activeRooms = await redis.smembers("chat:active_rooms");
    if (!activeRooms || activeRooms.length === 0) {
      return NextResponse.json({ rooms: [] });
    }

    const roomsData = await Promise.all(
      activeRooms.map(async (roomId) => {
        try {
          const data = await redis.get(getRoomKey(roomId));
          if (!data) return null;

          let parsedData;
          if (typeof data === "string") {
            try {
              parsedData = JSON.parse(data);
            } catch (error) {
              console.error(`Parse error for room ${roomId}:`, error);
              return null;
            }
          } else {
            parsedData = data;
          }

          if (
            !parsedData.id ||
            !parsedData.userId ||
            typeof parsedData.updatedAt !== "number"
          ) {
            console.error(
              `Invalid room data structure for room ${roomId}:`,
              parsedData
            );
            return null;
          }

          return parsedData;
        } catch (error) {
          console.error(`Error processing room ${roomId}:`, error);
          return null;
        }
      })
    );

    const rooms = roomsData
      .filter((room): room is ChatRoom => room !== null)
      .sort((a, b) => b.updatedAt - a.updatedAt);

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Error getting chat rooms:", error);
    return NextResponse.json(
      { error: "Failed to get chat rooms", rooms: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, sender, roomId, userId, userName, userImage } = body;

    if (!roomId && sender === "user") {
      const newRoomId = uuidv4();
      const chatRoom: ChatRoom = {
        id: newRoomId,
        userId: userId || "anonymous",
        userName: userName,
        userImage: userImage,
        lastMessage: content,
        updatedAt: Date.now(),
        unread: 1,
      };

      const message: Message = {
        id: uuidv4(),
        content,
        sender,
        timestamp: Date.now(),
        userName,
        userImage,
        isRead: false, // 새 메시지는 읽지 않음으로 설정
      };

      const messageStr = JSON.stringify(message);
      const roomStr = JSON.stringify(chatRoom);

      await Promise.all([
        redis.set(getRoomKey(newRoomId), roomStr),
        redis.sadd("chat:active_rooms", newRoomId),
        redis.rpush(getMessagesKey(newRoomId), messageStr),
      ]);

      await Promise.all([
        pusherServer.trigger(`chat-${newRoomId}`, "message", message),
        pusherServer.trigger("admin-notifications", "new-chat", chatRoom),
      ]);

      return NextResponse.json({ message, roomId: newRoomId });
    }

    if (roomId) {
      const message: Message = {
        id: uuidv4(),
        content,
        sender,
        timestamp: Date.now(),
        userName,
        userImage,
        isRead: false, // 새 메시지는 읽지 않음으로 설정
      };

      const roomKey = getRoomKey(roomId);
      const messagesKey = getMessagesKey(roomId);

      const roomData = await redis.get(roomKey);
      if (!roomData) {
        return NextResponse.json(
          { error: "Chat room not found" },
          { status: 404 }
        );
      }

      try {
        const roomDataStr =
          typeof roomData === "string" ? roomData : JSON.stringify(roomData);
        const chatRoom = JSON.parse(roomDataStr) as ChatRoom;

        // 사용자 정보 업데이트 (user 메시지인 경우에만)
        const updatedRoom: ChatRoom = {
          ...chatRoom,
          lastMessage: content,
          updatedAt: Date.now(),
          unread:
            sender === "user" ? (chatRoom.unread || 0) + 1 : chatRoom.unread,
          // 사용자 정보가 있으면 업데이트
          userName:
            sender === "user" && userName ? userName : chatRoom.userName,
          userImage:
            sender === "user" && userImage ? userImage : chatRoom.userImage,
        };

        const messageStr = JSON.stringify(message);
        const roomStr = JSON.stringify(updatedRoom);

        await Promise.all([
          redis.set(roomKey, roomStr),
          redis.rpush(messagesKey, messageStr),
        ]);

        await pusherServer.trigger(`chat-${roomId}`, "message", message);

        return NextResponse.json({ message, roomId });
      } catch (error) {
        console.error("Error processing message:", error);
        return NextResponse.json(
          { error: "Failed to process message" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;

    await Promise.all([
      redis.del(getRoomKey(roomId)),
      redis.del(getMessagesKey(roomId)),
      redis.srem("chat:active_rooms", roomId),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chat room:", error);
    return NextResponse.json(
      { error: "Failed to delete chat room" },
      { status: 500 }
    );
  }
}

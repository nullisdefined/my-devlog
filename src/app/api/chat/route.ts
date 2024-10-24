import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { redis } from "@/lib/redis";
import { v4 as uuidv4 } from "uuid";
import type { ChatRoom, Message } from "@/types/chat";

const getRoomKey = (roomId: string) => `chat:room:${roomId}`;
const getMessagesKey = (roomId: string) => `chat:messages:${roomId}`;

// 디버깅용 함수
async function inspectRedisData() {
  try {
    // 1. 모든 활성 채팅방 ID 가져오기
    const activeRooms = await redis.smembers("chat:active_rooms");
    console.log("\n=== Active Room IDs ===");
    console.log(activeRooms);

    // 2. 각 채팅방의 데이터 상세 조회
    for (const roomId of activeRooms) {
      console.log(`\n=== Room ${roomId} Data ===`);
      const roomKey = getRoomKey(roomId);
      const roomData = await redis.get(roomKey);
      console.log("Raw room data:", roomData);
      console.log("Type of room data:", typeof roomData);

      if (roomData) {
        try {
          const parsedData =
            typeof roomData === "string" ? JSON.parse(roomData) : roomData;
          console.log("Parsed room data:", parsedData);
        } catch (error) {
          console.error("Failed to parse room data:", error);
        }
      }

      // 3. 해당 방의 메시지 데이터 조회
      const messagesKey = getMessagesKey(roomId);
      const messages = await redis.lrange(messagesKey, 0, -1);
      console.log(`\n=== Messages for Room ${roomId} ===`);
      console.log("Number of messages:", messages.length);
      if (messages.length > 0) {
        console.log("First message:", messages[0]);
        console.log("Type of first message:", typeof messages[0]);
      }
    }
  } catch (error) {
    console.error("Inspection error:", error);
  }
}

export async function GET() {
  try {
    // 디버깅 정보 출력
    await inspectRedisData();

    const activeRooms = await redis.smembers("chat:active_rooms");
    console.log("Active rooms:", activeRooms);

    if (!activeRooms || activeRooms.length === 0) {
      return NextResponse.json({ rooms: [] });
    }

    const roomsData = await Promise.all(
      activeRooms.map(async (roomId) => {
        try {
          const data = await redis.get(getRoomKey(roomId));
          console.log(`Raw data for room ${roomId}:`, data);
          console.log(`Data type for room ${roomId}:`, typeof data);

          if (!data) return null;

          // 데이터가 이미 객체인 경우 그대로 사용, 문자열인 경우 파싱
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

          // ChatRoom 타입 검증
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
    const { content, sender, roomId, userId } = body;

    // 새로운 채팅방 생성
    if (!roomId && sender === "user") {
      const newRoomId = uuidv4();
      const chatRoom: ChatRoom = {
        id: newRoomId,
        userId: userId || "anonymous",
        lastMessage: content,
        updatedAt: Date.now(),
        unread: 1,
      };

      const message: Message = {
        id: uuidv4(),
        content,
        sender,
        timestamp: Date.now(),
      };

      // 문자열로 변환하여 저장
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

    // 기존 채팅방에 메시지 전송
    if (roomId) {
      const message: Message = {
        id: uuidv4(),
        content,
        sender,
        timestamp: Date.now(),
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
        const updatedRoom: ChatRoom = {
          ...chatRoom,
          lastMessage: content,
          updatedAt: Date.now(),
          unread:
            sender === "user" ? (chatRoom.unread || 0) + 1 : chatRoom.unread,
        };

        // 문자열로 변환하여 저장
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

import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import type { Message } from "@/types/chat";

const getMessagesKey = (roomId: string) => `chat:messages:${roomId}`;
const getRoomKey = (roomId: string) => `chat:room:${roomId}`;

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;
    const body = await request.json();
    const { messageIds } = body;

    if (messageIds && Array.isArray(messageIds)) {
      // 특정 메시지들의 읽음 상태 업데이트
      const messagesKey = getMessagesKey(roomId);
      const rawMessages = await redis.lrange(messagesKey, 0, -1);

      if (rawMessages && rawMessages.length > 0) {
        const updatedMessages = rawMessages.map((msgStr) => {
          try {
            const msg =
              typeof msgStr === "string" ? JSON.parse(msgStr) : msgStr;

            if (messageIds.includes(msg.id)) {
              return JSON.stringify({ ...msg, isRead: true });
            }
            return msgStr;
          } catch (error) {
            console.error("Error parsing message for read update:", error);
            return msgStr;
          }
        });

        // 기존 메시지 리스트 삭제 후 업데이트된 리스트로 교체
        await redis.del(messagesKey);
        if (updatedMessages.length > 0) {
          await redis.rpush(messagesKey, ...updatedMessages);
        }
      }
    } else {
      // 채팅방의 모든 안읽은 메시지를 읽음으로 표시 (기존 기능 유지)
      const messagesKey = getMessagesKey(roomId);
      const rawMessages = await redis.lrange(messagesKey, 0, -1);

      if (rawMessages && rawMessages.length > 0) {
        const updatedMessages = rawMessages.map((msgStr) => {
          try {
            const msg =
              typeof msgStr === "string" ? JSON.parse(msgStr) : msgStr;
            return JSON.stringify({ ...msg, isRead: true });
          } catch (error) {
            console.error("Error parsing message for read update:", error);
            return msgStr;
          }
        });

        // 기존 메시지 리스트 삭제 후 업데이트된 리스트로 교체
        await redis.del(messagesKey);
        if (updatedMessages.length > 0) {
          await redis.rpush(messagesKey, ...updatedMessages);
        }
      }

      // 채팅방의 unread 카운트를 0으로 설정
      const roomKey = getRoomKey(roomId);
      const roomData = await redis.get(roomKey);

      if (roomData) {
        try {
          const room =
            typeof roomData === "string" ? JSON.parse(roomData) : roomData;
          const updatedRoom = { ...room, unread: 0 };
          await redis.set(roomKey, JSON.stringify(updatedRoom));
        } catch (error) {
          console.error("Error updating room unread count:", error);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating read status:", error);
    return NextResponse.json(
      { error: "Failed to update read status" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import type { Message } from "@/types/chat";

const getMessagesKey = (roomId: string) => `chat:messages:${roomId}`;

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;
    const messagesKey = getMessagesKey(roomId);

    // Redis에서 메시지 히스토리 가져오기
    const rawMessages = await redis.lrange(messagesKey, 0, -1);

    if (!rawMessages || rawMessages.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    // 메시지 데이터 검증 및 처리
    const messages = rawMessages
      .map((msgStr) => {
        try {
          const msg = typeof msgStr === "string" ? JSON.parse(msgStr) : msgStr;

          // Message 타입 검증
          if (
            !msg ||
            typeof msg !== "object" ||
            !msg.id ||
            !msg.content ||
            !msg.sender ||
            typeof msg.timestamp !== "number"
          ) {
            console.error("Invalid message format:", msg);
            return null;
          }

          return {
            ...msg,
            isRead: msg.isRead ?? false, // 기본값 false
          } as Message;
        } catch (error) {
          console.error("Error parsing message:", error);
          return null;
        }
      })
      .filter((msg): msg is Message => msg !== null)
      .sort((a, b) => a.timestamp - b.timestamp);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages", messages: [] },
      { status: 500 }
    );
  }
}

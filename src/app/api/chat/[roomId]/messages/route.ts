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
    console.log(`Retrieved ${rawMessages.length} messages for room ${roomId}`);

    if (!rawMessages || rawMessages.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    // 메시지 데이터 검증 및 처리
    const messages = rawMessages
      .map((msg) => {
        // 타입과 필수 필드 검증
        if (!msg || typeof msg !== "object") {
          console.error("Invalid message format:", msg);
          return null;
        }

        // Message 타입 검증
        if (
          !("id" in msg) ||
          !("content" in msg) ||
          !("sender" in msg) ||
          !("timestamp" in msg)
        ) {
          console.error("Missing required message fields:", msg);
          return null;
        }

        return msg as Message;
      })
      .filter((msg): msg is Message => msg !== null)
      .sort((a, b) => a.timestamp - b.timestamp);

    console.log(
      `Processed ${messages.length} valid messages for room ${roomId}`
    );
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages", messages: [] },
      { status: 500 }
    );
  }
}

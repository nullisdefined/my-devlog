import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import type { ChatRoom } from "@/types/chat";

const getRoomKey = (roomId: string) => `chat:room:${roomId}`;

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;
    const roomKey = getRoomKey(roomId);

    const roomData = await redis.get(roomKey);
    if (!roomData) {
      return NextResponse.json(
        { error: "Chat room not found" },
        { status: 404 }
      );
    }

    // Redis 데이터를 문자열로 처리
    const roomDataStr =
      typeof roomData === "string" ? roomData : JSON.stringify(roomData);
    const chatRoom = JSON.parse(roomDataStr) as ChatRoom;

    const updatedRoom: ChatRoom = {
      ...chatRoom,
      unread: 0,
      updatedAt: Date.now(),
    };

    await redis.set(roomKey, JSON.stringify(updatedRoom));

    return NextResponse.json({
      success: true,
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Error marking as read:", error);
    return NextResponse.json(
      { error: "Failed to mark as read" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const getRoomKey = (roomId: string) => `chat:room:${roomId}`;
const getMessagesKey = (roomId: string) => `chat:messages:${roomId}`;

export async function DELETE(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // Redis에서 채팅방과 메시지 데이터 삭제
    await Promise.all([
      redis.del(getRoomKey(roomId)),
      redis.del(getMessagesKey(roomId)),
      redis.srem("chat:active_rooms", roomId),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/chat/[roomId]/delete:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, sender } = body;

    const message = {
      id: uuidv4(),
      content,
      sender,
      timestamp: Date.now(),
    };

    // Trigger the message event on the chat channel
    await pusherServer.trigger("chat", "message", message);

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

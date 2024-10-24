"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { Message } from "@/types/chat";
import { format } from "date-fns";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      const storedRoomId = sessionStorage.getItem("chatRoomId");
      if (storedRoomId) {
        setRoomId(storedRoomId);
        fetchMessages(storedRoomId);
        subscribeToRoom(storedRoomId);
      }
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.channel.unbind_all();
        pusherClient.unsubscribe(`chat-${channelRef.current.roomId}`);
        channelRef.current = null;
      }
    };
  }, [isOpen]);

  const fetchMessages = async (roomId: string) => {
    try {
      const response = await fetch(`/api/chat/${roomId}/messages`);
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const subscribeToRoom = (roomId: string) => {
    if (channelRef.current?.roomId === roomId) {
      return;
    }

    if (channelRef.current) {
      channelRef.current.channel.unbind_all();
      pusherClient.unsubscribe(`chat-${channelRef.current.roomId}`);
      channelRef.current = null;
    }

    const channel = pusherClient.subscribe(`chat-${roomId}`);
    channel.bind("message", (message: Message) => {
      setMessages((prev) => {
        const isDuplicate = prev.some((m) => m.id === message.id);
        if (isDuplicate) {
          return prev;
        }
        return [...prev, message];
      });
    });

    channelRef.current = {
      channel,
      roomId,
    };
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    try {
      let userId = sessionStorage.getItem("userId");
      if (!userId) {
        userId = crypto.randomUUID();
        sessionStorage.setItem("userId", userId);
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          sender: "user",
          roomId,
          userId,
        }),
      });

      const data = await response.json();

      if (!roomId && data.roomId) {
        setRoomId(data.roomId);
        sessionStorage.setItem("chatRoomId", data.roomId);
        subscribeToRoom(data.roomId);
      }

      // 즉시 메시지 목록에 추가
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }

      setNewMessage("");
      // 메시지 전송 후 입력창에 포커스
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // admin 페이지에서는 위젯을 렌더링하지 않음
  if (pathname === "/admin/chat") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {isOpen ? (
        // 외부 클릭 감지를 위한 overlay
        <div
          className="fixed inset-0 bg-transparent"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          {/* 채팅창 내부 클릭은 버블링 방지 */}
          <div
            className="fixed bottom-4 right-4 w-80 sm:w-96 bg-background border rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">채팅</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-3xl p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70">
                      {format(message.timestamp, "HH:mm")}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="메시지를 입력하세요"
                  className="flex-1 px-3 py-2 border rounded-3xl placeholder:text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground px-3 py-2 rounded-3xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

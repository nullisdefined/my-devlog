"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { Message } from "@/types/chat";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import ScrollableSection from "@/components/ui/scrollable-section";

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

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const dateKey = format(message.timestamp, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return Object.entries(groups);
  };

  useEffect(() => {
    if (isOpen) {
      const storedRoomId = sessionStorage.getItem("chatRoomId");
      if (storedRoomId) {
        setRoomId(storedRoomId);
        fetchMessages(storedRoomId);
        subscribeToRoom(storedRoomId);
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
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
        const isDuplicate = prev.some(
          (m) =>
            m.id === message.id ||
            (m.content === message.content &&
              m.timestamp === message.timestamp &&
              m.sender === message.sender)
        );
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

    const inputElement = inputRef.current;
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

        if (data.message) {
          setMessages([data.message]);
        }
      }

      setNewMessage("");
      if (inputElement) {
        inputElement.focus();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (pathname === "/admin/chat") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {isOpen ? (
        <div
          className="fixed inset-0 bg-transparent"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div
            className={`
              fixed bottom-4 right-4 w-80 sm:w-96 
              bg-white dark:bg-gray-900 
              rounded-lg
              shadow-[0_8px_30px_rgb(0,0,0,0.12)]
              dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]
              animate-in slide-in-from-bottom-2 duration-200
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                채팅
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ScrollableSection className="h-96 p-4 space-y-4 bg-gray-50/50 dark:bg-gray-950/50">
              {groupMessagesByDate(messages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="flex items-center justify-center my-4">
                    <div className="border-t border-gray-200 dark:border-gray-800 flex-grow" />
                    <span className="px-4 text-xs text-gray-500 dark:text-gray-400">
                      {format(msgs[0].timestamp, "yyyy년 M월 d일", {
                        locale: ko,
                      })}
                    </span>
                    <div className="border-t border-gray-200 dark:border-gray-800 flex-grow" />
                  </div>
                  {msgs.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      } mb-2`}
                    >
                      <div
                        className={`max-w-[85%] rounded-3xl p-3 ${
                          message.sender === "user"
                            ? "bg-emerald-500 dark:bg-emerald-600 text-white"
                            : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-[10px] opacity-70">
                          {format(message.timestamp, "HH:mm")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollableSection>
            <form
              onSubmit={handleSubmit}
              className="p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="메시지를 입력하세요"
                  className="flex-1 px-3 py-2 
                    bg-white dark:bg-gray-900
                    text-gray-900 dark:text-gray-100
                    rounded-3xl placeholder:text-sm text-sm 
                    shadow-[0_2px_10px_rgb(0,0,0,0.06)]
                    dark:shadow-[0_2px_10px_rgb(0,0,0,0.2)]
                    focus:shadow-[0_2px_15px_rgb(0,0,0,0.1)]
                    dark:focus:shadow-[0_2px_15px_rgb(0,0,0,0.3)]
                    focus:outline-none focus:ring-1 
                    focus:ring-emerald-500 dark:focus:ring-emerald-500
                    placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-500 hover:bg-emerald-600 
                    dark:bg-emerald-600 dark:hover:bg-emerald-700
                    text-white px-3 py-2 rounded-3xl 
                    transition-colors disabled:opacity-50 
                    flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 
            bg-emerald-500/10 hover:bg-emerald-500/20 
            dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30
            rounded-full transition-all duration-300 
            backdrop-blur-sm
            animate-in fade-in slide-in-from-bottom-2"
        >
          <MessageCircle className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
        </button>
      )}
    </div>
  );
}

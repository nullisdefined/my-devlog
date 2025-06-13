"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { Message } from "@/types/chat";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { MessageCircle, X, Send, Loader2, LogOut, User } from "lucide-react";
import ScrollableSection from "@/components/ui/scrollable-section";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<any>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();

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

  // 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest(".user-menu-container")) {
          setShowUserMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

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
    if (!session?.user) return;

    const inputElement = inputRef.current;
    setIsLoading(true);
    try {
      const userId = session.user.email || session.user.name || "unknown";
      const userName =
        (session.user as any).username || session.user.name || "Unknown"; // GitHub username 우선 사용
      const userImage = session.user.image || "";

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
          userName,
          userImage,
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

  const handleLogout = async () => {
    try {
      // 채팅 세션 정리
      sessionStorage.removeItem("chatRoomId");
      setRoomId(null);
      setMessages([]);

      // Pusher 채널 정리
      if (channelRef.current) {
        channelRef.current.channel.unbind_all();
        pusherClient.unsubscribe(`chat-${channelRef.current.roomId}`);
        channelRef.current = null;
      }

      // NextAuth 로그아웃
      await signOut({ redirect: false });

      setShowUserMenu(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (pathname === "/admin/chat") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] hidden md:block">
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
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                채팅
              </h3>
              <div className="flex items-center gap-2">
                {/* 사용자 메뉴 */}
                {status === "authenticated" && session?.user && (
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {(session.user.name || "U").slice(0, 1).toUpperCase()}
                        </div>
                      )}
                    </button>

                    {/* 사용자 드롭다운 메뉴 */}
                    {showUserMenu && (
                      <div className="absolute right-0 bottom-full mb-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3">
                            {session.user.image ? (
                              <Image
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {(session.user.name || "U")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                {session.user.name || "사용자"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {session.user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-1">
                          {(session.user as any).username && (
                            <a
                              href={`https://github.com/${
                                (session.user as any).username
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <svg
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.468-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.046.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.104.823 2.225 0 1.606-.015 2.898-.015 3.293 0 .322.218.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z" />
                              </svg>
                              GitHub Profile
                            </a>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 닫기 버튼 */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 메시지 영역 */}
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
                      {message.sender === "admin" && (
                        <div className="w-8 h-8 rounded-full mr-2 overflow-hidden">
                          <Image
                            src="https://avatars.githubusercontent.com/u/164657817?v=4"
                            alt="Admin"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-3xl p-3 ${
                          message.sender === "user"
                            ? "bg-emerald-500 dark:bg-emerald-600 text-white"
                            : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                        }`}
                      >
                        {message.sender === "admin" && (
                          <div className="text-xs font-semibold mb-1 text-gray-600 dark:text-gray-300">
                            Jaewoo Kim
                          </div>
                        )}
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

            {/* 입력 영역 */}
            <form
              onSubmit={handleSubmit}
              className="p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
            >
              {status !== "authenticated" ? (
                <button
                  type="button"
                  onClick={() => signIn("github")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-3xl bg-black hover:bg-neutral-900 text-white font-semibold shadow"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="mr-2"
                  >
                    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.468-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.046.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.104.823 2.225 0 1.606-.015 2.898-.015 3.293 0 .322.218.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  Sign in with GitHub
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
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
              )}
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

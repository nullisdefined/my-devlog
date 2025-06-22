/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { pusherClient } from "@/lib/pusher";
import { Message, ChatRoom } from "@/types/chat";
import { format } from "date-fns";
import {
  Loader2,
  Lock,
  Trash2,
  MoreVertical,
  Send,
  LogOut,
  User,
  X,
  ExternalLink,
} from "lucide-react";
import ScrollableSection from "@/components/ui/scrollable-section";
import { formatMessageDate } from "@/lib/date";
import Image from "next/image";

// 사용자 정보 모달 컴포넌트
function UserInfoModal({
  user,
  onClose,
}: {
  user: { userId: string; userName?: string; userImage?: string } | null;
  onClose: () => void;
}) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            User Info
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            {user.userImage ? (
              <Image
                src={user.userImage}
                alt={user.userName || "User"}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user.userId.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {user.userName || `User ${user.userId.slice(0, 8)}`}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {user.userId}
              </p>
            </div>
          </div>
          {user.userName && (
            <div className="mt-4">
              <a
                href={`https://github.com/${user.userName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg transition-colors"
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
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoginForm({
  onAuth,
}: {
  onAuth: (password: string) => Promise<void>;
}) {
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError("");

    try {
      await onAuth(password);
      setPassword("");
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "인증 중 오류가 발생했습니다."
      );
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            관리자 인증
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            관리자 페이지에 접근하려면 패스워드를 입력하세요
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div>
            <label htmlFor="password" className="sr-only">
              패스워드
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="패스워드"
              disabled={isAuthLoading}
            />
          </div>
          {authError && (
            <div className="text-red-600 dark:text-red-400 text-sm text-center">
              {authError}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={isAuthLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAuthLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "로그인"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminChatPage() {
  // 모든 state와 ref를 최상단에 선언
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_authenticated") === "true";
    }
    return false;
  });
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission | null>(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState<{
    userId: string;
    userName?: string;
    userImage?: string;
  } | null>(null);

  const channelRefs = useRef<Record<string, any>>({});
  const adminChannelRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 모든 callback과 함수를 선언
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const showNotification = useCallback(
    (title: string, body: string) => {
      if (notificationPermission === "granted") {
        new Notification(title, {
          body,
          icon: "/favicon.ico",
          badge: "/favicon.ico",
        });
      }
    },
    [notificationPermission]
  );

  const updateChatRoomList = useCallback(
    (roomId: string, newMessage: Message) => {
      setChatRooms((prev) => {
        return prev
          .map((room) => {
            if (room.id === roomId) {
              const isUnread = selectedRoom !== roomId;

              // 새 메시지가 오고 현재 선택된 채팅방이 아닐 때 알림 표시
              if (newMessage.sender === "user" && selectedRoom !== roomId) {
                const displayName =
                  newMessage.userName || `User ${room.userId.slice(0, 8)}`;
                showNotification(displayName, newMessage.content);
              }

              return {
                ...room,
                lastMessage: newMessage.content,
                updatedAt: newMessage.timestamp,
                unread: isUnread ? (room.unread || 0) + 1 : 0,
                userName: newMessage.userName || room.userName,
                userImage: newMessage.userImage || room.userImage,
              };
            }
            return room;
          })
          .sort((a, b) => b.updatedAt - a.updatedAt);
      });
    },
    [selectedRoom, showNotification]
  );

  const fetchChatRooms = useCallback(async () => {
    try {
      const response = await fetch("/api/chat");
      const data = await response.json();

      // 기존 순서 유지 - 서버에서 온 순서대로 설정
      setChatRooms(data.rooms || []);

      // 각 채팅방에 직접 구독
      data.rooms.forEach((room: ChatRoom) => {
        const roomId = room.id;
        if (roomId && !channelRefs.current[roomId]) {
          const channel = pusherClient.subscribe(`chat-${roomId}`);
          channel.bind("message", (message: Message) => {
            if (selectedRoom === roomId) {
              setMessages((prev) => {
                // ID로 먼저 체크하고, ID가 없거나 같으면 내용과 시간으로 체크
                const isDuplicate = prev.some(
                  (m) =>
                    (m.id && message.id && m.id === message.id) ||
                    (m.content === message.content &&
                      Math.abs(
                        new Date(m.timestamp).getTime() -
                          new Date(message.timestamp).getTime()
                      ) < 1000 &&
                      m.sender === message.sender)
                );
                if (isDuplicate) return prev;
                return [...prev, message];
              });
            }
            updateChatRoomList(roomId, message);
          });
          channelRefs.current[roomId] = { channel, roomId };
        }
      });
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
      setChatRooms([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRoom, updateChatRoomList]);

  const setupAdminNotifications = useCallback(() => {
    if (!adminChannelRef.current) {
      const channel = pusherClient.subscribe("admin-notifications");
      channel.bind("new-chat", handleNewChat);
      adminChannelRef.current = channel;
    }
  }, []);

  const handleNewChat = useCallback(
    (chatRoom: ChatRoom) => {
      setChatRooms((prev) => {
        const exists = prev.some((room) => room.id === chatRoom.id);
        if (exists) return prev;

        // 새로운 채팅방 알림
        const displayName =
          chatRoom.userName || `User ${chatRoom.userId.slice(0, 8)}`;
        showNotification(
          "새로운 채팅",
          `${displayName}님이 채팅을 시작했습니다.`
        );

        return [chatRoom, ...prev].sort((a, b) => b.updatedAt - a.updatedAt);
      });
      const roomId = chatRoom.id;
      if (roomId && !channelRefs.current[roomId]) {
        const channel = pusherClient.subscribe(`chat-${roomId}`);
        channel.bind("message", (message: Message) => {
          if (selectedRoom === roomId) {
            setMessages((prev) => {
              // ID로 먼저 체크하고, ID가 없거나 같으면 내용과 시간으로 체크
              const isDuplicate = prev.some(
                (m) =>
                  (m.id && message.id && m.id === message.id) ||
                  (m.content === message.content &&
                    Math.abs(
                      new Date(m.timestamp).getTime() -
                        new Date(message.timestamp).getTime()
                    ) < 1000 &&
                    m.sender === message.sender)
              );
              if (isDuplicate) return prev;
              return [...prev, message];
            });
          }

          updateChatRoomList(roomId, message);
        });

        channelRefs.current[roomId] = { channel, roomId };
      }
    },
    [selectedRoom, updateChatRoomList, showNotification]
  );

  const initializeAdmin = useCallback(async () => {
    await fetchChatRooms();
    setupAdminNotifications();

    // 어드민 페이지 접속 시 읽지 않은 메시지 정리
    if (typeof window !== "undefined") {
      const { unreadMessages } = await import("@/lib/notification");
      unreadMessages.clear();
    }
  }, [fetchChatRooms, setupAdminNotifications]);

  const cleanup = useCallback(() => {
    Object.values(channelRefs.current).forEach(({ channel, roomId }) => {
      channel.unbind_all();
      pusherClient.unsubscribe(`chat-${roomId}`);
    });
    channelRefs.current = {};

    if (adminChannelRef.current) {
      adminChannelRef.current.unbind_all();
      pusherClient.unsubscribe("admin-notifications");
      adminChannelRef.current = null;
    }
  }, []);

  const fetchMessages = useCallback(async (roomId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch(`/api/chat/${roomId}/messages`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch messages");
      }

      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const markAsRead = useCallback(async (roomId: string) => {
    try {
      await fetch(`/api/chat/${roomId}/read`, { method: "POST" });
      setChatRooms((prev) =>
        prev.map((room) => (room.id === roomId ? { ...room, unread: 0 } : room))
      );

      // localStorage에서 해당 채팅방의 읽지 않은 메시지 정리
      if (typeof window !== "undefined") {
        const { unreadMessages } = await import("@/lib/notification");
        unreadMessages.clear();
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  }, []);

  const handleRoomSelect = useCallback(
    async (roomId: string) => {
      setSelectedRoom(roomId);
      setMessages([]); // 메시지 초기화
      setIsLoadingMessages(true);

      try {
        await Promise.all([fetchMessages(roomId), markAsRead(roomId)]);
      } finally {
        setIsLoadingMessages(false);
        // 메시지 로드 후 스크롤 및 포커스
        setTimeout(() => {
          scrollToBottom();
          inputRef.current?.focus();
        }, 100);
      }
    },
    [fetchMessages, markAsRead, scrollToBottom]
  );

  const handleDeleteRoom = useCallback(
    async (roomId: string) => {
      setDeletingRoomId(roomId);
      try {
        const response = await fetch(`/api/chat/${roomId}/delete`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete room");
        }

        // 로컬 상태에서 채팅방 제거
        setChatRooms((prev) => prev.filter((room) => room.id !== roomId));

        // 현재 선택된 채팅방이 삭제된 경우 초기화
        if (selectedRoom === roomId) {
          setSelectedRoom(null);
          setMessages([]);
        }

        // Pusher 채널 정리
        if (channelRefs.current[roomId]) {
          const { channel } = channelRefs.current[roomId];
          channel.unbind_all();
          pusherClient.unsubscribe(`chat-${roomId}`);
          delete channelRefs.current[roomId];
        }
      } catch (error) {
        console.error("Failed to delete room:", error);
        alert("채팅방 삭제에 실패했습니다.");
      } finally {
        setDeletingRoomId(null);
        setShowDeleteConfirm(null);
        setShowDeleteMenu(false);
      }
    },
    [selectedRoom]
  );

  const handleDeleteClick = useCallback((roomId: string) => {
    setShowDeleteConfirm(roomId);
    setShowDeleteMenu(false);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(null);
    setShowDeleteMenu(false);
  }, []);

  const handleAuth = async (password: string) => {
    const response = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_authenticated", "true");
    } else {
      throw new Error("잘못된 패스워드입니다.");
    }
  };

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_authenticated");
    setChatRooms([]);
    setSelectedRoom(null);
    setMessages([]);
    cleanup();
  }, [cleanup]);

  const handleProfileClick = useCallback((room: ChatRoom) => {
    setSelectedUserInfo({
      userId: room.userId,
      userName: room.userName,
      userImage: room.userImage,
    });
  }, []);

  // 모든 useEffect를 선언
  useEffect(() => {
    if (isAuthenticated) {
      // 알림 권한 요청
      if ("Notification" in window) {
        if (Notification.permission === "default") {
          Notification.requestPermission().then((permission) => {
            setNotificationPermission(permission);
          });
        } else {
          setNotificationPermission(Notification.permission);
        }
      }

      initializeAdmin();
      return () => cleanup();
    }
  }, [isAuthenticated, initializeAdmin, cleanup]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (selectedRoom) {
      inputRef.current?.focus();
    }
  }, [selectedRoom]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDeleteMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest(".relative")) {
          setShowDeleteMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDeleteMenu]);

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const dateKey = format(message.timestamp, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return groups;
  };

  // 시간 표시 여부를 결정하는 함수
  const shouldShowTimestamp = (
    currentMessage: Message,
    previousMessage: Message | null,
    isLastMessage: boolean
  ) => {
    if (!previousMessage) return true;

    // 각 날짜 그룹의 마지막 메시지는 항상 시간 표시
    if (isLastMessage) return true;

    const currentTime = new Date(currentMessage.timestamp);
    const previousTime = new Date(previousMessage.timestamp);
    const timeDiffInMinutes =
      Math.abs(currentTime.getTime() - previousTime.getTime()) / (1000 * 60);

    // 다른 발신자이거나 1분 이상 차이가 나면 시간 표시
    return (
      currentMessage.sender !== previousMessage.sender || timeDiffInMinutes >= 1
    );
  };

  const renderMessages = () => {
    const groupedMessages = groupMessagesByDate(messages);

    return Object.entries(groupedMessages).map(([date, msgs]) => (
      <div key={date}>
        <div className="flex items-center justify-center my-4">
          <div className="border-t border-gray-200 dark:border-gray-800 flex-grow" />
          <span className="px-4 text-xs text-gray-500 dark:text-gray-400">
            {formatMessageDate(msgs[0].timestamp)}
          </span>
          <div className="border-t border-gray-200 dark:border-gray-800 flex-grow" />
        </div>
        {msgs.map((message, index) => {
          const previousMessage = index > 0 ? msgs[index - 1] : null;
          const isLastMessage = index === msgs.length - 1;
          const showTimestamp = shouldShowTimestamp(
            message,
            previousMessage,
            isLastMessage
          );

          return (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "admin" ? "justify-end" : "justify-start"
              } ${showTimestamp ? "mb-4" : "mb-1"}`}
            >
              {message.sender === "user" && (
                <div className="mr-2 flex-shrink-0">
                  {message.userImage ? (
                    <Image
                      src={message.userImage}
                      alt={message.userName || "User"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border border-border object-cover cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
                      onClick={() =>
                        setSelectedUserInfo({
                          userId:
                            chatRooms.find((room) => room.id === selectedRoom)
                              ?.userId || "unknown",
                          userName: message.userName,
                          userImage: message.userImage,
                        })
                      }
                    />
                  ) : (
                    <div
                      className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-xs cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
                      onClick={() =>
                        setSelectedUserInfo({
                          userId:
                            chatRooms.find((room) => room.id === selectedRoom)
                              ?.userId || "unknown",
                          userName: message.userName,
                          userImage: message.userImage,
                        })
                      }
                    >
                      {(
                        message.userName ||
                        chatRooms.find((room) => room.id === selectedRoom)
                          ?.userId ||
                        "U"
                      )
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </div>
              )}
              <div
                className={`flex flex-col ${
                  message.sender === "admin" ? "items-end" : "items-start"
                } max-w-[70%]`}
              >
                <div
                  className={`rounded-2xl p-3 shadow-sm ${
                    message.sender === "admin"
                      ? "bg-emerald-500 dark:bg-emerald-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {message.sender === "user" && message.userName && (
                    <div className="text-xs font-semibold mb-1 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      {message.userName}
                    </div>
                  )}
                  <p className="text-sm break-words">{message.content}</p>
                </div>
                {showTimestamp && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                    {format(message.timestamp, "HH:mm")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    ));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom || isSending) return;

    setIsSending(true);
    const messageContent = newMessage;
    setNewMessage(""); // 즉시 입력창 비우기

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: messageContent,
          sender: "admin",
          roomId: selectedRoom,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // localStorage에서 읽지 않은 메시지 정리 (관리자가 답장을 보냈으므로)
      if (typeof window !== "undefined") {
        const { unreadMessages } = await import("@/lib/notification");
        unreadMessages.clear();
      }

      // 전송 후 포커스 처리
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);

      // 스크롤 처리
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
      // 실패시 메시지 복원
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);

      // 성공/실패 관계없이 포커스 처리
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  // 조건부 렌더링
  if (!isAuthenticated) {
    return <LoginForm onAuth={handleAuth} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* 사용자 정보 모달 */}
      <UserInfoModal
        user={selectedUserInfo}
        onClose={() => setSelectedUserInfo(null)}
      />

      {/* 채팅방 목록 */}
      <div className="w-1/4 border-r overflow-y-auto mt-16">
        {chatRooms.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">활성 채팅방이 없습니다</p>
          </div>
        ) : (
          chatRooms.map((room) => (
            <div
              key={room.id}
              className={`relative group p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
                selectedRoom === room.id ? "bg-gray-50 dark:bg-gray-900" : ""
              }`}
            >
              <div
                className="cursor-pointer"
                onClick={() => handleRoomSelect(room.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className="cursor-pointer hover:ring-2 hover:ring-emerald-500 rounded-full transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProfileClick(room);
                      }}
                    >
                      {room.userImage ? (
                        <Image
                          src={room.userImage}
                          alt={room.userName || "User"}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {room.userId.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {room.userName || `User ${room.userId.slice(0, 8)}`}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(room.updatedAt, "HH:mm")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {room.unread > 0 && (
                      <div className="w-5 h-5 bg-red-500 dark:bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                          {room.unread > 9 ? "9+" : room.unread}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-2 pr-8">
                  {room.lastMessage}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 채팅창 */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950 mt-16">
        {selectedRoom ? (
          <>
            <div className="p-4 border-b bg-white dark:bg-gray-900 shadow-sm relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const currentRoom = chatRooms.find(
                      (room) => room.id === selectedRoom
                    );
                    return (
                      <>
                        <div
                          className="cursor-pointer hover:ring-2 hover:ring-emerald-500 rounded-full transition-all"
                          onClick={() =>
                            currentRoom && handleProfileClick(currentRoom)
                          }
                        >
                          {currentRoom?.userImage ? (
                            <Image
                              src={currentRoom.userImage}
                              alt={currentRoom.userName || "User"}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                              {currentRoom?.userId.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                          {currentRoom?.userName ||
                            `User ${currentRoom?.userId.slice(0, 8)}`}
                        </h2>
                      </>
                    );
                  })()}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>

                  {showDeleteMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-30">
                      <button
                        onClick={() => handleDeleteClick(selectedRoom)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        채팅방 삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 삭제 확인 모달 */}
              {showDeleteConfirm === selectedRoom && (
                <div className="absolute inset-0 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg p-4 z-40 shadow-xl">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    채팅방을 삭제하시겠습니까?
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                    모든 메시지가 영구적으로 삭제됩니다.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteRoom(selectedRoom)}
                      className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                      disabled={deletingRoomId === selectedRoom}
                    >
                      {deletingRoomId === selectedRoom ? (
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      ) : (
                        "삭제"
                      )}
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>
            <ScrollableSection className="flex-1 p-4 space-y-4">
              {isLoadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                </div>
              ) : (
                <>
                  {renderMessages()}
                  <div ref={messagesEndRef} />
                </>
              )}
            </ScrollableSection>
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white dark:bg-gray-900 border-t"
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="메시지를 입력하세요"
                  className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-3 py-2 rounded-full transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            채팅방을 선택해주세요
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { pusherClient } from "@/lib/pusher";
import { Message, ChatRoom } from "@/types/chat";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import ScrollableSection from "@/components/ui/scrollable-section";
import { formatMessageDate } from "@/lib/date";

export default function AdminChatPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const channelRefs = useRef<Record<string, any>>({});
  const adminChannelRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeAdmin();
    return () => cleanup();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedRoom) {
      inputRef.current?.focus();
    }
  }, [selectedRoom]);

  const initializeAdmin = async () => {
    await fetchChatRooms();
    setupAdminNotifications();
  };

  const cleanup = () => {
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
  };

  const setupAdminNotifications = () => {
    if (!adminChannelRef.current) {
      const channel = pusherClient.subscribe("admin-notifications");
      channel.bind("new-chat", handleNewChat);
      adminChannelRef.current = channel;
    }
  };

  const handleNewChat = (chatRoom: ChatRoom) => {
    setChatRooms((prev) => {
      const exists = prev.some((room) => room.id === chatRoom.id);
      if (exists) return prev;
      return [chatRoom, ...prev].sort((a, b) => b.updatedAt - a.updatedAt);
    });
    subscribeToRoom(chatRoom.id);
  };

  const fetchChatRooms = async () => {
    try {
      const response = await fetch("/api/chat");
      const data = await response.json();
      setChatRooms(data.rooms || []);

      data.rooms.forEach((room: ChatRoom) => {
        subscribeToRoom(room.id);
      });
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
      setChatRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToRoom = (roomId: string) => {
    if (channelRefs.current[roomId]) return;

    const channel = pusherClient.subscribe(`chat-${roomId}`);
    channel.bind("message", (message: Message) => {
      if (selectedRoom === roomId) {
        setMessages((prev) => {
          const isDuplicate = prev.some((m) => m.id === message.id);
          if (isDuplicate) return prev;
          return [...prev, message];
        });
      }

      updateChatRoomList(roomId, message);
    });

    channelRefs.current[roomId] = { channel, roomId };
  };

  const updateChatRoomList = (roomId: string, message: Message) => {
    setChatRooms((prev) =>
      prev
        .map((room) => {
          if (room.id === roomId) {
            return {
              ...room,
              lastMessage: message.content,
              updatedAt: message.timestamp,
              unread:
                selectedRoom === roomId
                  ? 0
                  : room.unread + (message.sender === "user" ? 1 : 0),
            };
          }
          return room;
        })
        .sort((a, b) => b.updatedAt - a.updatedAt)
    );
  };

  const fetchMessages = async (roomId: string) => {
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
  };

  const markAsRead = async (roomId: string) => {
    try {
      await fetch(`/api/chat/${roomId}/read`, { method: "POST" });
      setChatRooms((prev) =>
        prev.map((room) => (room.id === roomId ? { ...room, unread: 0 } : room))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleRoomSelect = async (roomId: string) => {
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
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
        {msgs.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "admin" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${
                message.sender === "admin"
                  ? "bg-emerald-500 dark:bg-emerald-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              <p className="text-sm break-words">{message.content}</p>
              <p className="text-xs mt-1 opacity-80">
                {format(message.timestamp, "HH:mm")}
              </p>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom || isSending) return;

    setIsSending(true);
    try {
      const tempMessage: Message = {
        id: crypto.randomUUID(),
        content: newMessage,
        sender: "admin",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, tempMessage]);

      await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          sender: "admin",
          roomId: selectedRoom,
        }),
      });

      setNewMessage("");
      // 전송 후 포커스 처리
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      // 스크롤 처리
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r overflow-y-auto">
        {chatRooms.map((room) => (
          <div
            key={room.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
              selectedRoom === room.id ? "bg-gray-50 dark:bg-gray-900" : ""
            }`}
            onClick={() => handleRoomSelect(room.id)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                User {room.userId.slice(0, 6)}
              </span>
              {room.unread > 0 && (
                <span className="px-2 py-1 text-xs font-semibold text-white bg-emerald-500 dark:bg-emerald-600 rounded-full shadow-sm animate-pulse">
                  {room.unread}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
              {room.lastMessage}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {format(room.updatedAt, "yyyy-MM-dd HH:mm")}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950">
        {selectedRoom ? (
          <>
            <div className="p-4 border-b bg-white dark:bg-gray-900 shadow-sm">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                User{" "}
                {chatRooms
                  .find((room) => room.id === selectedRoom)
                  ?.userId.slice(0, 6)}
              </h2>
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
                  className="px-4 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-full hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "전송"
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

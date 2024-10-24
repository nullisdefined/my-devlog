"use client";

import { useState, useEffect, useRef } from "react";
import { pusherClient } from "@/lib/pusher";
import { Message, ChatRoom } from "@/types/chat";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

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

  useEffect(() => {
    initializeAdmin();
    return () => cleanup();
  }, []);

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

    console.log("Subscribing to room:", roomId);
    const channel = pusherClient.subscribe(`chat-${roomId}`);

    channel.bind("message", (message: Message) => {
      console.log("Received new message:", message);

      if (selectedRoom === roomId) {
        setMessages((prev) => {
          const isDuplicate = prev.some((m) => m.id === message.id);
          if (isDuplicate) {
            console.log("Duplicate message detected:", message.id);
            return prev;
          }
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
      console.log("Fetching messages for room:", roomId);
      const response = await fetch(`/api/chat/${roomId}/messages`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch messages");
      }

      console.log("Received messages:", data.messages);

      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else {
        console.error("Invalid messages format:", data);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
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
    console.log("Selecting room:", roomId);
    setSelectedRoom(roomId);
    setMessages([]);
    await Promise.all([fetchMessages(roomId), markAsRead(roomId)]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom || isSending) return;

    setIsSending(true);
    try {
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
        {chatRooms.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            아직 채팅방이 없습니다
          </div>
        ) : (
          chatRooms.map((room) => (
            <div
              key={room.id}
              className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                selectedRoom === room.id ? "bg-accent" : ""
              }`}
              onClick={() => handleRoomSelect(room.id)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  User {room.userId.slice(0, 6)}
                </span>
                {room.unread > 0 && (
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                    {room.unread}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {room.lastMessage}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(room.updatedAt, "yyyy-MM-dd HH:mm")}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto">
              {isLoadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "admin"
                        ? "justify-end"
                        : "justify-start"
                    } mb-4`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === "admin"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="break-words">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {format(message.timestamp, "HH:mm")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="메시지를 입력하세요"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
                  disabled={isSending}
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
          <div className="flex items-center justify-center h-full text-muted-foreground">
            채팅방을 선택해주세요
          </div>
        )}
      </div>
    </div>
  );
}

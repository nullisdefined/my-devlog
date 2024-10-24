"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { unreadMessages } from "@/lib/notification";
import { MessageCircle } from "lucide-react";

export function AdminChatLink() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 초기 읽지 않은 메시지 수 설정
    setUnreadCount(unreadMessages.getCount());

    // 주기적으로 확인
    const interval = setInterval(() => {
      setUnreadCount(unreadMessages.getCount());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/admin/chat"
      className="relative flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md"
    >
      <MessageCircle className="h-4 w-4" />
      <span>채팅 관리</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}

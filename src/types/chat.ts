export interface Message {
  id: string;
  content: string;
  sender: "user" | "admin";
  timestamp: number;
  userName?: string;
  userImage?: string;
  isRead?: boolean;
}

export interface ChatRoom {
  id: string;
  userId: string;
  userName?: string;
  userImage?: string;
  lastMessage?: string;
  updatedAt: number;
  unread: number;
}

export interface PusherMessage {
  type: "message";
  data: Message;
}

export interface PusherNewChat {
  type: "new-chat";
  data: ChatRoom;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "admin";
  timestamp: number;
}

export interface ChatRoom {
  id: string;
  userId: string;
  userName?: string;
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

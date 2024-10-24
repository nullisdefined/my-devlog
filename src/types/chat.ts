export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

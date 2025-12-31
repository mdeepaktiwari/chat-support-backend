export interface Session {
  id: string;
  created_at: Date;
  updated_at: Date;
  user_metadata: Record<string, any>;
  message_count: number;
}

export interface Message {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: Date;
  token_count?: number;
  metadata: Record<string, any>;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  created_at: Date;
  updated_at: Date;
}

export interface ConversationHistory {
  role: "user" | "assistant";
  content: string;
}

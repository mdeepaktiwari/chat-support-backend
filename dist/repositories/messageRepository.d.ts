import { Message, ConversationHistory } from "../models/types";
export declare const createMessage: (sessionId: string, role: "user" | "assistant" | "system", content: string, tokenCount?: number, metadata?: Record<string, any>) => Promise<Message>;
export declare const findMessagesBySessionId: (sessionId: string, limit?: number) => Promise<Message[]>;
export declare const getConversationHistory: (sessionId: string, limit?: number) => Promise<ConversationHistory[]>;
export declare const countMessagesBySessionId: (sessionId: string) => Promise<number>;

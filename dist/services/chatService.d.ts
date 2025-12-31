import { ChatMessageInput } from "./validation";
export interface ChatResponse {
    reply: string;
    sessionId: string;
    timestamp: Date;
}
export interface LLMService {
    generateReply: (history: any[]) => Promise<{
        content: string;
        tokenCount?: number;
        model?: string;
    }>;
}
export declare const processMessage: (input: ChatMessageInput, llmService: LLMService, maxMessagesPerSession?: number) => Promise<ChatResponse>;
export declare const getSessionHistory: (sessionId: string) => Promise<Array<{
    role: string;
    content: string;
    timestamp: Date;
}>>;

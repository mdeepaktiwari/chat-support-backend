import { LLMConfig, LLMMessage, LLMResponse } from "./types";
export declare const initializeLLMService: (config: LLMConfig, apiKey: string) => {
    generateReply: (conversationHistory: LLMMessage[]) => Promise<LLMResponse>;
};
export declare const formatConversationHistory: (history: Array<{
    role: string;
    content: string;
}>) => LLMMessage[];

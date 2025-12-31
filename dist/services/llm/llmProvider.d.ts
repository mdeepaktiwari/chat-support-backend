import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMMessage, LLMResponse, LLMConfig } from "./types";
export declare const createGeminiClient: (apiKey: string) => GoogleGenerativeAI;
export declare const generateGeminiReply: (client: GoogleGenerativeAI, config: LLMConfig, messages: LLMMessage[], systemPrompt: string) => Promise<LLMResponse>;

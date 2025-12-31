export interface LLMConfig {
  provider: "anthropic" | "openai" | "gemini";
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LLMResponse {
  content: string;
  tokenCount?: number;
  model?: string;
}

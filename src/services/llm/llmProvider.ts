import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMMessage, LLMResponse, LLMConfig } from "./types";

export const createGeminiClient = (apiKey: string): GoogleGenerativeAI => {
  return new GoogleGenerativeAI(apiKey);
};

export const generateGeminiReply = async (
  client: GoogleGenerativeAI,
  config: LLMConfig,
  messages: LLMMessage[],
  systemPrompt: string
): Promise<LLMResponse> => {
  try {
    // Get the generative model
    const model = client.getGenerativeModel({
      model: config.model,
      systemInstruction: systemPrompt,
    });

    // Convert conversation history to Gemini format
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      throw new Error("Last message must be from user");
    }

    // Start chat with history
    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
      },
    });

    // Send the last message and get response
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;
    const text = response.text();

    return {
      content: text,
      tokenCount: response.usageMetadata?.candidatesTokenCount || 0,
      model: config.model,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
    throw error;
  }
};
import { LLMConfig, LLMMessage, LLMResponse } from "./types";
import {
  createGeminiClient,
  generateGeminiReply,
} from "./llmProvider";
import { GoogleGenerativeAI } from "@google/generative-ai";

const HARDCODED_KNOWLEDGE_BASE = `
SHIPPING POLICY:
- Free standard shipping on orders over $50 within the continental US (5-7 business days)
- Canada shipping: $15 flat rate
- International shipping: $25 flat rate
- Express shipping available for additional fee
- Orders are processed within 24 hours on business days
- Tracking number provided via email once shipped

RETURN & REFUND POLICY:
- 30-day money-back guarantee
- Items must be unused and in original packaging
- Full refund issued to original payment method
- To initiate a return, contact us with your order number
- We provide a prepaid shipping label for returns
- Refunds processed within 5-7 business days after receiving the returned item

SUPPORT HOURS:
- Monday-Friday: 9 AM - 6 PM EST
- Closed on weekends and major holidays
- Email: support@example.com (24-hour response time)
- Phone: 1-800-555-0123
- Live chat available during business hours

PAYMENT METHODS:
- All major credit cards accepted (Visa, Mastercard, American Express, Discover)
- PayPal, Apple Pay, Google Pay
- All transactions secured with 256-bit SSL encryption
- We do not store credit card information on our servers

ORDER TRACKING:
- Tracking link sent via email once order ships
- Track orders at: https://example.com/track
- Check spam folder if you don't receive the tracking email
- Contact support with order number if tracking issues occur

PRODUCT WARRANTY:
- 1-year manufacturer warranty on all products
- Covers defects in materials and workmanship
- Does not cover normal wear and tear or misuse
- Contact support to initiate warranty claim
`;

const buildSystemPrompt = (): string => {
  return `
      You are a helpful and friendly customer support agent for a small e-commerce store called "ShopEase".  
  
          Store Knowledge Base: 
          ${HARDCODED_KNOWLEDGE_BASE}
    `;
};

export const initializeLLMService = (config: LLMConfig, apiKey: string) => {
  let client: GoogleGenerativeAI | null = null;
  const systemPrompt = buildSystemPrompt();

  if (config.provider === "gemini") {
    client = createGeminiClient(apiKey);
  } else {
    throw new Error(`Unknown LLM provider: ${config.provider}`);
  }

  return {
    generateReply: async (
      conversationHistory: LLMMessage[]
    ): Promise<LLMResponse> => {
      try {
        if (config.provider === "gemini" && client) {
          return await generateGeminiReply(
            client as GoogleGenerativeAI,
            config,
            conversationHistory,
            systemPrompt
          );
        }
        throw new Error("LLM provider not initialized");
      } catch (error) {
        console.error("LLM generation error:", error);
        throw new Error(
          "Failed to generate response from AI. Please try again."
        );
      }
    },
  };
};

export const formatConversationHistory = (
  history: Array<{ role: string; content: string }>
): LLMMessage[] => {
  return history.map((msg) => ({
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }));
};
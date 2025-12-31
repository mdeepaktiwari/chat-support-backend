import {
  createSession,
  findSessionById,
  incrementSessionMessageCount,
  getSessionMessageCount,
} from "../repositories/sessionRepository";
import {
  createMessage,
  getConversationHistory,
} from "../repositories/messageRepository";
import { ChatMessageInput } from "./validation";
import { createValidationError } from "./errors";
import { formatConversationHistory } from "./llm/llmService";

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

export const processMessage = async (
  input: ChatMessageInput,
  llmService: LLMService,
  maxMessagesPerSession: number = 50
): Promise<ChatResponse> => {
  try {
    let sessionId = input.sessionId;
    let session;

    if (sessionId) {
      session = await findSessionById(sessionId);
      if (!session) {
        throw createValidationError("Invalid session ID");
      }

      // Check message limit
      const messageCount = await getSessionMessageCount(sessionId);
      if (messageCount >= maxMessagesPerSession) {
        throw createValidationError(
          "Message limit reached for this session. Please start a new conversation."
        );
      }
    } else {
      session = await createSession();
      sessionId = session.id;
    }

    // Save user message
    await createMessage(sessionId, "user", input.message);
    await incrementSessionMessageCount(sessionId);

    // Get conversation history
    const history = await getConversationHistory(sessionId, 10);

    // Generate AI response
    const llmMessages = formatConversationHistory(history);
    const llmResponse = await llmService.generateReply(llmMessages);

    // Save assistant message
    await createMessage(
      sessionId,
      "assistant",
      llmResponse.content,
      llmResponse.tokenCount,
      { model: llmResponse.model }
    );
    await incrementSessionMessageCount(sessionId);

    return {
      reply: llmResponse.content,
      sessionId,
      timestamp: new Date(),
    };
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      throw error;
    }
    console.error("Chat service error:", error);
    throw new Error(
      "An error occurred processing your message. Please try again."
    );
  }
};

export const getSessionHistory = async (
  sessionId: string
): Promise<
  Array<{
    role: string;
    content: string;
    timestamp: Date;
  }>
> => {
  const session = await findSessionById(sessionId);
  if (!session) {
    throw createValidationError("Session not found");
  }

  const { findMessagesBySessionId } = await import(
    "../repositories/messageRepository"
  );
  const messages = await findMessagesBySessionId(sessionId);

  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
    timestamp: msg.created_at,
  }));
};

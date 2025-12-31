import { z } from "zod";

export const ChatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long (max 1000 characters)")
    .trim(),
  sessionId: z.string().uuid().optional(),
});

export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;

export const validateChatMessage = (input: unknown): ChatMessageInput => {
  return ChatMessageSchema.parse(input);
};

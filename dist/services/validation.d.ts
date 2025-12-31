import { z } from "zod";
export declare const ChatMessageSchema: z.ZodObject<{
    message: z.ZodString;
    sessionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    sessionId?: string | undefined;
}, {
    message: string;
    sessionId?: string | undefined;
}>;
export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;
export declare const validateChatMessage: (input: unknown) => ChatMessageInput;

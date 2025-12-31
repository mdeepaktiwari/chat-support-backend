"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChatMessage = exports.ChatMessageSchema = void 0;
const zod_1 = require("zod");
exports.ChatMessageSchema = zod_1.z.object({
    message: zod_1.z
        .string()
        .min(1, "Message cannot be empty")
        .max(1000, "Message too long (max 1000 characters)")
        .trim(),
    sessionId: zod_1.z.string().uuid().optional(),
});
const validateChatMessage = (input) => {
    return exports.ChatMessageSchema.parse(input);
};
exports.validateChatMessage = validateChatMessage;
//# sourceMappingURL=validation.js.map
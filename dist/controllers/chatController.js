"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.history = exports.sendMessage = void 0;
const validation_1 = require("../services/validation");
const chatService_1 = require("../services/chatService");
const zod_1 = require("zod");
const sendMessage = async (req, res, next) => {
    try {
        const validatedInput = (0, validation_1.validateChatMessage)(req.body);
        const llmService = req.app.locals.llmService;
        const maxMessages = parseInt(process.env.MAX_MESSAGES_PER_SESSION || "50");
        const response = await (0, chatService_1.processMessage)(validatedInput, llmService, maxMessages);
        res.status(200).json({
            success: true,
            data: response,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: "Validation error",
                details: error.errors,
            });
        }
        next(error);
    }
};
exports.sendMessage = sendMessage;
const history = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                error: "Session ID is required",
            });
        }
        const history = await (0, chatService_1.getSessionHistory)(sessionId);
        res.status(200).json({
            success: true,
            data: { messages: history },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.history = history;
//# sourceMappingURL=chatController.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionHistory = exports.processMessage = void 0;
const sessionRepository_1 = require("../repositories/sessionRepository");
const messageRepository_1 = require("../repositories/messageRepository");
const errors_1 = require("./errors");
const llmService_1 = require("./llm/llmService");
const processMessage = async (input, llmService, maxMessagesPerSession = 50) => {
    try {
        let sessionId = input.sessionId;
        let session;
        if (sessionId) {
            session = await (0, sessionRepository_1.findSessionById)(sessionId);
            if (!session) {
                throw (0, errors_1.createValidationError)("Invalid session ID");
            }
            // Check message limit
            const messageCount = await (0, sessionRepository_1.getSessionMessageCount)(sessionId);
            if (messageCount >= maxMessagesPerSession) {
                throw (0, errors_1.createValidationError)("Message limit reached for this session. Please start a new conversation.");
            }
        }
        else {
            session = await (0, sessionRepository_1.createSession)();
            sessionId = session.id;
        }
        // Save user message
        await (0, messageRepository_1.createMessage)(sessionId, "user", input.message);
        await (0, sessionRepository_1.incrementSessionMessageCount)(sessionId);
        // Get conversation history
        const history = await (0, messageRepository_1.getConversationHistory)(sessionId, 10);
        // Generate AI response
        const llmMessages = (0, llmService_1.formatConversationHistory)(history);
        const llmResponse = await llmService.generateReply(llmMessages);
        // Save assistant message
        await (0, messageRepository_1.createMessage)(sessionId, "assistant", llmResponse.content, llmResponse.tokenCount, { model: llmResponse.model });
        await (0, sessionRepository_1.incrementSessionMessageCount)(sessionId);
        return {
            reply: llmResponse.content,
            sessionId,
            timestamp: new Date(),
        };
    }
    catch (error) {
        if (error instanceof Error && error.name === "ValidationError") {
            throw error;
        }
        console.error("Chat service error:", error);
        throw new Error("An error occurred processing your message. Please try again.");
    }
};
exports.processMessage = processMessage;
const getSessionHistory = async (sessionId) => {
    const session = await (0, sessionRepository_1.findSessionById)(sessionId);
    if (!session) {
        throw (0, errors_1.createValidationError)("Session not found");
    }
    const { findMessagesBySessionId } = await Promise.resolve().then(() => __importStar(require("../repositories/messageRepository")));
    const messages = await findMessagesBySessionId(sessionId);
    return messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.created_at,
    }));
};
exports.getSessionHistory = getSessionHistory;
//# sourceMappingURL=chatService.js.map
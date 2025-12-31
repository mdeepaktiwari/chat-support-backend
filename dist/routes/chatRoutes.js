"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const llmService_1 = require("../services/llm/llmService");
const chatRouter = () => {
    const router = (0, express_1.Router)();
    let llmServicePromise = null;
    const initializeLLM = async () => {
        const llmConfig = {
            provider: process.env.LLM_PROVIDER || "gemini",
            model: process.env.LLM_MODEL || "gemini-2.0-flash-exp",
            maxTokens: parseInt(process.env.LLM_MAX_TOKENS || "1024"),
            temperature: parseFloat(process.env.LLM_TEMPERATURE || "0.7"),
        };
        const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
        if (!apiKey)
            throw new Error("No LLM API key configured");
        return (0, llmService_1.initializeLLMService)(llmConfig, apiKey);
    };
    const llmService = async (req, res, next) => {
        try {
            if (!llmServicePromise) {
                llmServicePromise = initializeLLM();
            }
            req.app.locals.llmService = await llmServicePromise;
            next();
        }
        catch (error) {
            console.error("Failed to initialize LLM service:", error);
            res.status(500).json({
                success: false,
                error: "Service initialization failed",
            });
        }
    };
    router.use(llmService);
    router.post("/message", chatController_1.sendMessage);
    router.get("/history/:sessionId", chatController_1.history);
    return router;
};
exports.chatRouter = chatRouter;
//# sourceMappingURL=chatRoutes.js.map
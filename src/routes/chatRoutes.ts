import { Router, Request, Response, NextFunction } from "express";
import { sendMessage, history } from "../controllers/chatController";
import { initializeLLMService } from "../services/llm/llmService";
import { LLMConfig } from "../services/llm/types";

export const chatRouter = (): Router => {
  const router = Router();

  let llmServicePromise: Promise<any> | null = null;

  const initializeLLM = async () => {
    const llmConfig: LLMConfig = {
      provider:
        (process.env.LLM_PROVIDER as "gemini" | "openai") || "gemini",
      model: process.env.LLM_MODEL || "gemini-2.0-flash-exp",
      maxTokens: parseInt(process.env.LLM_MAX_TOKENS || "1024"),
      temperature: parseFloat(process.env.LLM_TEMPERATURE || "0.7"),
    };

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("No LLM API key configured");

    return initializeLLMService(llmConfig, apiKey);
  };

  const llmService = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!llmServicePromise) {
        llmServicePromise = initializeLLM();
      }
      req.app.locals.llmService = await llmServicePromise;
      next();
    } catch (error) {
      console.error("Failed to initialize LLM service:", error);
      res.status(500).json({
        success: false,
        error: "Service initialization failed",
      });
    }
  };

  router.use(llmService);

  router.post("/message", sendMessage);
  router.get("/history/:sessionId", history);

  return router;
};
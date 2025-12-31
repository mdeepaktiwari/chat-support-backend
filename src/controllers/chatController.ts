import { Request, Response, NextFunction } from "express";
import { validateChatMessage } from "../services/validation";
import { processMessage, getSessionHistory } from "../services/chatService";
import { z } from "zod";

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedInput = validateChatMessage(req.body);

    const llmService = req.app.locals.llmService;
    const maxMessages = parseInt(process.env.MAX_MESSAGES_PER_SESSION || "50");

    const response = await processMessage(
      validatedInput,
      llmService,
      maxMessages
    );

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors,
      });
    }
    next(error);
  }
};

export const history = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "Session ID is required",
      });
    }

    const history = await getSessionHistory(sessionId);

    res.status(200).json({
      success: true,
      data: { messages: history },
    });
  } catch (error) {
    next(error);
  }
};

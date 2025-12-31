"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGeminiReply = exports.createGeminiClient = void 0;
const generative_ai_1 = require("@google/generative-ai");
const createGeminiClient = (apiKey) => {
    return new generative_ai_1.GoogleGenerativeAI(apiKey);
};
exports.createGeminiClient = createGeminiClient;
const generateGeminiReply = async (client, config, messages, systemPrompt) => {
    try {
        // Get the generative model
        const model = client.getGenerativeModel({
            model: config.model,
            systemInstruction: systemPrompt,
        });
        // Convert conversation history to Gemini format
        const history = messages.slice(0, -1).map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));
        // Get the last user message
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || lastMessage.role !== "user") {
            throw new Error("Last message must be from user");
        }
        // Start chat with history
        const chat = model.startChat({
            history,
            generationConfig: {
                temperature: config.temperature,
                maxOutputTokens: config.maxTokens,
            },
        });
        // Send the last message and get response
        const result = await chat.sendMessage(lastMessage.content);
        const response = result.response;
        const text = response.text();
        return {
            content: text,
            tokenCount: response.usageMetadata?.candidatesTokenCount || 0,
            model: config.model,
        };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Gemini API error: ${error.message}`);
        }
        throw error;
    }
};
exports.generateGeminiReply = generateGeminiReply;
//# sourceMappingURL=llmProvider.js.map
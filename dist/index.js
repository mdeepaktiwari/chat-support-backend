"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const chatRoutes_js_1 = require("./routes/chatRoutes.js");
const errorMiddleware_js_1 = require("./middleware/errorMiddleware.js");
const rateLimiter_js_1 = require("./middleware/rateLimiter.js");
const pool_js_1 = require("./database/pool.js");
dotenv_1.default.config();
const createApp = () => {
    const app = (0, express_1.default)();
    // CORS
    app.use((0, cors_1.default)({
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", "OPTIONS"],
    }));
    // parser
    app.use(express_1.default.json({ limit: "1mb" }));
    app.use(express_1.default.urlencoded({ extended: true, limit: "1mb" }));
    // rate limiting
    app.use("/api/chat", rateLimiter_js_1.rateLimiter);
    // routes
    app.use("/api/chat", (0, chatRoutes_js_1.chatRouter)());
    // 404 handler
    app.use((_req, res) => {
        res.status(404).json({
            success: false,
            error: "Route not found",
        });
    });
    // Error handling
    app.use(errorMiddleware_js_1.errorMiddleware);
    return app;
};
const startServer = async () => {
    try {
        const port = parseInt(process.env.PORT || "8000");
        const dbConnected = await (0, pool_js_1.connection)();
        if (!dbConnected)
            throw new Error("Failed to connect to database");
        const app = createApp();
        app.listen(port, () => {
            console.log(`Server started on PORT: ${port}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map
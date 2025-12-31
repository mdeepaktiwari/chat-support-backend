"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: { rejectUnauthorized: false },
});
exports.pool.on("error", (err) => {
    console.error("Unexpected database error:", err);
    process.exit(-1);
});
const connection = async () => {
    try {
        const client = await exports.pool.connect();
        await client.query("SELECT NOW()");
        client.release();
        console.log("Database connection successful");
        return true;
    }
    catch (error) {
        console.error("Database connection failed:", error);
        return false;
    }
};
exports.connection = connection;
//# sourceMappingURL=pool.js.map
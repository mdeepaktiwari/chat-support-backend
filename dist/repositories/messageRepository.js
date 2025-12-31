"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countMessagesBySessionId = exports.getConversationHistory = exports.findMessagesBySessionId = exports.createMessage = void 0;
const pool_1 = require("../database/pool");
const uuid_1 = require("uuid");
const createMessage = async (sessionId, role, content, tokenCount, metadata = {}) => {
    const id = (0, uuid_1.v4)();
    const query = `
    INSERT INTO messages (id, session_id, role, content, token_count, metadata)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
    const result = await pool_1.pool.query(query, [
        id,
        sessionId,
        role,
        content,
        tokenCount,
        JSON.stringify(metadata),
    ]);
    return result.rows[0];
};
exports.createMessage = createMessage;
const findMessagesBySessionId = async (sessionId, limit = 50) => {
    const query = `
    SELECT * FROM messages
    WHERE session_id = $1
    ORDER BY created_at ASC
    LIMIT $2
  `;
    const result = await pool_1.pool.query(query, [sessionId, limit]);
    return result.rows;
};
exports.findMessagesBySessionId = findMessagesBySessionId;
const getConversationHistory = async (sessionId, limit = 10) => {
    const query = `
    SELECT role, content FROM messages
    WHERE session_id = $1 AND role IN ('user', 'assistant')
    ORDER BY created_at DESC
    LIMIT $2
  `;
    const result = await pool_1.pool.query(query, [sessionId, limit]);
    // Reverse to get chronological order
    return result.rows.reverse().map((row) => ({
        role: row.role,
        content: row.content,
    }));
};
exports.getConversationHistory = getConversationHistory;
const countMessagesBySessionId = async (sessionId) => {
    const query = "SELECT COUNT(*) FROM messages WHERE session_id = $1";
    const result = await pool_1.pool.query(query, [sessionId]);
    return parseInt(result.rows[0].count);
};
exports.countMessagesBySessionId = countMessagesBySessionId;
//# sourceMappingURL=messageRepository.js.map
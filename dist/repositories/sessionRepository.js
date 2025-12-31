"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionMessageCount = exports.incrementSessionMessageCount = exports.findSessionById = exports.createSession = void 0;
const pool_1 = require("../database/pool");
const uuid_1 = require("uuid");
const createSession = async (metadata = {}) => {
    const id = (0, uuid_1.v4)();
    const query = `
    INSERT INTO sessions (id, user_metadata)
    VALUES ($1, $2)
    RETURNING *
  `;
    const result = await pool_1.pool.query(query, [id, JSON.stringify(metadata)]);
    return result.rows[0];
};
exports.createSession = createSession;
const findSessionById = async (id) => {
    const query = "SELECT * FROM sessions WHERE id = $1";
    const result = await pool_1.pool.query(query, [id]);
    return result.rows[0] || null;
};
exports.findSessionById = findSessionById;
const incrementSessionMessageCount = async (id) => {
    const query = `
    UPDATE sessions 
    SET message_count = message_count + 1,
        updated_at = NOW()
    WHERE id = $1
  `;
    await pool_1.pool.query(query, [id]);
};
exports.incrementSessionMessageCount = incrementSessionMessageCount;
const getSessionMessageCount = async (id) => {
    const query = "SELECT message_count FROM sessions WHERE id = $1";
    const result = await pool_1.pool.query(query, [id]);
    return result.rows[0]?.message_count || 0;
};
exports.getSessionMessageCount = getSessionMessageCount;
//# sourceMappingURL=sessionRepository.js.map
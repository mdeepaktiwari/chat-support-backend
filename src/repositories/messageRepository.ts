import { pool } from "../database/pool";
import { Message, ConversationHistory } from "../models/types";
import { v4 as uuidv4 } from "uuid";

export const createMessage = async (
  sessionId: string,
  role: "user" | "assistant" | "system",
  content: string,
  tokenCount?: number,
  metadata: Record<string, any> = {}
): Promise<Message> => {
  const id = uuidv4();
  const query = `
    INSERT INTO messages (id, session_id, role, content, token_count, metadata)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const result = await pool.query(query, [
    id,
    sessionId,
    role,
    content,
    tokenCount,
    JSON.stringify(metadata),
  ]);
  return result.rows[0];
};

export const findMessagesBySessionId = async (
  sessionId: string,
  limit: number = 50
): Promise<Message[]> => {
  const query = `
    SELECT * FROM messages
    WHERE session_id = $1
    ORDER BY created_at ASC
    LIMIT $2
  `;
  const result = await pool.query(query, [sessionId, limit]);
  return result.rows;
};

export const getConversationHistory = async (
  sessionId: string,
  limit: number = 10
): Promise<ConversationHistory[]> => {
  const query = `
    SELECT role, content FROM messages
    WHERE session_id = $1 AND role IN ('user', 'assistant')
    ORDER BY created_at DESC
    LIMIT $2
  `;
  const result = await pool.query(query, [sessionId, limit]);
  // Reverse to get chronological order
  return result.rows.reverse().map((row) => ({
    role: row.role,
    content: row.content,
  }));
};

export const countMessagesBySessionId = async (
  sessionId: string
): Promise<number> => {
  const query = "SELECT COUNT(*) FROM messages WHERE session_id = $1";
  const result = await pool.query(query, [sessionId]);
  return parseInt(result.rows[0].count);
};

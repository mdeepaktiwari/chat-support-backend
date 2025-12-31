import { pool } from "../database/pool";
import { Session } from "../models/types";
import { v4 as uuidv4 } from "uuid";

export const createSession = async (
  metadata: Record<string, any> = {}
): Promise<Session> => {
  const id = uuidv4();
  const query = `
    INSERT INTO sessions (id, user_metadata)
    VALUES ($1, $2)
    RETURNING *
  `;
  const result = await pool.query(query, [id, JSON.stringify(metadata)]);
  return result.rows[0];
};

export const findSessionById = async (id: string): Promise<Session | null> => {
  const query = "SELECT * FROM sessions WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const incrementSessionMessageCount = async (
  id: string
): Promise<void> => {
  const query = `
    UPDATE sessions 
    SET message_count = message_count + 1,
        updated_at = NOW()
    WHERE id = $1
  `;
  await pool.query(query, [id]);
};

export const getSessionMessageCount = async (id: string): Promise<number> => {
  const query = "SELECT message_count FROM sessions WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0]?.message_count || 0;
};

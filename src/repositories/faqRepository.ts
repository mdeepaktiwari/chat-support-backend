import { pool } from "../database/pool";
import { FAQ } from "../models/types";

export const findFAQsByCategory = async (category: string): Promise<FAQ[]> => {
  const query = "SELECT * FROM faqs WHERE category = $1";
  const result = await pool.query(query, [category]);
  return result.rows;
};

export const searchFAQsByKeywords = async (
  keywords: string[]
): Promise<FAQ[]> => {
  const query = `
    SELECT * FROM faqs 
    WHERE keywords && $1::text[]
    ORDER BY 
      array_length(keywords & $1::text[], 1) DESC NULLS LAST,
      created_at DESC
    LIMIT 5
  `;
  const result = await pool.query(query, [keywords]);
  return result.rows;
};

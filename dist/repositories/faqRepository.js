"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFAQsByKeywords = exports.findFAQsByCategory = void 0;
const pool_1 = require("../database/pool");
const findFAQsByCategory = async (category) => {
    const query = "SELECT * FROM faqs WHERE category = $1";
    const result = await pool_1.pool.query(query, [category]);
    return result.rows;
};
exports.findFAQsByCategory = findFAQsByCategory;
const searchFAQsByKeywords = async (keywords) => {
    const query = `
    SELECT * FROM faqs 
    WHERE keywords && $1::text[]
    ORDER BY 
      array_length(keywords & $1::text[], 1) DESC NULLS LAST,
      created_at DESC
    LIMIT 5
  `;
    const result = await pool_1.pool.query(query, [keywords]);
    return result.rows;
};
exports.searchFAQsByKeywords = searchFAQsByKeywords;
//# sourceMappingURL=faqRepository.js.map
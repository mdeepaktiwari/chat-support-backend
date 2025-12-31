import { pool } from "./pool";
import * as fs from "fs";
import * as path from "path";

async function migrate() {
  try {
    console.log("Starting database migration...");

    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    await pool.query(schema);

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();

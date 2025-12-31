# AI Support Chat - Backend

Node.js/TypeScript backend API for AI-powered customer support with PostgreSQL and Gemini LLM.

## Architecture Overview

**Layered Architecture:**
```
Routes → Controllers → Services → Repositories → Database
```

- **Routes** (`src/routes/`): API endpoint definitions
- **Controllers** (`src/controllers/`): Handle HTTP requests/responses
- **Services** (`src/services/`): Business logic + LLM integration
- **Repositories** (`src/repositories/`): Database queries
- **Middleware** (`src/middleware/`): Error handling, rate limiting

**Key Design Decisions:**
- **Hardcoded Knowledge Base**: Store policies embedded in code (`llmService.ts`) for easy updates
- **Session-based Chat**: Each conversation gets unique UUID to maintain context

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Gemini API Key ([Get it here](https://makersuite.google.com/app/apikey))

## Local Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

**Install PostgreSQL:**
```bash
# macOS
brew install postgresql@14
brew services start postgresql@14
```

**Create Database:**
```bash
createdb ai_support_db

# Or via psql
psql postgres
CREATE DATABASE ai_support_db;
\q
```

### 3. Configure Environment Variables

Create `.env` file in backend root:

```bash
# Server
NODE_ENV=development
PORT=8000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_support_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password

# LLM
LLM_PROVIDER=gemini
LLM_MODEL=gemini-2.5-flash
LLM_MAX_TOKENS=
LLM_TEMPERATURE=
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Migrations

```bash
npm run db:migrate
```

This creates:
- `sessions` table: Stores chat sessions
- `messages` table: Stores conversation messages

### 5. Start Server

```bash
# Development with hot-reload
npm run dev

# Production
npm run build
npm start
```

Server runs at `http://localhost:8000`

## LLM Integration

**Provider:** Google Gemini (gemini-2.5-flash)

**Why Gemini?**
- Fast responses (~500ms)
- Cost-effective
- Good context understanding

**Prompting Strategy:**

Located in `src/services/llm/llmService.ts`:

```typescript
const SYSTEM_PROMPT = `You are a helpful customer support assistant...`;

const HARDCODED_KNOWLEDGE_BASE = `
SHIPPING POLICY:
- Free shipping on orders over $50
- Standard: 5-7 business days
...
RETURN POLICY:
- 30-day return window
...
`;
```

**How it works:**
1. System prompt defines assistant role
2. Knowledge base provides store policies
3. Conversation history maintains context
4. User message appended last

**To update knowledge:** Edit `HARDCODED_KNOWLEDGE_BASE` in `llmService.ts` and restart server.

## API Endpoints

### POST `/api/chat/message`
```json
// Request
{
  "message": "What's your return policy?",
  "sessionId": "optional-uuid"
}

// Response
{
  "success": true,
  "data": {
    "reply": "Our return policy allows...",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET `/api/chat/history/:sessionId`
Retrieve conversation history.

## Project Structure

```
backend/
├── src/
│   ├── controllers/        # HTTP handlers
│   ├── database/           # DB pool, migrations, schema
│   ├── middleware/         # Error handling, rate limiting
│   ├── models/             # TypeScript types
│   ├── repositories/       # Data access layer
│   ├── routes/             # API routes
│   ├── services/           # Business logic + LLM
│   │   └── llm/           
│   │       ├── llmProvider.ts
│   │       └── llmService.ts  # Knowledge base here
│   └── index.ts
├── .env
└── package.json
```
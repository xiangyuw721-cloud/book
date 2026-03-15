# Technical Architecture Document - Book Share Generator

## 1. Tech Stack

### 1.1 Frontend
- **Framework:** React (via `vite-init` template `react-express-ts`).
- **Language:** TypeScript.
- **Styling:** Tailwind CSS.
- **State Management:** Zustand (lightweight and effective).
- **HTTP Client:** Axios or Fetch.

### 1.2 Backend
- **Framework:** Express.js (via `vite-init` template `react-express-ts`).
- **Language:** TypeScript.
- **Role:**
  - Proxy requests to Gemini API (to hide API keys).
  - Handle prompt engineering and response formatting.

### 1.3 AI Integration
- **Provider:** Google Gemini API.
- **Integration:** Server-side API call.
- **Prompt Engineering:**
  - System prompts to enforce "De-AI" style.
  - Context injection for book details and user experience.

## 2. Project Structure
Based on the `react-express-ts` template:
```
/
├── src/                # Frontend source code
│   ├── components/     # React components
│   ├── pages/          # Page layouts
│   ├── api/            # Frontend API calls
│   └── ...
├── api/                # Backend source code (Express)
│   ├── index.ts        # Server entry point
│   ├── routes/         # API routes
│   └── services/       # Business logic (Gemini integration)
├── package.json
├── vite.config.ts
└── ...
```

## 3. Deployment Strategy
- **Platform:** Zeabur.
- **Configuration:**
  - Zeabur automatically detects Node.js projects.
  - We may need a `zeabur.json` or configure the build command to build both frontend and backend.
  - **Build Command:** `npm run build` (should build both).
  - **Start Command:** `npm run start` (starts the Express server which serves the static frontend).

## 4. API Design

### 4.1 Generate Share
- **Endpoint:** `POST /api/generate`
- **Request Body:**
  ```json
  {
    "bookName": "string",
    "author": "string (optional)",
    "experience": "string (optional)",
    "mode": "full" | "partial"
  }
  ```
- **Response:**
  ```json
  {
    "content": "Generated text..."
  }
  ```

## 5. Security
- **API Keys:** Gemini API Key must be stored in environment variables (`GEMINI_API_KEY`).
- **Input Validation:** Basic sanitization on the backend to prevent injection (though less critical for GenAI prompts, still good practice).

# Oracle Backend

A TypeScript-based backend service for the Oracle project, providing AI-powered guidance and insights.

## Features

- Express.js server with TypeScript
- LangChain integration for AI processing
- Memory management system
- Authentication with JWT
- Supabase integration
- Elemental framework for response processing

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Routes

- `POST /api/generate-prompt`: Generate AI responses
- `POST /api/auth/login`: User authentication
- `GET /api/memory/insights`: Retrieve memory insights
- `POST /api/memory/upload`: Store new memories

## Development

- `npm run build`: Build the project
- `npm run dev`: Start development server
- `npm run clean`: Clean build output

## License

MIT
# Oracle Backend

A TypeScript-based backend service for the Oracle project, providing AI-powered guidance and insights.

## Features

- Express.js server with TypeScript
- JWT authentication and authorization
- Memory management system
- Rate limiting and security middleware
- Comprehensive error handling
- Test coverage with Vitest
- Automatic deployment with Render

## Getting Started

1. Clone the repository:
   ```bash
   git clone --recursive https://github.com/spiralogic/oracle-backend.git
   cd oracle-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the frontend
- `npm run build:server` - Build the backend
- `npm run build:all` - Build both frontend and backend
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage report

## API Routes

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Memory Management
- `GET /api/memory` - Retrieve memories
- `POST /api/memory` - Store new memory
- `GET /api/memory/insights` - Get memory insights

### Session Management
- `POST /api/session/start` - Start new session
- `POST /api/session/end/:sessionId` - End session
- `GET /api/session/stats` - Get session statistics

### Learning Flow
- `POST /api/flow/learning/start` - Start learning flow
- `POST /api/flow/learning/interact` - Process interaction
- `POST /api/flow/learning/complete` - Complete learning flow

## Development

The project uses TypeScript for type safety and better developer experience. Key development features include:

- ESLint for code quality
- Prettier for code formatting
- Vitest for testing
- GitHub Actions for CI/CD

## Deployment

The application is automatically deployed to Render on push to the main branch. The deployment process includes:

1. Running tests
2. Building the application
3. Deploying to production

## License

MIT
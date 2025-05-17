// src/services/sessionService.ts

export interface Session {
  id: string;
  userId: string;
  startedAt: Date;
  context?: string;
}

const mockSessions: Session[] = [];

export const sessionService = {
  startSession: (userId: string, context?: string): Session => {
    const session = { id: `${Date.now()}`, userId, startedAt: new Date(), context };
    mockSessions.push(session);
    return session;
  },

  listSessions: (userId: string): Session[] => {
    return mockSessions.filter(s => s.userId === userId);
  },
};

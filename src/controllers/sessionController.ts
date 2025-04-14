import { createMeta } from '../routes/meta.js';

interface Session {
    id: string;
    clientId: string;
    startTime: string;
    meta: ReturnType<typeof createMeta>;
    status: 'active' | 'completed';
}

interface SessionStats {
    totalSessions: number;
    activeSessions: number;
    completedSessions: number;
    lastSessionTime: string;
    clientId: string;
}

export async function createSession(clientId: string): Promise<Session> {
    const session: Session = {
        id: Math.random().toString(36).substring(7),
        clientId,
        startTime: new Date().toISOString(),
        meta: createMeta(),
        status: 'active'
    };
    
    console.log('Created new session:', session);
    return session;
}

export async function endSession(sessionId: string): Promise<{
    sessionId: string;
    endTime: string;
    status: 'completed';
}> {
    console.log('Ending session:', sessionId);
    return {
        sessionId,
        endTime: new Date().toISOString(),
        status: 'completed'
    };
}

export async function getSessionStats(clientId: string): Promise<SessionStats> {
    return {
        totalSessions: 5,
        activeSessions: 1,
        completedSessions: 4,
        lastSessionTime: new Date().toISOString(),
        clientId
    };
}
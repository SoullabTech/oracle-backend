import type { Session, SessionStats } from '../types';
import { MetaService } from './metaService';

export class SessionService {
  private sessions: Session[] = [];

  async createSession(clientId: string): Promise<Session> {
    const session: Session = {
      id: Math.random().toString(36).substring(7),
      clientId,
      startTime: new Date().toISOString(),
      meta: MetaService.createMeta(),
      status: 'active'
    };
    
    this.sessions.push(session);
    return session;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    return this.sessions.find(s => s.id === sessionId) || null;
  }

  async endSession(sessionId: string): Promise<boolean> {
    const sessionIndex = this.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return false;

    this.sessions[sessionIndex].status = 'completed';
    return true;
  }

  async getSessionStats(clientId: string): Promise<SessionStats> {
    const clientSessions = this.sessions.filter(s => s.clientId === clientId);
    
    return {
      totalSessions: clientSessions.length,
      activeSessions: clientSessions.filter(s => s.status === 'active').length,
      completedSessions: clientSessions.filter(s => s.status === 'completed').length,
      lastSessionTime: clientSessions[clientSessions.length - 1]?.startTime || '',
      clientId
    };
  }
}
import { createClient } from "@supabase/supabase-js";
import { config } from "../config";
import logger from "../utils/logger";
import { NotFoundError } from "../utils/errors";
const supabase = createClient(config.supabase.url, config.supabase.anonKey);
export class SessionService {
  async createSession(userId, metadata) {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .insert({
          user_id: userId,
          metadata,
          status: "active",
        })
        .select()
        .single();
      if (error) throw error;
      logger.info("Session created successfully", { id: data.id });
      return data;
    } catch (error) {
      logger.error("Failed to create session", { error });
      throw error;
    }
  }
  async getSession(id, userId) {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .single();
      if (error) throw error;
      if (!data) throw new NotFoundError("Session not found");
      return data;
    } catch (error) {
      logger.error("Failed to get session", { error, id });
      throw error;
    }
  }
  async endSession(id, userId) {
    try {
      const { error } = await supabase
        .from("sessions")
        .update({
          status: "completed",
          ended_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
      logger.info("Session ended successfully", { id });
      return true;
    } catch (error) {
      logger.error("Failed to end session", { error, id });
      throw error;
    }
  }
  async getSessionStats(userId, startDate, endDate) {
    try {
      let query = supabase.from("sessions").select("*").eq("user_id", userId);
      if (startDate) {
        query = query.gte("started_at", startDate.toISOString());
      }
      if (endDate) {
        query = query.lte("started_at", endDate.toISOString());
      }
      const { data, error } = await query;
      if (error) throw error;
      const stats = {
        totalSessions: data.length,
        activeSessions: data.filter((s) => s.status === "active").length,
        completedSessions: data.filter((s) => s.status === "completed").length,
        lastSessionTime: data[data.length - 1]?.started_at || "",
        clientId: userId,
      };
      return stats;
    } catch (error) {
      logger.error("Failed to get session stats", { error, userId });
      throw error;
    }
  }
}

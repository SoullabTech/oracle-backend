// src/services/knowledgeBaseService.ts
import { supabase } from "../lib/supabase";
import logger from "../utils/logger";
export async function storeKnowledge(entry) {
    try {
        const { data, error } = await supabase
            .from("oracle_knowledge_base")
            .insert({
            title: entry.title,
            content: entry.content,
            category: entry.category,
            element: entry.element,
            confidence: entry.confidence ?? 0.7,
            metadata: entry.metadata ?? {},
            source: entry.source,
            validation_status: "pending",
        })
            .select("id")
            .single();
        if (error)
            throw error;
        logger.info("Knowledge entry stored", {
            metadata: {
                id: data.id,
                title: entry.title,
                category: entry.category,
            },
        });
        return data.id;
    }
    catch (err) {
        logger.error("Error storing knowledge:", err);
        throw new Error("Failed to store knowledge");
    }
}
export async function queryKnowledge(params) {
    try {
        let qb = supabase
            .from("oracle_knowledge_base")
            .select("*")
            .eq("validation_status", "approved");
        if (params.category)
            qb = qb.eq("category", params.category);
        if (params.element)
            qb = qb.eq("element", params.element);
        if (params.minConfidence != null)
            qb = qb.gte("confidence", params.minConfidence);
        if (params.query)
            qb = qb.textSearch("content", params.query);
        const { data, error } = await qb
            .order("confidence", { ascending: false })
            .limit(params.limit ?? 10);
        if (error)
            throw error;
        return data;
    }
    catch (err) {
        logger.error("Error querying knowledge base:", err);
        throw new Error("Failed to query knowledge base");
    }
}
export async function validateKnowledge(id, approved, notes) {
    try {
        const { error } = await supabase
            .from("oracle_knowledge_base")
            .update({
            validation_status: approved ? "approved" : "rejected",
            metadata: supabase.raw(`jsonb_set(metadata, '{validation_notes}', to_jsonb(${JSON.stringify(notes)}::text), true)`),
            updated_at: new Date().toISOString(),
        })
            .eq("id", id);
        if (error)
            throw error;
        logger.info("Knowledge entry validated", {
            metadata: { id, approved, notes },
        });
    }
    catch (err) {
        logger.error("Error validating knowledge:", err);
        throw new Error("Failed to validate knowledge");
    }
}
export async function updateKnowledgeConfidence(id, newConfidence) {
    try {
        const { error } = await supabase
            .from("oracle_knowledge_base")
            .update({
            confidence: newConfidence,
            updated_at: new Date().toISOString(),
        })
            .eq("id", id);
        if (error)
            throw error;
        logger.info("Knowledge confidence updated", {
            metadata: { id, newConfidence },
        });
    }
    catch (err) {
        logger.error("Error updating knowledge confidence:", err);
        throw new Error("Failed to update knowledge confidence");
    }
}

// File: /lib/journalService.ts
import { supabase } from "./supabaseClient";
export async function insertJournalEntry(entryData) {
    const { data, error } = await supabase.from("journal_entries").insert([entryData]);
    if (error)
        console.error("Supabase insert error:", error);
    return { data, error };
}

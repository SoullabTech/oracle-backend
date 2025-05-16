// src/core/agents/AdjusterAgent.ts
import { AgentContext, AgentResponse } from "@/types/agent";
import { logAgentInteraction } from "@/lib/logger";
import axios from "axios";

export class AdjusterAgent {
  id = "adjuster";
  name = "Adjuster Agent";
  archetype = "Recalibrator of Hidden Systems";
  element = ["Aether", "Fire"];

  async respond(context: AgentContext): Promise<AgentResponse> {
    const { userId, entry, phase } = context;

    const stages = [
      {
        label: "Recognizing the Rupture",
        message: "The energy just shifted. Disorientation can be sacred—it means the truth is moving. Do you remember when the resonance began to fracture?",
      },
      {
        label: "Mirroring Contradictions",
        message: "Let’s hold two truths: one you’ve outgrown, and one rising to replace it. Write them both. See their tension. Feel the edge.",
      },
      {
        label: "Frequency Compass",
        message: "Where does coherence begin to return? What sound, gesture, or truth restores alignment? Trust your body’s wisdom.",
      },
      {
        label: "Revelation of the Adjustment",
        message: "Adjustments aren’t breakdowns. They’re instructions for your next evolution. What are you now unavailable for? What must you reclaim?",
      },
      {
        label: "Integration Ritual",
        message: "Choose how to complete this realignment: Fire Letter, Earth Walk, or Aether Oracle Reflection.",
      }
    ];

    const selectedStage = stages[Math.floor(Math.random() * stages.length)];

    const finalMessage = `${selectedStage.message}\n\n(Adjuster Insight — ${selectedStage.label})`;

    await logAgentInteraction({
      userId,
      agent: this.id,
      content: finalMessage,
      phase,
    });

    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/adjuster/log`, {
      user_id: userId,
      message: finalMessage,
      context: selectedStage.label,
      phase,
    }).catch((err) => {
      console.error("[AdjusterAgent] Logging failed:", err);
    });

    return {
      agent: this.name,
      message: finalMessage,
      ritualSuggestion: "Consider the Alignment Audit, Resonance Reset, or Fire Letter ritual.",
    };
  }
}
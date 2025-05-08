// src/utils/shamanUtils.ts

/** Detect common PTSD trigger phrases */
export function detectCrisisLanguage(text: string): boolean {
    const triggers = [
      'panic attack', 'can’t breathe', 'dissociating', 'numb', 'frozen', 'flashback',
      'triggered', 'I’m spiraling', 'shutdown', 'collapse', 'overwhelmed'
    ];
    return triggers.some(trigger => text.toLowerCase().includes(trigger));
  }
  
  /** Suggest grounding/somatic practices */
  export function suggestSomaticPractice(state: 'crisis' | 'calm' = 'calm'): string {
    if (state === 'crisis') {
      return 'Place one hand on your heart and the other on your belly. Breathe slowly. You are safe now.';
    }
    return 'Feel your feet on the ground. Breathe deep into your belly and exhale slowly.';
  }
  
  /** Generate a gentle cognitive reframe */
  export function generateReframe(input: string): string {
    return `It makes sense you'd feel that way. What if this moment is inviting you to see your strength more clearly?`;
  }
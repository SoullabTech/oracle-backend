// src/lib/openaiClient.ts
export const openai = {
  chat: {
    completions: {
      create: async () => ({
        choices: [{ message: { content: "Mocked OpenAI reply." } }],
      }),
    },
  },
};

// src/services/oracleApi.ts
export const getOracleResponse = async (input: string, userId: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/oracle/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, userId }),
    });
  
    if (!res.ok) {
      throw new Error('Failed to fetch Oracle response');
    }
  
    return res.json();
  };
  
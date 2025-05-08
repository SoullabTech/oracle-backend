// src/components/PTSDCompanion.tsx

import React, { useState } from 'react';

const PTSDCompanion: React.FC = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/oracle/ptsd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setResponse('Error connecting to PTSD Agent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-2">🛡️ PTSD Companion</h2>
      <textarea
        className="w-full p-2 border rounded"
        rows={4}
        placeholder="What’s on your mind?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Consulting...' : 'Speak to the PTSD Agent'}
      </button>

      {response && (
        <div className="mt-4 p-3 border rounded bg-blue-50 text-blue-900">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default PTSDCompanion;
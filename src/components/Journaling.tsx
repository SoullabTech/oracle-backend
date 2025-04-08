import React, { useState, useEffect } from 'react';

const Journaling: React.FC = () => {
  const [entry, setEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState<string[]>([]);

  // Simulate fetching existing journal entries on component mount.
  useEffect(() => {
    // Replace with API call to fetch saved entries if available.
    const stored = localStorage.getItem('journalEntries');
    if (stored) {
      setSavedEntries(JSON.parse(stored));
    }
  }, []);

  // Function to save an entry.
  const saveEntry = () => {
    if (!entry.trim()) return;
    const newEntries = [...savedEntries, entry];
    setSavedEntries(newEntries);
    setEntry('');
    // Save to localStorage (or replace with backend API call)
    localStorage.setItem('journalEntries', JSON.stringify(newEntries));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Journaling</h2>
      <textarea 
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your daily journal entry here..."
        style={{
          width: '100%',
          height: '150px',
          padding: '1rem',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '5px',
          marginBottom: '1rem'
        }}
      />
      <button 
        onClick={saveEntry} 
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#236586',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Save Entry
      </button>
      <div style={{ marginTop: '2rem' }}>
        <h3>Your Journal Entries</h3>
        {savedEntries.length === 0 ? (
          <p>No entries yet. Start journaling to capture your journey.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {savedEntries.map((entry, index) => (
              <li key={index} style={{ 
                padding: '1rem', 
                marginBottom: '1rem', 
                backgroundColor: '#f4f4f4', 
                borderRadius: '5px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                {entry}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Journaling;

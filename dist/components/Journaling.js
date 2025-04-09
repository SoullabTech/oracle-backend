"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Journaling = () => {
    const [entry, setEntry] = (0, react_1.useState)('');
    const [savedEntries, setSavedEntries] = (0, react_1.useState)([]);
    // Simulate fetching existing journal entries on component mount.
    (0, react_1.useEffect)(() => {
        // Replace with API call to fetch saved entries if available.
        const stored = localStorage.getItem('journalEntries');
        if (stored) {
            setSavedEntries(JSON.parse(stored));
        }
    }, []);
    // Function to save an entry.
    const saveEntry = () => {
        if (!entry.trim())
            return;
        const newEntries = [...savedEntries, entry];
        setSavedEntries(newEntries);
        setEntry('');
        // Save to localStorage (or replace with backend API call)
        localStorage.setItem('journalEntries', JSON.stringify(newEntries));
    };
    return (<div style={{ padding: '2rem' }}>
      <h2>Journaling</h2>
      <textarea value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="Write your daily journal entry here..." style={{
            width: '100%',
            height: '150px',
            padding: '1rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '5px',
            marginBottom: '1rem'
        }}/>
      <button onClick={saveEntry} style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#236586',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        }}>
        Save Entry
      </button>
      <div style={{ marginTop: '2rem' }}>
        <h3>Your Journal Entries</h3>
        {savedEntries.length === 0 ? (<p>No entries yet. Start journaling to capture your journey.</p>) : (<ul style={{ listStyle: 'none', padding: 0 }}>
            {savedEntries.map((entry, index) => (<li key={index} style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: '#f4f4f4',
                    borderRadius: '5px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                {entry}
              </li>))}
          </ul>)}
      </div>
    </div>);
};
exports.default = Journaling;

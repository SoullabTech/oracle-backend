// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import Journaling from './components/Journaling';
import MemoryInsights from './components/MemoryInsights';
import MemoryUpload from './components/MemoryUpload';
import FacilitatorTools from './components/FacilitatorTools';
import Settings from './components/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Lato, sans-serif' }}>
        {/* Sidebar Navigation */}
        <aside style={{ 
          width: '220px', 
          backgroundColor: '#282c34', 
          color: '#fff', 
          padding: '1rem' 
        }}>
          <h2 style={{ 
            margin: '0 0 1rem', 
            fontFamily: 'Blair Sans, sans-serif', 
            fontWeight: 600 
          }}>
            Oracle Dashboard
          </h2>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/chat" style={{ color: '#fff', textDecoration: 'none' }}>
                  Chat
                </Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/journals" style={{ color: '#fff', textDecoration: 'none' }}>
                  Journals
                </Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/memory-insights" style={{ color: '#fff', textDecoration: 'none' }}>
                  Memory Insights
                </Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/memory-upload" style={{ color: '#fff', textDecoration: 'none' }}>
                  Memory Upload
                </Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <Link to="/facilitator" style={{ color: '#fff', textDecoration: 'none' }}>
                  Facilitator Tools
                </Link>
              </li>
              <li>
                <Link to="/settings" style={{ color: '#fff', textDecoration: 'none' }}>
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '1rem', backgroundColor: '#F3F4F6' }}>
          <Switch>
            <Route exact path="/" component={ChatInterface} />
            <Route path="/chat" component={ChatInterface} />
            <Route path="/journals" component={Journaling} />
            <Route path="/memory-insights" component={MemoryInsights} />
            <Route path="/memory-upload" component={MemoryUpload} />
            <Route path="/facilitator" component={FacilitatorTools} />
            <Route path="/settings" component={Settings} />
          </Switch>
        </main>
      </div>
      <footer style={{ 
        padding: '1rem', 
        backgroundColor: '#E5E7EB', 
        textAlign: 'center', 
        fontSize: '0.8rem' 
      }}>
        <p>Oracle Agent © 2025. All rights reserved.</p>
      </footer>
    </Router>
  );
};

export default App;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/App.tsx
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const ChatInterface_1 = __importDefault(require("./components/ChatInterface"));
const Journaling_1 = __importDefault(require("./components/Journaling"));
const MemoryInsights_1 = __importDefault(require("./components/MemoryInsights"));
const MemoryUpload_1 = __importDefault(require("./components/MemoryUpload"));
const FacilitatorTools_1 = __importDefault(require("./components/FacilitatorTools"));
const Settings_1 = __importDefault(require("./components/Settings"));
const App = () => {
    return (<react_router_dom_1.BrowserRouter>
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
                <react_router_dom_1.Link to="/chat" style={{ color: '#fff', textDecoration: 'none' }}>
                  Chat
                </react_router_dom_1.Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <react_router_dom_1.Link to="/journals" style={{ color: '#fff', textDecoration: 'none' }}>
                  Journals
                </react_router_dom_1.Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <react_router_dom_1.Link to="/memory-insights" style={{ color: '#fff', textDecoration: 'none' }}>
                  Memory Insights
                </react_router_dom_1.Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <react_router_dom_1.Link to="/memory-upload" style={{ color: '#fff', textDecoration: 'none' }}>
                  Memory Upload
                </react_router_dom_1.Link>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <react_router_dom_1.Link to="/facilitator" style={{ color: '#fff', textDecoration: 'none' }}>
                  Facilitator Tools
                </react_router_dom_1.Link>
              </li>
              <li>
                <react_router_dom_1.Link to="/settings" style={{ color: '#fff', textDecoration: 'none' }}>
                  Settings
                </react_router_dom_1.Link>
              </li>
            </ul>
          </nav>
        </aside>
        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '1rem', backgroundColor: '#F3F4F6' }}>
          <react_router_dom_1.Switch>
            <react_router_dom_1.Route exact path="/" component={ChatInterface_1.default}/>
            <react_router_dom_1.Route path="/chat" component={ChatInterface_1.default}/>
            <react_router_dom_1.Route path="/journals" component={Journaling_1.default}/>
            <react_router_dom_1.Route path="/memory-insights" component={MemoryInsights_1.default}/>
            <react_router_dom_1.Route path="/memory-upload" component={MemoryUpload_1.default}/>
            <react_router_dom_1.Route path="/facilitator" component={FacilitatorTools_1.default}/>
            <react_router_dom_1.Route path="/settings" component={Settings_1.default}/>
          </react_router_dom_1.Switch>
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
    </react_router_dom_1.BrowserRouter>);
};
exports.default = App;

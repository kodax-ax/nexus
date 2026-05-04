/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TrackingPortal from './pages/TrackingPortal';
import ClientDashboard from './pages/ClientDashboard';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import { ThemeProvider } from './contexts/ThemeContext';
import { TerminalProvider } from './context/TerminalContext';
import { ChatWidget } from './components/ChatWidget';

export default function App() {
  return (
    <ThemeProvider>
      <TerminalProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tracking" element={<TrackingPortal />} />
              <Route path="/dashboard" element={<ClientDashboard />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </Layout>
          <ChatWidget />
        </Router>
      </TerminalProvider>
    </ThemeProvider>
  );
}

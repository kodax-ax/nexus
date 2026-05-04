import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DUMMY_SHIPMENTS = [
  { 
    id: 'NEX-7743', 
    origin: 'Lagos, NG',
    destination: 'London Gateway, UK', 
    weight: '2,400kg', 
    value: '$45,000', 
    status: 'In Transit',
    progress: 65,
    history: [
      { event: 'Terminal Exit', location: 'Lagos Port', time: '2024-03-01 08:00' },
      { event: 'Ocean Transit Start', location: 'Atlantic Delta', time: '2024-03-02 12:00' },
      { event: 'Midpoint Transit', location: 'Open Sea', time: '2024-03-04 14:00' },
    ]
  },
  { 
    id: 'NEX-9122', 
    origin: 'Shanghai Port, CN',
    destination: 'Rotterdam Port, NL', 
    weight: '12,200kg', 
    value: '$128,000', 
    status: 'Cleared Customs',
    progress: 100,
    history: [
      { event: 'Customs Clearance', location: 'Rotterdam Customs', time: '2024-03-05 09:30' },
      { event: 'Final Destination Arrival', location: 'Rotterdam Terminal', time: '2024-03-05 15:45' },
    ]
  },
  { 
    id: 'NEX-4481', 
    origin: 'New York JFK, US',
    destination: 'Tokyo Narita, JP', 
    weight: '1,200kg', 
    value: '$32,500', 
    status: 'Delayed',
    progress: 45,
    history: [
      { event: 'Flight Departure', location: 'JFK Airport', time: '2024-03-03 23:00' },
      { event: 'Weather Hold', location: 'Alaska Node', time: '2024-03-04 04:00' },
    ],
    delayReason: 'Cyclonic Activity in North Pacific'
  },
  { 
    id: 'NEX-3309', 
    origin: 'Mumbai Central, IN',
    destination: 'Sydney Hub, AU', 
    weight: '4,100kg', 
    value: '$67,200', 
    status: 'In Transit',
    progress: 82,
    history: [
      { event: 'Inland Rail Complete', location: 'Mumbai Port', time: '2024-03-02 16:00' },
      { event: 'Ocean Freight Load', location: 'Mumbai Terminal 2', time: '2024-03-03 10:00' },
    ]
  },
  { 
    id: 'NEX-5501', 
    origin: 'Frankfurt Hub, DE',
    destination: 'Dubai World, UAE', 
    weight: '3,800kg', 
    value: '$82,000', 
    status: 'Cleared Customs',
    progress: 100,
    history: [
      { event: 'Customs Exit', location: 'Dubai Hub', time: '2024-03-05 11:20' },
    ]
  },
];

const DUMMY_RISKS = [
  { id: 'R1', location: 'North Atlantic', severity: 'Moderate', message: 'Cyclonic Activity - Expect 12h detour risk.', type: 'Weather' },
  { id: 'R2', location: 'Shanghai Port', severity: 'High', message: 'Labor Strike - Port operations at 30% capacity.', type: 'Port Congestion' },
  { id: 'R3', location: 'Suez Canal', severity: 'Low', message: 'Scheduled Maintenance - Minimal transit delays.', type: 'Infrastructure' },
];

interface Message {
  role: 'ai' | 'user';
  text: string;
  actions?: string[];
}

interface TerminalContextType {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  shipments: any[];
  setShipments: React.Dispatch<React.SetStateAction<any[]>>;
  riskAlerts: any[];
  setRiskAlerts: React.Dispatch<React.SetStateAction<any[]>>;
  isPipelineGlowing: boolean;
  setIsPipelineGlowing: (val: boolean) => void;
  isSearchGlowing: boolean;
  setIsSearchGlowing: (val: boolean) => void;
  refreshing: boolean;
  setRefreshing: (val: boolean) => void;
  activeWaybillId: string | null;
  setActiveWaybillId: (id: string | null) => void;
  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;
  chatMessages: Message[];
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  triggerEmergency: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export const TerminalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shipments, setShipments] = useState(DUMMY_SHIPMENTS);
  const [riskAlerts, setRiskAlerts] = useState(DUMMY_RISKS);
  const [isPipelineGlowing, setIsPipelineGlowing] = useState(false);
  const [isSearchGlowing, setIsSearchGlowing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeWaybillId, setActiveWaybillId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      text: 'Welcome back to Nexus Terminal. I can help you navigate your fleet or explain our global features. What can I do for you?',
      actions: ['What is this app?', 'How do I use this?', 'Run Fleet Audit', 'Which routes are risky?']
    }
  ]);

  const triggerEmergency = () => {
    // 1. Update Risks
    setRiskAlerts(prev => prev.map(r => 
      r.location === 'Shanghai Port' 
        ? { ...r, severity: 'Critical', message: 'TOTAL PORT STRIKE - Emergency Protocol Alpha Initiated.' } 
        : r
    ));

    // 2. Update Affected Shipments (Lagos and New York ones for variety)
    setShipments(prev => prev.map(s => 
      (s.id === 'NEX-9122' || s.id === 'NEX-7743')
        ? { ...s, status: 'Delayed', delayReason: 'Shanghai Emergency Lockdown' }
        : s
    ));

    // 3. Open Chat and send alert
    setIsChatOpen(true);
    setChatMessages(prev => [...prev, {
      role: 'ai',
      text: '⚠️ EMERGENCY DETECTED IN SHANGHAI. Total port strike confirmed. Two major routes have been severely bottlenecked. I have prepared reroute options for the affected shipments. Would you like to view the updated Waybills or fix the corridor?',
      actions: ['Fix all', 'Which routes are risky?']
    }]);
  };

  return (
    <TerminalContext.Provider value={{
      searchTerm, setSearchTerm,
      shipments, setShipments,
      riskAlerts, setRiskAlerts,
      isPipelineGlowing, setIsPipelineGlowing,
      isSearchGlowing, setIsSearchGlowing,
      refreshing, setRefreshing,
      activeWaybillId, setActiveWaybillId,
      isChatOpen, setIsChatOpen,
      chatMessages, setChatMessages,
      triggerEmergency
    }}>
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (!context) throw new Error('useTerminal must be used within TerminalProvider');
  return context;
};

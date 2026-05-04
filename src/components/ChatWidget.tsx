import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, X, RefreshCw, ArrowRight, MessageCircle } from 'lucide-react';
import { useTerminal } from '../context/TerminalContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface Message {
  role: 'ai' | 'user';
  text: string;
  actions?: string[];
}

export const ChatWidget: React.FC = () => {
  const { 
    searchTerm, setSearchTerm, 
    shipments, setShipments,
    riskAlerts, setRiskAlerts,
    setIsPipelineGlowing, setIsSearchGlowing,
    refreshing, setRefreshing,
    setActiveWaybillId,
    isChatOpen, setIsChatOpen,
    chatMessages, setChatMessages
  } = useTerminal();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [chatInput, setChatInput] = useState('');
  const [pendingOptimization, setPendingOptimization] = useState<string | null>(null);

  const handleChatSubmit = (e?: React.FormEvent, manualMsg?: string) => {
    if (e) e.preventDefault();
    const currentInput = manualMsg || chatInput;
    if (!currentInput.trim()) return;

    const userMsg = currentInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
      const lowerMsg = userMsg.toLowerCase();
      let aiResponse = "";
      let newActions: string[] | undefined = undefined;

      // The "Fix all" Logic
      if (lowerMsg.includes('fix all')) {
        aiResponse = "Emergency Rerouting Sequence Completed. 🟢 All affected shipments are back on optimized corridors. I have added 'Rerouted' indicators to their verified status cards.";
        setShipments(prev => prev.map(s => 
          s.status === 'Delayed' 
            ? { ...s, status: 'In Transit', rerouted: true, progress: Math.min(s.progress + 10, 95) } 
            : s
        ));
        // Reset risks to normal
        setRiskAlerts(prev => prev.map(r => 
          r.location === 'Shanghai Port' 
            ? { ...r, severity: 'High', message: 'Labor Strike - Port operations recovering.' } 
            : r
        ));
      }
      // Project Awareness
      else if (lowerMsg.includes('what is this app') || lowerMsg.includes('what does this do')) {
        aiResponse = "Nexus Global Logistics is a high-tech terminal for tracking international shipments and using AI to automate route fixes and optimize delivery nodes.";
      }
      // Risk Intelligence awareness
      else if (lowerMsg.includes('risky') || lowerMsg.includes('risks')) {
        const risks = riskAlerts.map(r => `${r.location} (${r.type}: ${r.severity})`).join(', ');
        aiResponse = `Current Risk Assessment: ${risks}. I recommend monitoring Shanghai closely due to port congestion.`;
      }
      // Waybill generation trigger
      else if (lowerMsg.includes('generate papers') || lowerMsg.includes('generate waybill') || lowerMsg.includes('manifest')) {
        const foundShipment = shipments.find(s => 
          lowerMsg.includes(s.id.toLowerCase()) || 
          lowerMsg.includes(s.origin.toLowerCase().split(',')[0]) ||
          lowerMsg.includes(s.destination.toLowerCase().split(',')[0])
        );

        if (foundShipment) {
          aiResponse = `Command acknowledged. Generating official waybill for ${foundShipment.id} (${foundShipment.origin} to ${foundShipment.destination}). Visualizing manifest now.`;
          setActiveWaybillId(foundShipment.id);
        } else {
          aiResponse = "To generate papers, please specify the Shipment ID or the route origin/destination.";
        }
      }
      // Non-Technical / Onboarding
      else if (lowerMsg.includes('how do i use this')) {
        aiResponse = "I can guide you through the terminal. 'In Transit' means the cargo is moving. 'Delayed' indicates a bottleneck. Would you like to see the Dashboard or explain the stats?";
        newActions = ['Go to Dashboard', 'Explain Stats'];
      }
      else if (lowerMsg.includes('explain stats')) {
        aiResponse = "Standard Node Statuses: 'In Transit' means moving according to schedule. 'Delayed' means a hold-up (weather/customs). 'Cleared Customs' means the local node has verified the manifest.";
      }
      // Navigation
      else if (lowerMsg.includes('take me to') || lowerMsg.includes('show me the dashboard') || lowerMsg.includes('go to dashboard')) {
        aiResponse = "Navigating to Regional Dashboard...";
        navigate('/dashboard');
      }
      // Logistics Logic
      else if (lowerMsg.includes('status')) {
        const delayed = shipments.filter(s => s.status === 'Delayed').length;
        const inTransit = shipments.filter(s => s.status === 'In Transit').length;
        const cleared = shipments.filter(s => s.status === 'Cleared Customs').length;
        aiResponse = `Current pipeline status summarized: ${delayed} Delayed, ${inTransit} In Transit, ${cleared} Cleared Customs. System health is stable.`;
        
        const firstDelayed = shipments.find(s => s.status === 'Delayed');
        if (firstDelayed) {
          aiResponse += ` Alert: ${firstDelayed.id} is delayed. Would you like me to simulate a route optimization?`;
          setPendingOptimization(firstDelayed.id);
          newActions = ['Yes, optimize route', 'No thanks'];
        }
      } 
      else if (lowerMsg.includes('yes') && pendingOptimization) {
        aiResponse = `Optimizing... Command sent to ${pendingOptimization}. Status updated to "In Transit". Route efficiency increased.`;
        setShipments(prev => prev.map(s => s.id === pendingOptimization ? { ...s, status: 'In Transit', progress: 55 } : s));
        setPendingOptimization(null);
      } 
      else if (lowerMsg.includes('where is') || lowerMsg.includes('filter for')) {
        const queryMatch = lowerMsg.includes('filter for') ? 'filter for' : 'where is';
        const filterVal = userMsg.toLowerCase().split(queryMatch)[1]?.trim() || "";
        
        if (location.pathname !== '/dashboard') {
          aiResponse = `Navigating to Dashboard to isolate the ${filterVal} route.`;
          navigate('/dashboard');
        } else {
          aiResponse = `Isolating the ${filterVal} route for you now. Search parameters synchronized.`;
        }
        
        setSearchTerm(filterVal);
        setIsSearchGlowing(true);
        setTimeout(() => setIsSearchGlowing(false), 3000);
      }
      else {
        aiResponse = "I didn't recognize that command. Type \"status\" for a fleet summary, \"report\" for route optimization, or ask \"what is this app?\"";
      }

      setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse, actions: newActions }]);
    }, 600);
  };

  const runFleetAudit = () => {
    setRefreshing(true);
    setChatMessages(prev => [...prev, { role: 'user', text: '[SYSTEM COMMAND]: RUN FLEET AUDIT' }]);
    
    setTimeout(() => {
      setRefreshing(false);
      const delayedCount = shipments.filter(s => s.status === 'Delayed').length;
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        text: `Fleet Audit Complete. 🛡️ ${shipments.length} vessels scanned. Critical Findings: ${delayedCount} anomalies found. Recommendation: Automated update emails sent to regional nodes.` 
      }]);
    }, 2000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ 
          opacity: isChatOpen ? 1 : 0, 
          scale: isChatOpen ? 1 : 0.95, 
          y: isChatOpen ? 0 : 20,
        }}
        className={`w-[350px] h-[550px] pointer-events-auto border flex flex-col overflow-hidden rounded-[32px] backdrop-blur-2xl shadow-2xl bg-[#0a0a0a]/80 border-white/10`}
      >
        {/* Header content from previous turn but now global */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                 <BrainCircuit size={16} className="text-white" />
               </div>
               <div>
                 <h3 className="text-[10px] font-bold uppercase tracking-widest font-mono text-blue-500 text-left">Neural Global Concierge</h3>
                 <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-[8px] font-mono uppercase tracking-tighter opacity-40">System Sync Active</span>
                 </div>
               </div>
             </div>
             <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/5 rounded-lg opacity-40 hover:opacity-100">
               <X size={16} className="text-white" />
             </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          {chatMessages.map((msg, i) => (
            <motion.div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-4 text-[11px] leading-relaxed rounded-2xl ${
                msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/5 text-blue-100/70 border border-white/5 rounded-tl-none font-mono italic'
              }`}>
                {msg.text}
              </div>
              {msg.actions && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {msg.actions.map((action, idx) => (
                    <button key={idx} onClick={() => action === 'Run Fleet Audit' ? runFleetAudit() : handleChatSubmit(undefined, action)}
                            className="text-[9px] font-mono border border-blue-600/30 px-3 py-1.5 rounded-full hover:bg-blue-600/10 transition-colors uppercase tracking-widest text-blue-400 bg-blue-600/5">
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleChatSubmit} className="p-6 border-t border-white/5 bg-white/5 pointer-events-auto">
          <div className="relative">
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="COMMAND TERMINAL..."
                   className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-[11px] font-mono tracking-widest focus:outline-none focus:border-blue-600 transition-all text-white" />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500">
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </motion.div>

      <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-16 h-16 pointer-events-auto rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group relative ${
        isChatOpen ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-blue-600 border border-blue-400/20 text-white shadow-blue-600/40'
      }`}>
        {!isChatOpen && <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20 pointer-events-none" />}
        {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

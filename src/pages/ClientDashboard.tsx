import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useTerminal } from '../context/TerminalContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus,
  BarChart3, 
  Package, 
  Truck, 
  Clock, 
  ChevronRight,
  Filter,
  Download,
  LogOut,
  MapPin,
  MoveRight,
  History,
  Mail,
  RefreshCw,
  AlertTriangle,
  BrainCircuit,
  Zap,
  CheckCircle2,
  ArrowRight,
  FileText,
  ShieldAlert,
  Info
} from 'lucide-react';

const DUMMY_QUOTES = [
  { id: 'q_88912', pickup_location: 'Berlin, DE', delivery_location: 'London, UK', status: 'Approved', created_at: '2024-03-01T10:00:00Z' },
  { id: 'q_44512', pickup_location: 'Paris, FR', delivery_location: 'Madrid, ES', status: 'Pending', created_at: '2024-03-02T14:30:00Z' },
  { id: 'q_11209', pickup_location: 'Milan, IT', delivery_location: 'Vienna, AT', status: 'Approved', created_at: '2024-03-03T09:15:00Z' },
];

export default function ClientDashboard() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  const { 
    searchTerm, setSearchTerm,
    shipments, setShipments,
    riskAlerts,
    isPipelineGlowing, isSearchGlowing,
    refreshing, setRefreshing,
    activeWaybillId, setActiveWaybillId,
    triggerEmergency
  } = useTerminal();

  const [quotes] = useState<any[]>(DUMMY_QUOTES);
  const [loading, setLoading] = useState(true);
  const [expandedShipment, setExpandedShipment] = useState<string | null>(null);

  useEffect(() => {
    const mockUser = localStorage.getItem('mock_user');
    if (!mockUser) {
      navigate('/auth');
      return;
    }

    setUser(JSON.parse(mockUser));
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('mock_user');
    navigate('/auth');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const generateEmail = (id: string) => {
    alert(`[AI SIMULATION] Generating automated status email for ${id}...`);
  };

  const handleStatusCycle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const statusCycle: any = {
      'In Transit': { next: 'Delayed', progress: 45 },
      'Delayed': { next: 'Cleared Customs', progress: 100 },
      'Cleared Customs': { next: 'In Transit', progress: 10 }
    };
    
    setShipments(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = statusCycle[s.status] || { next: 'In Transit', progress: 10 };
        return { ...s, status: nextState.next, progress: nextState.progress };
      }
      return s;
    }));
  };


  const filteredShipments = shipments.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-6 lg:p-12 transition-colors duration-500 ${
      theme === 'light' ? 'bg-zinc-50' : 'bg-[#050505]'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className={`text-4xl md:text-5xl font-bold tracking-tighter uppercase italic serif mb-2 ${
              theme === 'light' ? 'text-black' : 'text-white'
            }`}>Operations Terminal</h1>
            <p className={`uppercase text-[10px] tracking-widest font-bold font-mono ${
              theme === 'light' ? 'text-black/40' : 'text-white/40'
            }`}>
              {user ? `Authenticated: ${user.email}` : 'Establishing Connection...'}
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <button 
               onClick={handleLogout}
               className={`flex-1 md:flex-none border border-white/10 px-6 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 font-mono ${
               theme === 'light' ? 'border-black/5 hover:border-black/20 text-black' : 'text-white'
             }`}>
               <LogOut size={14} /> Terminate
             </button>
             <button className={`flex-1 md:flex-none border border-white/10 px-6 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 font-mono ${
               theme === 'light' ? 'border-black/5 hover:border-black/20 text-black' : 'text-white'
             }`}>
               <Download size={14} /> System Reports
             </button>
             <button className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 font-mono shadow-xl shadow-blue-600/20">
               <Plus size={14} /> Initialize Node
             </button>
          </div>
        </header>

        {/* Global Risk Intelligence */}
        <div className="mb-8">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
               <ShieldAlert size={16} className="text-orange-500" />
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-500 font-mono">Global Risk Intelligence</h3>
             </div>
             <button 
               onClick={triggerEmergency}
               className="text-[9px] font-mono border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all text-red-500 flex items-center gap-2 group"
             >
               <Zap size={12} className="group-hover:animate-pulse" />
               Simulate Port Strike
             </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {riskAlerts.map((risk) => (
               <motion.div 
                 key={risk.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`p-4 border rounded-2xl flex items-start gap-4 transition-all hover:scale-[1.02] ${
                   theme === 'light' ? 'bg-white border-black/5 shadow-sm' : 'bg-white/5 border-white/5'
                 }`}
               >
                 <div className={`p-2 rounded-lg ${
                   risk.severity === 'High' ? 'bg-red-500/10 text-red-500' :
                   risk.severity === 'Moderate' ? 'bg-orange-500/10 text-orange-500' :
                   'bg-blue-500/10 text-blue-500'
                 }`}>
                   <AlertTriangle size={14} />
                 </div>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className={`text-[9px] font-bold uppercase tracking-widest ${
                       risk.severity === 'High' ? 'text-red-500' : 'text-zinc-500'
                     }`}>{risk.type}</span>
                     <span className="text-[8px] opacity-30 font-mono">/ {risk.location}</span>
                   </div>
                   <p className={`text-[10px] leading-relaxed font-medium ${theme === 'light' ? 'text-black/70' : 'text-zinc-400'}`}>
                     {risk.message}
                   </p>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>

        {/* Overview Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-px border mb-12 overflow-hidden rounded-3xl ${
          theme === 'light' ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'
        }`}>
          {[
            { label: 'Active Pipeline', val: '24', icon: Truck, trend: '+12%' },
            { label: 'Managed Tonnage', val: '4,821T', icon: Package, trend: '+5%' },
            { label: 'System Latency', val: '3.2ms', icon: Clock, trend: '-0.4ms' },
            { label: 'Ledger Value', val: '$1.4M', icon: BarChart3, trend: '+22%' },
          ].map((stat, i) => (
            <div key={i} className={`p-8 group transition-colors duration-500 ${
              theme === 'light' ? 'bg-white hover:bg-zinc-50' : 'bg-[#0d0d0d] hover:bg-white/5'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <stat.icon className="text-blue-600" size={20} />
                <span className="text-[10px] font-bold text-green-400 font-mono">{stat.trend}</span>
              </div>
              <div className={`text-3xl font-bold tracking-tighter mb-1 font-mono ${
                theme === 'light' ? 'text-black' : 'text-white'
              }`}>{stat.val}</div>
              <div className={`text-[10px] font-bold uppercase tracking-widest font-mono ${
                theme === 'light' ? 'text-black/40' : 'text-white/40'
              }`}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipments List */}
          <div className={`lg:col-span-2 space-y-4 transition-all duration-700 ${isPipelineGlowing ? 'ring-2 ring-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] rounded-3xl p-2' : ''}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 px-2">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-500 font-mono">Live Pipeline</h3>
                {refreshing && (
                  <span className="text-[8px] font-mono text-blue-400 animate-pulse uppercase tracking-wider">Refreshing Ledger...</span>
                )}
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`relative flex-1 md:w-64 transition-all duration-700 ${isSearchGlowing ? 'ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] rounded-xl' : ''}`}>
                   <input 
                     type="text" 
                     placeholder="SEARCH ID / ORIGIN / DEST..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className={`w-full bg-transparent border px-4 py-2 text-[10px] font-mono uppercase tracking-widest focus:outline-none focus:border-blue-600 transition-all rounded-xl ${
                       theme === 'light' ? 'border-black/10 text-black' : 'border-white/10 text-white'
                     }`}
                   />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className={`p-2 rounded-lg border border-white/5 hover:bg-white/5 transition-all ${refreshing ? 'animate-spin' : ''}`}>
                    <RefreshCw size={14} className={theme === 'light' ? 'text-black' : 'text-white'} />
                  </button>
                  <button className="text-white/20 hover:text-white transition-colors"><Filter size={16}/></button>
                </div>
              </div>
            </div>
            
            {loading || refreshing ? (
              <div className="flex flex-col items-center justify-center p-20 border border-dashed border-white/10 rounded-3xl">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-[10px] font-mono uppercase tracking-widest opacity-40">Syncing Local Ledger...</div>
              </div>
            ) : filteredShipments.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 border border-dashed border-white/10 rounded-3xl">
                <Package className="text-white/10 mb-4" size={32} />
                <div className="text-[10px] font-mono uppercase tracking-widest opacity-40 italic">No shipments match your current parameters</div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredShipments.map((shipment, i) => (
                  <motion.div 
                    key={shipment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`border p-6 hover:border-blue-600/30 transition-all group cursor-pointer rounded-3xl ${
                      theme === 'light' ? 'bg-white border-black/5' : 'bg-[#0d0d0d] border-white/5 shadow-xl shadow-black/40'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 flex items-center justify-center border rounded-xl ${
                          theme === 'light' ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'
                        }`}>
                          <Package className="text-blue-600" size={18} />
                        </div>
                        <div>
                          <div className={`text-sm font-bold tracking-tighter font-mono ${theme === 'light' ? 'text-black' : 'text-white'}`}>{shipment.id}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[9px] font-bold uppercase tracking-tight ${theme === 'light' ? 'text-black/60' : 'text-white/60'}`}>{shipment.origin}</span>
                            <MoveRight size={10} className="opacity-20" />
                            <span className={`text-[9px] font-bold uppercase tracking-tight text-blue-500`}>{shipment.destination}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => handleStatusCycle(shipment.id, e)}
                            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 border font-mono rounded-lg transition-all hover:scale-105 active:scale-95 ${
                            shipment.status === 'Cleared Customs' ? 'border-blue-500/20 text-blue-400 bg-blue-500/5' : 
                            shipment.status === 'Delayed' ? 'border-red-500/20 text-red-500 bg-red-500/5' :
                            'border-green-500/20 text-green-400 bg-green-500/5'
                          }`}>
                            {shipment.status}
                          </button>
                          {shipment.rerouted && (
                            <motion.span 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono"
                            >
                              <Zap size={8} className="animate-pulse" />
                              Rerouted
                            </motion.span>
                          )}
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveWaybillId(shipment.id); }}
                          className="p-2 hover:bg-blue-600/10 rounded-lg transition-colors text-blue-500/40 hover:text-blue-400 border border-transparent hover:border-blue-600/20"
                          title="Generate Waybill"
                        >
                          <FileText size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); generateEmail(shipment.id); }}
                          className="p-2 hover:bg-blue-600/10 rounded-lg transition-colors text-blue-500/40 hover:text-blue-400 border border-transparent hover:border-blue-600/20"
                          title="Generate AI Update Email"
                        >
                          <Mail size={16} />
                        </button>
                        <button 
                          onClick={() => setExpandedShipment(expandedShipment === shipment.id ? null : shipment.id)}
                          className={`p-2 transition-all rounded-lg ${expandedShipment === shipment.id ? 'bg-white/5 text-blue-400 rotate-180' : 'opacity-20 hover:opacity-100'}`}
                        >
                          <History size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-4">
                       <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest opacity-40">
                         <span>Transit Lifecycle</span>
                         <span>{shipment.progress}%</span>
                       </div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${shipment.progress}%` }}
                           className={`h-full ${
                             shipment.status === 'Delayed' ? 'bg-red-500' : 
                             shipment.status === 'Cleared Customs' ? 'bg-blue-500' : 
                             'bg-green-500'
                           }`}
                         />
                       </div>
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-white/5">
                      <div>
                        <div className="text-[8px] uppercase tracking-[0.2em] font-bold opacity-30 mb-1">Payload Weight</div>
                        <div className="text-xs font-mono font-bold tracking-tight">{shipment.weight}</div>
                      </div>
                      <div>
                        <div className="text-[8px] uppercase tracking-[0.2em] font-bold opacity-30 mb-1">Ledger Value</div>
                        <div className="text-xs font-mono font-bold tracking-tight text-blue-500">{shipment.value}</div>
                      </div>
                      <div className="md:col-span-2 text-right">
                         {shipment.status === 'Delayed' && (
                           <div className="flex items-center justify-end gap-2 text-red-500/80">
                             <AlertTriangle size={12} />
                             <span className="text-[9px] font-bold italic font-serif leading-none">{shipment.delayReason}</span>
                           </div>
                         )}
                      </div>
                    </div>

                    {/* History Timeline */}
                    {expandedShipment === shipment.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 pt-6 border-t border-white/5 space-y-4"
                      >
                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Tracking Logs</h4>
                        {shipment.history.map((log: any, idx: number) => (
                          <div key={idx} className="flex gap-4 relative">
                            <div className="flex flex-col items-center">
                              <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-white/10'}`} />
                              {idx !== shipment.history.length - 1 && <div className="w-[1px] h-full bg-white/5 mt-1" />}
                            </div>
                            <div className="pb-4">
                              <div className="text-[10px] font-bold tracking-tight">{log.event}</div>
                              <div className="text-[9px] opacity-40 font-mono mt-0.5">{log.location} • {log.time}</div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Quotes Table */}
            <div className="mt-12 pt-12 border-t border-white/5">
              <div className="flex justify-between items-center mb-8 px-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-500 font-mono">My Active Quotes</h3>
              </div>

              <div className={`overflow-hidden border rounded-2xl ${
                theme === 'light' ? 'bg-white border-black/5' : 'bg-[#0d0d0d] border-white/5'
              }`}>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${theme === 'light' ? 'bg-zinc-50 border-black/5' : 'bg-white/[0.02] border-white/5'}`}>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest font-mono opacity-40">Route ID</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest font-mono opacity-40">From / To</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest font-mono opacity-40">Status</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest font-mono opacity-40">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                       <tr>
                         <td colSpan={4} className="p-12 text-center text-[10px] font-mono uppercase tracking-widest opacity-20 italic">Establishing terminal connection...</td>
                       </tr>
                    ) : (
                      quotes.map((quote) => (
                        <tr key={quote.id} className={`border-b last:border-0 hover:bg-white/[0.02] transition-colors ${
                          theme === 'light' ? 'border-black/5 hover:bg-black/5' : 'border-white/5'
                        }`}>
                          <td className="p-4 font-mono text-xs font-bold text-blue-500">#{quote.id.slice(0, 8)}</td>
                          <td className="p-4">
                            <div className="text-[10px] font-bold uppercase tracking-tight">{quote.pickup_location}</div>
                            <div className="text-[10px] opacity-40 italic">{quote.delivery_location}</div>
                          </td>
                          <td className="p-4">
                            <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/10 ${
                              quote.status === 'Approved' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {quote.status}
                            </span>
                          </td>
                          <td className="p-4 text-[10px] font-mono opacity-40">
                            {new Date(quote.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
             {/* AI Terminal Insights */}
             <div className="bg-[#000] p-8 text-white border border-blue-600/30 rounded-3xl shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm pointer-events-none">
                 <BrainCircuit size={80} className="text-blue-600" />
               </div>
               
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Zap size={16} fill="white" />
                 </div>
                 <h3 className="text-sm font-bold uppercase tracking-widest font-mono">Neural Logistics Advisor</h3>
               </div>

               <div className="space-y-6 relative z-10">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl italic leading-relaxed text-[11px] text-blue-100/70">
                    "Alert: Route NEX-4481 is experiencing significant atmospheric disruption. Recommendation: Reroute via anchorage port if delay exceeds 12h."
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-tight opacity-50">Customs Clearance Optimised</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={14} className="text-orange-500 shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-tight opacity-50">Fuel Surcharge Risk (Shanghai)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BrainCircuit size={14} className="text-blue-400 shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-tight opacity-50">Predicted Port Bottleneck: Rotterdam</span>
                    </div>
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                 <span className="text-[9px] font-bold uppercase tracking-widest font-mono text-blue-500">Terminal Online: Prototype Mode</span>
                 <div className="flex gap-1">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-75" />
                 </div>
               </div>
             </div>

             {/* Document Vault */}
             <div className={`p-8 border transition-all duration-500 rounded-3xl ${
               theme === 'light' ? 'bg-white border-black/5 shadow-lg shadow-black/5' : 'bg-[#0d0d0d] border-white/5'
             }`}>
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-500 font-mono">Document Vault</h3>
                 <span className={`text-[10px] font-mono ${theme === 'light' ? 'text-black/20' : 'text-white/20'}`}>4 Active Files</span>
               </div>
               <div className="space-y-4">
                 {[
                   { name: 'Commercial_Invoice_VX99.pdf', size: '1.2 MB' },
                   { name: 'Packing_List_Node_NYC.pdf', size: '840 KB' },
                   { name: 'Global_Transit_License.pdf', size: '2.4 MB' },
                 ].map((file, i) => (
                   <div key={i} className={`flex items-center justify-between p-4 border transition-all cursor-pointer group rounded-xl ${
                     theme === 'light' ? 'bg-zinc-50 border-black/5 hover:bg-white hover:border-blue-600/20' : 'bg-white/5 border-white/5 hover:border-blue-600/30'
                   }`}>
                     <span className={`text-[10px] font-mono transition-colors ${
                       theme === 'light' ? 'text-black/60 group-hover:text-blue-600' : 'text-white/40 group-hover:text-white'
                     }`}>{file.name}</span>
                     <span className="text-[8px] font-mono text-white/20">{file.size}</span>
                   </div>
                 ))}
                 <button className={`w-full mt-4 py-4 border border-dashed rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all ${
                   theme === 'light' ? 'border-black/10 text-black/40 hover:border-black/40 hover:text-black' : 'border-white/10 text-white/20 hover:border-white/40 hover:text-white'
                 }`}>
                   + Upload Parameters
                 </button>
               </div>
             </div>

             {/* Recent Activities */}
             <div className="bg-[#0a0a0a] border border-white/5 p-8">
               <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Alerts</h3>
               <div className="space-y-6">
                 {[
                   { msg: 'Weather delay at Suez Canal', time: '2h ago', level: 'warning' },
                   { msg: 'NEX-7743 confirmed delivery', time: '4h ago', level: 'success' },
                   { msg: 'Rate adjustment for Q3 announced', time: '1d ago', level: 'info' },
                 ].map((alert, i) => (
                   <div key={i} className="flex gap-4">
                     <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                       alert.level === 'warning' ? 'bg-orange-600' : alert.level === 'success' ? 'bg-green-500' : 'bg-blue-500'
                     }`} />
                     <div>
                       <div className="text-[10px] font-medium leading-relaxed text-zinc-300">{alert.msg}</div>
                       <div className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 mt-1">{alert.time}</div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 px-2 flex justify-between items-center opacity-20 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-500">Terminal Online: Prototype Mode v5.2</span>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest italic opacity-50">Local Synchronized Node • No DB Active</div>
      </div>

      {/* Waybill Modal */}
      {activeWaybillId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setActiveWaybillId(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Scan Animation */}
            <motion.div 
              initial={{ top: '-10%' }}
              animate={{ top: '110%' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10 pointer-events-none"
            />

            <div className="p-12 text-black font-serif">
              <div className="flex justify-between items-start mb-12 border-b border-black/10 pb-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">Nexus Waybill</h2>
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-black/40">Verified Shipping Manifest • AI Generated</p>
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-mono uppercase font-bold text-blue-600 mb-1">Doc ID: {activeWaybillId}-MANIFEST</div>
                   <div className="text-[10px] font-mono text-black/40">{new Date().toLocaleString()}</div>
                </div>
              </div>

              {(() => {
                const s = shipments.find(sh => sh.id === activeWaybillId);
                if (!s) return null;
                return (
                  <div className="space-y-12">
                    <div className="grid grid-cols-2 gap-12">
                      <div>
                        <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold text-black/30 mb-4 border-b border-black/5 pb-2">Shipper / Origin</h4>
                        <p className="text-sm font-bold uppercase">{s.origin}</p>
                        <p className="text-[10px] text-black/50 mt-1 uppercase italic">Terminal Alpha-7 Node</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold text-black/30 mb-4 border-b border-black/5 pb-2">Consignee / Destination</h4>
                        <p className="text-sm font-bold uppercase">{s.destination}</p>
                        <p className="text-[10px] text-black/50 mt-1 uppercase italic">Nexus Final Hub</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 py-8 border-y border-black/5">
                      <div>
                        <div className="text-[9px] uppercase font-bold text-black/30 mb-1">Item Description</div>
                        <div className="text-xs font-bold">Standard Logistics Container</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase font-bold text-black/30 mb-1">Total Weight</div>
                        <div className="text-xs font-bold">{s.weight}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase font-bold text-black/30 mb-1">Declared Value</div>
                        <div className="text-xs font-bold text-blue-600">{s.value}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                           <CheckCircle2 size={14} className="text-black/20" />
                           <span className="text-[9px] font-mono uppercase tracking-widest opacity-50 italic">AI Manifest Verified</span>
                        </div>
                        <div className="p-4 border border-black/5 bg-zinc-50 rounded-xl max-w-xs">
                          <p className="text-[9px] leading-relaxed italic opacity-40">"Autonomous Verification Node NX-001 has scanned this payload. No anomalies detected. Priority transit clearance granted."</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="w-24 h-24 border border-black/10 flex items-center justify-center p-2 mb-2">
                           {/* Decorative QR-like block */}
                           <div className="w-full h-full bg-black/5 grid grid-cols-4 grid-rows-4 gap-1 p-2">
                              {[...Array(16)].map((_, i) => (
                                <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-black/20' : 'bg-transparent'}`} />
                              ))}
                           </div>
                        </div>
                        <div className="text-[8px] font-mono uppercase tracking-tighter opacity-30">Scan for Verification</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <button 
                onClick={() => setActiveWaybillId(null)}
                className="mt-12 w-full py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors rounded-xl"
              >
                Close Manifest
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

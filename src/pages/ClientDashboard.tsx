import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase, isConfigured } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  BarChart3, 
  Package, 
  Truck, 
  Clock, 
  ArrowUpRight, 
  Bell, 
  ChevronRight,
  Filter,
  Download,
  LogOut
} from 'lucide-react';

export default function ClientDashboard() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!isConfigured) {
      navigate('/auth');
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    }).catch(err => {
      console.warn('Dashboard session check failed:', err);
      navigate('/auth');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const shipments = [
    { id: 'NEX-9921', destination: 'Shanghai, CN', status: 'In Transit', weight: '450kg', value: '$12,400' },
    { id: 'NEX-8832', destination: 'Dubai, UAE', status: 'Pickup Pending', weight: '1,200kg', value: '$45,000' },
    { id: 'NEX-7743', destination: 'New York, US', status: 'Delivered', weight: '85kg', value: '$3,200' },
    { id: 'NEX-6654', destination: 'Rotterdam, NL', status: 'In Transit', weight: '2,400kg', value: '$92,000' },
  ];

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
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-mono">Active Traffic Hub</h3>
              <button className="text-white/20 hover:text-white transition-colors"><Filter size={16}/></button>
            </div>
            
            {shipments.map((shipment, i) => (
              <motion.div 
                key={shipment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`border p-6 hover:border-blue-600/30 transition-all group flex items-center justify-between cursor-pointer rounded-2xl ${
                  theme === 'light' ? 'bg-white border-black/5' : 'bg-[#0d0d0d] border-white/5'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 flex items-center justify-center border rounded-xl ${
                    theme === 'light' ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'
                  }`}>
                    <Package className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <div className={`text-sm font-bold tracking-tighter font-mono ${theme === 'light' ? 'text-black' : 'text-white'}`}>{shipment.id}</div>
                    <div className={`text-[10px] font-bold uppercase italic serif leading-none ${theme === 'light' ? 'text-black/40' : 'text-white/40'}`}>{shipment.destination}</div>
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 font-mono ${theme === 'light' ? 'text-black/20' : 'text-white/20'}`}>Payload Parameters</div>
                  <div className={`text-xs font-bold font-mono ${theme === 'light' ? 'text-black/60' : 'text-white'}`}>{shipment.weight} / {shipment.value}</div>
                </div>

                <div className="flex items-center gap-8">
                  <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 border font-mono rounded-lg ${
                    shipment.status === 'Delivered' ? 'border-green-500/20 text-green-400 bg-green-500/5' : 'border-blue-500/20 text-blue-400 bg-blue-500/5'
                  }`}>
                    {shipment.status}
                  </div>
                  <ChevronRight className={`group-hover:translate-x-1 transition-all ${theme === 'light' ? 'text-black/20 group-hover:text-black' : 'text-white/10 group-hover:text-white'}`} size={18} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
             {/* Supply Chain Health Card */}
             <div className="bg-blue-600 p-8 text-white border-8 border-white/10 shadow-2xl shadow-blue-600/20">
               <h3 className="text-xl font-bold uppercase italic serif mb-6">Efficiency Pulse</h3>
               <div className="space-y-6">
                 {[
                   { label: 'Port Congestion (VX)', val: 88 },
                   { label: 'Route Stability index', val: 94 },
                   { label: 'Green Energy Factor', val: 32 },
                 ].map((bar, i) => (
                   <div key={i}>
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 font-mono">
                       <span className="opacity-70">{bar.label}</span>
                       <span>{bar.val}%</span>
                     </div>
                     <div className="h-[2px] bg-white/20 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${bar.val}%` }}
                         transition={{ duration: 1.5, delay: i * 0.2 }}
                         className="h-full bg-white shadow-[0_0_10px_white]" 
                       />
                     </div>
                   </div>
                 ))}
               </div>
               <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                 <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Node Status: OPTIMUM</span>
                 <Bell size={16} />
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
    </div>
  );
}

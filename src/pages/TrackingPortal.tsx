import React, { useState } from 'react';
import { Search, Package, MapPin, Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ShipmentStatus } from '../types';

export default function TrackingPortal() {
  const [trackingId, setTrackingId] = useState('');
  const [showResult, setShowResult] = useState(false);

  const steps = [
    { status: ShipmentStatus.PICKUP_PENDING, label: 'Order Picked Up', desc: 'Package received at originating hub', location: 'London Gateway, UK' },
    { status: ShipmentStatus.IN_TRANSIT, label: 'In Transit', desc: 'En route to redistribution center', location: 'Frankfurt Hub, DE' },
    { status: ShipmentStatus.OUT_FOR_DELIVERY, label: 'Out for Delivery', desc: 'Final mile courier dispatched', location: 'Berlin, DE' },
    { status: ShipmentStatus.DELIVERED, label: 'Delivered', desc: 'Securely delivered to recipient', location: 'Berlin Office, DE' },
  ];

  const currentStatusIndex = 1; // Simulated current status: IN_TRANSIT

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setShowResult(true);
    }
  };

  return (
    <div className="min-h-[80vh] px-6 py-20 bg-[#050505]">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase italic serif mb-6">Track & Trace</h1>
          <p className="text-white/40 uppercase text-[10px] tracking-widest font-bold font-mono">Real-time global intelligence / Node synchronization</p>
        </header>

        <form onSubmit={handleSearch} className="relative mb-20">
          <input
            type="text"
            placeholder="ENTER NODE ID (E.G. VX-9902-X)"
            className="w-full bg-[#0d0d0d] border border-white/10 px-10 py-8 text-xl md:text-2xl font-mono font-bold uppercase tracking-tighter focus:border-blue-600 outline-none transition-all placeholder:text-white/10"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-4 hover:bg-white hover:text-black transition-all"
          >
            <Search size={24} />
          </button>
        </form>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Shipment Info Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
                <div className="bg-[#0d0d0d] p-8">
                  <div className="text-[10px] font-bold text-white/40 uppercase font-mono tracking-widest mb-2">STATUS</div>
                  <div className="text-blue-400 text-lg font-bold uppercase italic serif tracking-tighter">IN TRANSIT</div>
                </div>
                <div className="bg-[#0d0d0d] p-8">
                  <div className="text-[10px] font-bold text-white/40 uppercase font-mono tracking-widest mb-2">PREDICTIVE ETA</div>
                  <div className="text-white text-lg font-bold uppercase tracking-tighter font-mono">MAY 15 / 14:20</div>
                  <div className="text-[10px] text-green-400 font-mono mt-1">-2h Early (AI Correction)</div>
                </div>
                <div className="bg-[#0d0d0d] p-8">
                  <div className="text-[10px] font-bold text-white/40 uppercase font-mono tracking-widest mb-2">SERVICE</div>
                  <div className="text-white text-lg font-bold uppercase tracking-tighter font-mono">VX-AIR-PRIORITY</div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="bg-[#0d0d0d] border border-white/5 p-8 md:p-12">
                <div className="relative">
                  {/* Vertical Line for Mobile */}
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10 md:hidden" />
                  
                  {/* Stepper Content */}
                  <div className="space-y-12 md:space-y-0 md:flex md:justify-between relative">
                    {steps.map((step, i) => {
                      const isCompleted = i <= currentStatusIndex;
                      const isCurrent = i === currentStatusIndex;
                      
                      return (
                        <div key={step.status} className="relative md:w-1/4 group">
                          {/* Desktop Horizontal Line */}
                          {i < steps.length - 1 && (
                            <div className="hidden md:block absolute left-1/2 right-[-50%] top-4 h-[1px] bg-white/10 z-0">
                               <div className={`h-full bg-blue-600 transition-all duration-1000 ${isCompleted ? 'w-full' : 'w-0'}`} />
                            </div>
                          )}

                          <div className="flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-4 relative z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isCompleted ? 'bg-blue-600 border-4 border-white' : 'bg-transparent border-4 border-white/10'
                            } ${isCurrent ? 'shadow-[0_0_15px_rgba(37,99,235,0.5)]' : ''}`}>
                               {isCurrent && <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />}
                            </div>
                            <div className="md:text-center">
                              <div className={`text-xs font-bold uppercase tracking-widest font-mono ${isCompleted ? 'text-white' : 'text-white/20'}`}>
                                {step.label}
                              </div>
                              <div className="text-[10px] font-medium text-white/40 uppercase tracking-widest mt-1">
                                {step.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tracking Details Table */}
                <div className="mt-20 border-t border-white/10 pt-12">
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 font-mono mb-8">NODE LOG HISTORY</h3>
                   <div className="space-y-4 font-mono">
                     {[
                       { time: '14:20 PM', date: 'MAY 12', loc: 'FRA-HUB-B', status: 'Department redistribution' },
                       { time: '09:15 AM', date: 'MAY 12', loc: 'LHR-GATE-X', status: 'Export clearance completed' },
                       { time: '06:30 AM', date: 'MAY 11', loc: 'LDN-CORR-1', status: 'Pick up processed' },
                     ].map((log, i) => (
                       <div key={i} className="flex grid-cols-4 items-center gap-8 py-4 border-b border-white/5 text-[10px] uppercase font-bold tracking-widest">
                         <div className="w-24 text-white/20">{log.date}</div>
                         <div className="w-24 text-white/20">{log.time}</div>
                         <div className="flex-1 text-white italic serif">{log.loc}</div>
                         <div className="flex-1 text-white/40 text-right">{log.status}</div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

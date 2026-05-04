import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initializeUserLocation, UserLocation } from '../services/locationService';

export default function LocationStatus() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const startSync = () => {
    setIsSyncing(true);
    initializeUserLocation(
      (loc) => {
        setLocation(loc);
        setIsSyncing(false);
      },
      (msg) => {
        setMessage(msg);
        // Clear message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
      }
    );
  };

  useEffect(() => {
    // Initial auto-sync attempt
    startSync();
  }, []);

  return (
    <div className="flex items-center gap-6">
      {/* Toast Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-10 right-10 z-[100] bg-[#0d0d0d] border border-white/10 px-6 py-4 flex items-center gap-4 shadow-2xl"
          >
            <div className={`w-2 h-2 rounded-full ${location?.status === 'allowed' ? 'bg-green-400' : 'bg-orange-500'} animate-pulse`} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/70">{message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Component */}
      <div className="flex items-center gap-4 bg-white/5 border border-white/5 px-4 py-2 hover:border-white/10 transition-all group">
        <div className="relative">
          <MapPin size={14} className={location?.status === 'allowed' ? 'text-blue-500' : 'text-white/20'} />
          {location?.status === 'allowed' && (
            <motion.div 
              layoutId="pulse"
              className="absolute inset-0 bg-blue-500/20 rounded-full scale-[2]"
              animate={{ opacity: [0, 1, 0], scale: [1, 2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </div>
        
        <div className="flex flex-col">
          <div className="text-[8px] text-white/30 uppercase font-mono leading-none mb-1">Nexus Node</div>
          <div className="text-[10px] font-bold uppercase tracking-tight font-mono truncate max-w-[120px]">
            {location?.nearestHub.name || 'Synchronizing...'}
          </div>
        </div>

        <button 
          onClick={startSync}
          disabled={isSyncing}
          className={`p-1.5 hover:bg-white/10 rounded-sm transition-all ${isSyncing ? 'animate-spin' : ''}`}
          title="Resync Node Environment"
        >
          <RefreshCcw size={10} className="text-white/40" />
        </button>

        <div className={`w-1.5 h-1.5 rounded-full ${
          location?.status === 'allowed' ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-white/20'
        }`} />
      </div>
    </div>
  );
}

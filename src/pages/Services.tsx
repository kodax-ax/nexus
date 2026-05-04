import React from 'react';
import { Truck, Ship, Plane, Warehouse, ShieldCheck, Globe, Zap, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function Services() {
  const categories = [
    {
      title: 'Global Transportation',
      services: [
        { name: 'Air Freight Priority', icon: Plane, desc: 'Critical supply chain solutions with guaranteed cargo space.' },
        { name: 'Ocean Container Solutions', icon: Ship, desc: 'Full (FCL) and Partial (LCL) shipments with predictive port tracking.' },
        { name: 'Multimodal Routing', icon: Globe, desc: 'Optimized travel across sea, air, and land to maximize efficiency.' }
      ]
    },
    {
      title: 'Strategic Warehousing',
      services: [
        { name: 'Smart Fulfillment', icon: Warehouse, desc: 'AI-driven inventory management and automated picking/packing.' },
        { name: 'Conditioned Storage', icon: ShieldCheck, desc: 'Climate-controlled facilities for high-value and sensitive assets.' },
        { name: 'Distribution Hubs', icon: Truck, desc: 'Global network of last-mile delivery centers in key urban zones.' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase italic serif mb-8">Service <br/> Vertical</h1>
            <p className="text-white/40 text-lg md:text-xl leading-relaxed uppercase font-mono tracking-tighter">
              Orchestrating infrastructure through intelligence. A unified suite of 
              logistics capabilities for the global node network.
            </p>
          </div>
          <div className="bg-blue-600 p-12 text-white md:max-w-xs w-full shadow-2xl shadow-blue-600/20">
            <Zap className="mb-6" />
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Node Readiness</h4>
            <p className="text-[10px] font-mono leading-relaxed opacity-70">Synchronized via Vortex API v4.4. Distributed across all active corridors.</p>
          </div>
        </header>

        <div className="space-y-32">
          {categories.map((cat, idx) => (
            <div key={idx}>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500 mb-12 border-b border-white/5 pb-4 font-mono">{cat.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
                {cat.services.map((service, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="p-8 bg-[#0d0d0d] hover:bg-white/5 transition-all flex flex-col h-full group"
                  >
                    <service.icon className="text-blue-600 mb-8 group-hover:scale-110 transition-transform" size={24} />
                    <h3 className="text-2xl font-bold uppercase italic serif mb-4">{service.name}</h3>
                    <p className="text-white/30 text-xs leading-relaxed mb-12 flex-grow font-mono uppercase tracking-tighter">{service.desc}</p>
                    <div className="flex gap-4">
                       <Clock className="text-white/10" size={12} />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 italic font-mono">Status: ACTIVE POOL</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <section className="mt-40 grid grid-cols-2 md:grid-cols-4 bg-white/5 border border-white/5 gap-px">
          {[
            { label: 'Network Integration', val: '180 Nodes' },
            { label: 'Carbon Efficiency', val: '94% Level' },
            { label: 'Security Grade', val: 'VX-ALPHA-9' },
            { label: 'API Uptime', val: '99.99%' },
          ].map((item, i) => (
            <div key={i} className="p-12 bg-[#050505] text-center">
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4 font-mono">{item.label}</div>
              <div className="text-2xl font-bold tracking-tighter uppercase italic serif">{item.val}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

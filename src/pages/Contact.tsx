import React, { useState, useMemo } from 'react';
import { Send, MapPin, Phone, Mail, Globe, Calculator, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { calculateChargeableWeight, estimateShippingCost } from '../lib/logistics';
import { SERVICE_LEVELS } from '../constants';

export default function Contact() {
  // Calculator State
  const [calcData, setCalcData] = useState({
    weight: 0,
    l: 0,
    w: 0,
    h: 0,
    distance: 100,
    service: 'standard'
  });

  const calculation = useMemo(() => {
    const chargeable = calculateChargeableWeight(calcData.weight, calcData.l, calcData.w, calcData.h);
    const service = SERVICE_LEVELS.find(s => s.id === calcData.service) || SERVICE_LEVELS[1];
    const cost = estimateShippingCost(chargeable, service.rate, calcData.distance);
    return { chargeable, cost, serviceName: service.name };
  }, [calcData]);

  return (
    <div className="min-h-screen bg-[#050505] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase italic serif mb-8">Node <br/> Contact</h1>
          <p className="text-white/40 text-lg md:text-xl uppercase tracking-[0.3em] font-bold font-mono">Inbound Operations Terminal</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Rate Calculator (Pillar 3 Business Logic) */}
          <div className="bg-[#0d0d0d] border border-white/5 p-12">
            <div className="flex items-center gap-4 mb-12">
              <Calculator className="text-blue-600" />
              <h2 className="text-2xl font-bold uppercase italic serif tracking-tighter">Rate Intelligence</h2>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block font-mono">Actual Weight (KG)</label>
                  <input 
                    type="number" 
                    className="w-full bg-white/5 border border-white/10 p-4 font-mono font-bold text-white outline-none focus:border-blue-600 transition-all"
                    value={calcData.weight}
                    onChange={e => setCalcData({...calcData, weight: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block font-mono">Distance (KM)</label>
                  <input 
                    type="number" 
                    className="w-full bg-white/5 border border-white/10 p-4 font-mono font-bold text-white outline-none focus:border-blue-600 transition-all"
                    value={calcData.distance}
                    onChange={e => setCalcData({...calcData, distance: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block font-mono">Dimensions (L x W x H CM)</label>
                <div className="grid grid-cols-3 gap-4 font-mono">
                   <input type="number" placeholder="L" className="bg-white/5 border border-white/10 p-4 font-bold outline-none focus:border-blue-600" onChange={e => setCalcData({...calcData, l: parseFloat(e.target.value) || 0})} />
                   <input type="number" placeholder="W" className="bg-white/5 border border-white/10 p-4 font-bold outline-none focus:border-blue-600" onChange={e => setCalcData({...calcData, w: parseFloat(e.target.value) || 0})} />
                   <input type="number" placeholder="H" className="bg-white/5 border border-white/10 p-4 font-bold outline-none focus:border-blue-600" onChange={e => setCalcData({...calcData, h: parseFloat(e.target.value) || 0})} />
                </div>
              </div>

              <div>
                 <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block font-mono">Service Protocol</label>
                 <select 
                    className="w-full bg-white/5 border border-white/10 p-4 font-bold uppercase tracking-widest text-white outline-none focus:border-blue-600 font-mono text-[10px]"
                    value={calcData.service}
                    onChange={e => setCalcData({...calcData, service: e.target.value})}
                  >
                   {SERVICE_LEVELS.map(s => <option key={s.id} value={s.id} className="bg-black">{s.name}</option>)}
                 </select>
              </div>

              {/* Calc Results */}
              <div className="mt-12 pt-12 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-mono">Computed Chargeable Load</span>
                  <span className="text-2xl font-mono font-bold">{calculation.chargeable.toFixed(2)} KG</span>
                </div>
                <div className="bg-blue-600/5 border border-blue-500/20 p-6 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 font-mono">Rate Estimate ({calculation.serviceName})</span>
                  <span className="text-4xl font-mono font-bold text-white">${calculation.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <p className="text-[8px] text-white/20 italic font-mono uppercase tracking-widest">Rate calculation derived from node-specific volumetric weighting Factor / 5000.</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
               {[
                 { icon: Phone, label: 'OPS TERMINAL', val: '+1 (800) 555-NEXUS' },
                 { icon: Mail, label: 'CORE INQUIRIES', val: 'OPS@NEXUSGLOBAL.COM' },
                 { icon: MapPin, label: 'CORPORATE NODE', val: 'HUDSON YARDS, NYC' },
                 { icon: Globe, label: 'NODE NETWORK', val: 'SINGAPORE / LONDON / HAMBURG' },
               ].map((c, i) => (
                 <div key={i} className="group bg-[#0d0d0d] p-8">
                    <c.icon className="text-white/10 group-hover:text-blue-600 transition-colors mb-4" size={20} />
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 font-mono">{c.label}</div>
                    <div className="text-xs font-bold uppercase tracking-wider font-mono">{c.val}</div>
                 </div>
               ))}
            </div>

            <form className="space-y-6 pt-12 border-t border-white/10">
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-mono">Node Authority Name</label>
                   <input type="text" className="w-full bg-[#0d0d0d] border border-white/10 p-4 focus:border-blue-600 outline-none font-mono text-sm" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-mono">Corporate Route Email</label>
                   <input type="email" className="w-full bg-[#0d0d0d] border border-white/10 p-4 focus:border-blue-600 outline-none font-mono text-sm" />
                 </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-mono">Project Parameters</label>
                <textarea rows={4} className="w-full bg-[#0d0d0d] border border-white/10 p-4 focus:border-blue-600 outline-none resize-none font-mono text-sm"></textarea>
              </div>
              <button className="w-full bg-blue-600 text-white py-6 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group font-mono text-xs">
                Transmit Parameters <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

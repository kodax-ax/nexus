import { ArrowRight, Box, MoveRight, Shield, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className={`transition-colors duration-500 ${theme === 'light' ? 'bg-zinc-50' : 'bg-[#050505]'}`}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-blue-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-6 block font-mono"
          >
            Terminal ID: VX-9902-X • Global Transit Corridor
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-6xl md:text-[9rem] font-bold tracking-tighter leading-[0.8] uppercase mb-8 ${
              theme === 'light' ? 'text-black' : 'text-white'
            }`}
          >
            Nexus <br />
            <span className="outline-text">Intelligence</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-sm md:text-base max-w-xl mb-12 leading-relaxed font-mono uppercase tracking-tight ${
              theme === 'light' ? 'text-black/60' : 'text-white/40'
            }`}
          >
            System operational. Real-time fleet synchronization active. 
            High-velocity logistics engineered for global scale.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/tracking" className="bg-blue-600 text-white px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-3 group">
              Initialize Tracking <MoveRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/contact" className={`border px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all ${
              theme === 'light' ? 'border-black/10 text-black' : 'border-white/10 text-white'
            }`}>
              Request Parameters
            </Link>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="max-w-7xl mx-auto w-full mt-24 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'DELIVERED', val: '2.4M+' },
            { label: 'COUNTRIES', val: '180+' },
            { label: 'FLEET SIZE', val: '12.5K' },
            { label: 'LATENCY', val: '12ms' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={`border p-6 transition-colors duration-500 ${
                theme === 'light' ? 'bg-white border-black/5' : 'bg-white/5 border-white/5'
              }`}
            >
              <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 font-mono ${
                theme === 'light' ? 'text-black/40' : 'text-white/40'
              }`}>{stat.label}</div>
              <div className={`text-2xl font-bold tracking-tight font-mono ${
                theme === 'light' ? 'text-black' : 'text-white'
              }`}>{stat.val}</div>
            </motion.div>
          ))}
        </div>

        {/* Decorative Background Elements */}
        {theme === 'dark' && (
          <>
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full shadow-[0_0_120px_rgba(37,99,235,0.1)]" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full" />
          </>
        )}
      </section>

      {/* Services Highlight */}
      <section className={`py-32 px-6 transition-colors duration-500 ${
        theme === 'light' ? 'bg-white' : 'bg-[#080808]'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className={`flex flex-col md:flex-row justify-between items-end gap-8 mb-20 border-b pb-12 ${
            theme === 'light' ? 'border-black/5' : 'border-white/10'
          }`}>
            <div>
              <h2 className={`text-4xl md:text-5xl font-bold tracking-tighter uppercase italic serif mb-4 ${
                theme === 'light' ? 'text-black' : 'text-white'
              }`}>Vertical Capabilities</h2>
              <p className={`max-w-sm uppercase text-[10px] tracking-widest font-bold font-mono ${
                theme === 'light' ? 'text-black/40' : 'text-white/30'
              }`}>Infrastructure as Code: Logistics Edition</p>
            </div>
            <Link to="/services" className="text-blue-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all font-mono">
              Terminal Index <ArrowRight size={14} />
            </Link>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-px border transition-colors duration-500 overflow-hidden rounded-3xl ${
            theme === 'light' ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'
          }`}>
            {[
              { title: 'Air Freight', icon: Zap, desc: 'Priority transit via global air corridors. Optimized load factors.' },
              { title: 'Ocean Cargo', icon: Box, desc: 'Predictive port data integrations minimizing demurrage and transit time.' },
              { title: 'Fleet AI', icon: Shield, desc: 'Self-correcting distribution networks across multi-node hubs.' },
            ].map((s, i) => (
              <div key={i} className={`p-12 group transition-all duration-500 cursor-pointer ${
                theme === 'light' ? 'bg-white hover:bg-zinc-50' : 'bg-[#050505] hover:bg-white/5'
              }`}>
                <s.icon className="text-blue-600 mb-8" size={24} />
                <h3 className={`text-xl font-bold uppercase italic serif mb-4 ${
                  theme === 'light' ? 'text-black' : 'text-white'
                }`}>{s.title}</h3>
                <p className={`text-xs leading-relaxed font-mono uppercase tracking-tighter ${
                  theme === 'light' ? 'text-black/60' : 'text-white/40'
                }`}>{s.desc}</p>
                <div className="mt-8 border-t border-white/5 pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Initialize Module →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .serif { font-family: 'Playfair Display', serif; }
      `}} />
    </div>
  );
}

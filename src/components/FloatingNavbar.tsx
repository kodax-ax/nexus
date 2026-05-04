import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Package, User, Sun, Moon, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';

export default function FloatingNavbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/', label: 'Node' },
    { icon: Search, path: '/tracking', label: 'Trace' },
    { icon: Package, path: '/dashboard', label: 'Vault' },
    { icon: User, path: '/auth', label: 'ID' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-lg">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`glass rounded-3xl p-2 flex items-center justify-between shadow-2xl border-white/5 ${
          theme === 'light' ? 'bg-white/80 border-black/5 brightness-110 shadow-black/10' : 'bg-black/40'
        }`}
      >
        <div className="flex items-center gap-1 w-full justify-around px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link 
                key={item.path} 
                to={item.path}
                className="relative group p-3 flex flex-col items-center gap-1 min-w-[64px]"
              >
                <Icon 
                  size={20} 
                  className={`transition-all duration-300 ${
                    isActive 
                      ? 'text-blue-600' 
                      : theme === 'light' ? 'text-black/40 group-hover:text-black' : 'text-white/40 group-hover:text-white'
                  }`} 
                />
                <span className={`text-[8px] font-mono font-bold uppercase tracking-widest leading-none ${
                    isActive 
                      ? 'text-blue-600' 
                      : theme === 'light' ? 'text-black/20' : 'text-white/20'
                  }`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 bg-blue-600/10 rounded-2xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}

          <div className="w-px h-8 bg-white/10 mx-2" />

          {/* Action Icons */}
          <div className="flex items-center gap-2">
             <button 
               onClick={toggleTheme}
               className={`p-3 rounded-2xl transition-all ${
                 theme === 'light' ? 'hover:bg-black/5 text-black' : 'hover:bg-white/5 text-white'
               }`}
             >
               {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
             </button>
             
             <div className="relative p-3 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer">
               <Bell size={18} className={theme === 'light' ? 'text-black' : 'text-white'} />
               <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0d0d0d] shadow-[0_0_8px_red]" />
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

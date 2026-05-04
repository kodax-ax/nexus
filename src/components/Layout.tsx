import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, Truck, LayoutDashboard, Globe, Mail, Search, ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LocationStatus from './LocationStatus';
import FloatingNavbar from './FloatingNavbar';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const LANGUAGES = [
  { code: 'EN', name: 'English' },
  { code: 'FR', name: 'Français' },
  { code: 'ZH', name: 'Mandarin' },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Mock Session check
    const checkSession = () => {
      const mockUser = localStorage.getItem('mock_user');
      setSession(mockUser ? JSON.parse(mockUser) : null);
    };

    checkSession();
    
    // Listen for storage changes (for tab synchronization if needed)
    window.addEventListener('storage', checkSession);
    
    // In a real SPA, you'd use a context or a custom event to detect login/logout
    // For this simple mock, we'll just check every second if the session changed
    const interval = setInterval(checkSession, 1000);

    return () => {
      window.removeEventListener('storage', checkSession);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mock_user');
    setSession(null);
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Globe },
    { name: 'Tracking', path: '/tracking', icon: Search },
    ...(session ? [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }] : []),
    { name: 'Services', path: '/services', icon: Truck },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-blue-600 selection:text-white border-x-8 ${
      theme === 'light' ? 'bg-zinc-50 text-black border-zinc-200' : 'bg-[#050505] text-white border-[#111]'
    }`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md ${
        theme === 'light' ? 'bg-white/80 border-black/5' : 'bg-black/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
              <Package className="-rotate-45 text-black" size={16} />
            </div>
            <span className={`text-lg font-bold tracking-tighter uppercase whitespace-nowrap ${theme === 'light' ? 'text-black' : 'text-white'}`}>Nexus<span className="text-blue-600">Global</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs font-semibold tracking-widest uppercase transition-colors ${
                    isActive 
                      ? theme === 'light' ? 'text-black' : 'text-white' 
                      : theme === 'light' ? 'text-black/40 hover:text-black' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <div className="relative hidden xl:block">
               <button 
                 onClick={() => setIsLangOpen(!isLangOpen)}
                 className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest font-mono p-2 px-3 border border-white/5 rounded-sm hover:bg-white/5 transition-all ${
                   theme === 'light' ? 'border-black/5 hover:bg-black/5 text-black' : 'text-white'
                 }`}
               >
                 <Globe size={12} className="text-blue-600" /> {lang.code} <ChevronDown size={10} />
               </button>
               <AnimatePresence>
                 {isLangOpen && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className={`absolute top-full right-0 mt-2 p-2 border border-white/10 rounded-sm min-w-[120px] shadow-2xl z-50 ${
                       theme === 'light' ? 'bg-white border-black/5 text-black' : 'bg-[#0d0d0d]'
                     }`}
                   >
                     {LANGUAGES.map(l => (
                       <button 
                         key={l.code}
                         onClick={() => { setLang(l); setIsLangOpen(false); }}
                         className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors rounded-sm ${
                           lang.code === l.code ? 'text-blue-500' : ''
                         }`}
                       >
                         {l.name}
                       </button>
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            <div className="hidden lg:block">
              <LocationStatus />
            </div>
            
            <div className="hidden lg:text-right lg:block">
              <div className={`text-[10px] uppercase font-mono tracking-tighter ${theme === 'light' ? 'text-black/40' : 'text-white/40'}`}>System Status</div>
              <div className="text-[10px] text-green-400 font-mono flex items-center gap-1 justify-end">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                OPERATIONAL 99.9%
              </div>
            </div>
            {session ? (
              <button
                onClick={handleLogout}
                className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors border flex items-center gap-2 ${
                  theme === 'light' 
                    ? 'bg-red-600 text-white hover:bg-black' 
                    : 'bg-red-600 text-white hover:bg-white hover:text-black'
                }`}
              >
                <LogOut size={12} /> Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors border ${
                  theme === 'light' 
                    ? 'bg-black text-white hover:bg-blue-600' 
                    : 'bg-white text-black hover:bg-blue-600 hover:text-white'
                }`}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      <FloatingNavbar />

      {/* Footer */}
      <footer className={`border-t py-20 px-6 transition-colors duration-500 ${
        theme === 'light' ? 'bg-white border-black/5' : 'bg-[#0a0a0a] border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
             <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center rotate-45 transition-transform hover:rotate-0">
                <Package className="-rotate-45 text-black" size={16} />
              </div>
              <span className={`text-lg font-bold tracking-tighter uppercase ${theme === 'light' ? 'text-black' : 'text-white'}`}>Nexus<span className="text-blue-600">Global</span></span>
            </Link>
            <p className={`max-w-md text-sm leading-relaxed ${theme === 'light' ? 'text-black/60' : 'text-zinc-500'}`}>
              Global logistics redefined with precision, intelligence, and a commitment to seamless freight management.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-6 font-mono">Terminal Index</h4>
            <ul className={`space-y-4 text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'text-black/40' : 'text-zinc-400'}`}>
              {navItems.map(item => (
                <li key={item.path}><Link to={item.path} className={`transition-colors ${theme === 'light' ? 'hover:text-black' : 'hover:text-white'}`}>{item.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-6 font-mono">Node Connection</h4>
            <ul className={`space-y-4 text-[10px] font-medium tracking-widest font-mono ${theme === 'light' ? 'text-black/40' : 'text-zinc-400'}`}>
              <li>OPS@NEXUSGLOBAL.COM</li>
              <li>+1 (800) 555-NEXUS</li>
              <li>NEW YORK / LONDON / SINGAPORE</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className={`text-[10px] uppercase tracking-widest font-mono opacity-50 ${theme === 'light' ? 'text-black' : 'text-zinc-600'}`}>ENGINE: LOCAL VOLATILE STORAGE (REGION: BROWSER-CACHE)</span>
          <div className={`flex gap-8 text-[10px] uppercase tracking-widest italic font-serif opacity-30 ${theme === 'light' ? 'text-black' : 'text-zinc-600'}`}>
            Nexus Terminal v.5.0.0-mock © 2026 Local Architecture Unit
          </div>
        </div>
      </footer>
    </div>
  );
}

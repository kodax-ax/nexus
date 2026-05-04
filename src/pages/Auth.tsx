import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase, isConfigured } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfigured) {
      setError('Supabase connection parameters missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment settings.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        setError('Check your email for the confirmation link.');
      }
    } catch (err: any) {
      setError(err.message || 'Auth execution failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isConfigured) {
      setError('Supabase connection parameters missing.');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google Auth failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isConfigured) return;

    // Check if session exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard');
    }).catch(err => {
      console.warn('Supabase session check failed:', err);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate('/dashboard');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className={`min-h-screen pt-20 pb-40 px-6 flex items-center justify-center transition-colors duration-500 ${
      theme === 'light' ? 'bg-zinc-50' : 'bg-[#050505]'
    }`}>
      <div className="max-w-md w-full">
        <header className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tighter uppercase italic serif mb-4 ${
            theme === 'light' ? 'text-black' : 'text-white'
          }`}>
            {isLogin ? 'Initialize' : 'Register'} <br/> Credentials
          </h1>
          <p className={`uppercase text-[10px] tracking-[0.3em] font-bold font-mono ${
            theme === 'light' ? 'text-black/40' : 'text-white/40'
          }`}>
            {isLogin ? 'Access secure terminal via synchronized node' : 'Establish new identity within global network'}
          </p>
        </header>

        <motion.div 
          layout
          className={`glass p-8 md:p-12 rounded-3xl border-white/5 relative overflow-hidden ${
            theme === 'light' ? 'bg-white border-black/5 shadow-xl' : 'bg-[#0d0d0d]'
          }`}
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mb-6 p-4 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest text-center ${
                error.includes('Check your email') 
                  ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' 
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}
            >
              {error}
            </motion.div>
          )}

          {!isConfigured && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest text-orange-500 text-center"
            >
              System Warning: No Database Parameters. <br/>
              Configuration Required in Settings.
            </motion.div>
          )}

          <form onSubmit={handleAuth} className="space-y-6 relative z-10">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-2"
                >
                  <label className={`text-[10px] font-bold uppercase tracking-widest font-mono ${
                    theme === 'light' ? 'text-black/40' : 'text-white/40'
                  }`}>Full Name</label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                      theme === 'light' ? 'text-black/20' : 'text-white/20'
                    }`} size={16} />
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="COMMANDER NAME"
                      className={`w-full bg-white/5 border border-white/10 p-4 pl-12 font-mono text-xs focus:border-blue-600 outline-none rounded-xl transition-all ${
                        theme === 'light' ? 'text-black border-black/10' : 'text-white'
                      }`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className={`text-[10px] font-bold uppercase tracking-widest font-mono ${
                theme === 'light' ? 'text-black/40' : 'text-white/40'
              }`}>Company Email</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  theme === 'light' ? 'text-black/20' : 'text-white/20'
                }`} size={16} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="OPS@NEXUS.CORP"
                  className={`w-full bg-white/5 border border-white/10 p-4 pl-12 font-mono text-xs focus:border-blue-600 outline-none rounded-xl transition-all ${
                    theme === 'light' ? 'text-black border-black/10' : 'text-white'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-[10px] font-bold uppercase tracking-widest font-mono ${
                theme === 'light' ? 'text-black/40' : 'text-white/40'
              }`}>Secure Password</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  theme === 'light' ? 'text-black/20' : 'text-white/20'
                }`} size={16} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border border-white/10 p-4 pl-12 font-mono text-xs focus:border-blue-600 outline-none rounded-xl transition-all ${
                    theme === 'light' ? 'text-black border-black/10' : 'text-white'
                  }`}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group rounded-xl font-mono text-xs shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  {isLogin ? 'Initialize Connection' : 'Verify Identity'} 
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-widest">S3 Integration</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className={`bg-white/5 border border-white/10 p-3 flex items-center justify-center gap-2 hover:bg-white/10 transition-all rounded-xl disabled:opacity-50 ${
                theme === 'light' ? 'border-black/10 text-black' : 'text-white'
              }`}>
                <Chrome size={16} /> <span className="text-[10px] font-mono font-bold">Google</span>
              </button>
              <button className={`bg-white/5 border border-white/10 p-3 flex items-center justify-center gap-2 hover:bg-white/10 transition-all rounded-xl ${
                theme === 'light' ? 'border-black/10 text-black' : 'text-white'
              }`}>
                <Github size={16} /> <span className="text-[10px] font-mono font-bold">GitHub</span>
              </button>
            </div>

            <p className={`text-center text-[10px] font-mono font-bold uppercase tracking-widest ${
              theme === 'light' ? 'text-black/40' : 'text-white/40'
            }`}>
              {isLogin ? "No identity index?" : "Index already exists?"} {" "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-500 hover:underline"
              >
                {isLogin ? 'Register Node' : 'Login Terminal'}
              </button>
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/5 blur-3xl -z-10" />
        </motion.div>
        
        <div className="mt-8 flex justify-center">
           <div className={`flex items-center gap-2 text-[8px] font-mono font-bold uppercase tracking-widest opacity-30 ${
             theme === 'light' ? 'text-black' : 'text-white'
           }`}>
             <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
             Supabase Authentication Instance: Running (v1.0.2)
           </div>
        </div>
      </div>
    </div>
  );
}

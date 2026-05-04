import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);

    // Mock Authentication Logic
    setTimeout(() => {
      setLoading(false);
      // Prototype Mode Bypass: Allow entry with any or no input
      const userEmail = email || 'guest@nexus_prototype.corp';
      if (isLogin) {
        localStorage.setItem('mock_user', JSON.stringify({ email: userEmail, full_name: fullName || 'Nexus Operator' }));
        navigate('/dashboard');
      } else {
        setSignUpSuccess(true);
      }
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('mock_user', JSON.stringify({ email: 'google-user@nexus.corp', full_name: 'Google User' }));
      navigate('/dashboard');
    }, 800);
  };

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
            {isLogin ? 'Local Prototype Mode | No Credentials Required' : 'Register local node identity'}
          </p>
        </header>

        <motion.div 
          layout
          className={`glass p-8 md:p-12 rounded-3xl border-white/5 relative overflow-hidden ${
            theme === 'light' ? 'bg-white border-black/5 shadow-xl' : 'bg-[#0d0d0d]'
          }`}
        >
          {signUpSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className={`w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-600/20`}>
                <Mail className="text-blue-500" size={32} />
              </div>
              <h3 className={`text-xl font-bold tracking-tighter uppercase font-mono ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                Registration successful!
              </h3>
              <p className={`text-[10px] font-mono leading-relaxed tracking-wider uppercase opacity-60 px-4 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                We've sent a verification link to your email. Once you click the link in your inbox, please return to this page and Sign In to access your dashboard.
              </p>
              <div className="pt-4">
                <button 
                  onClick={() => {
                    setSignUpSuccess(false);
                    setIsLogin(true);
                  }}
                  className="w-full bg-blue-600 text-white py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-xl font-mono text-xs shadow-xl shadow-blue-600/20"
                >
                  Back to Login
                </button>
              </div>
            </motion.div>
          ) : (
            <>
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
            </>
          )}

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/5 blur-3xl -z-10" />
        </motion.div>
        
        <div className="mt-8 flex justify-center">
           <div className={`flex items-center gap-2 text-[8px] font-mono font-bold uppercase tracking-widest opacity-30 ${
             theme === 'light' ? 'text-black' : 'text-white'
           }`}>
             <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
             Nexus Global Logistics: Prototype Mode (v5.0-proto)
           </div>
        </div>
      </div>
    </div>
  );
}

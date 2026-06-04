import React from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, AlertCircle, ExternalLink } from 'lucide-react';
import Logo from '../Logo';

interface AdminLoginProps {
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  shakeLogin: boolean;
  loginError: string;
  handleLogin: (e: React.FormEvent) => void;
  onBackToSite: () => void;
}

export default function AdminLogin({
  password,
  setPassword,
  showPassword,
  setShowPassword,
  shakeLogin,
  loginError,
  handleLogin,
  onBackToSite
}: AdminLoginProps) {
  return (
    <div className="min-h-screen relative bg-navy-dark flex items-center justify-center p-6 selection:bg-gold/30 selection:text-white">
      <div className="absolute top-[15%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-gold/3 opacity-30 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-navy-light/40 opacity-20 blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-md w-full glass-panel p-8 md:p-10 rounded-none border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 border border-gold/40 bg-white/5 flex items-center justify-center mx-auto mb-4 scale-100 hover:scale-105 transition-transform duration-500 rounded-full">
            <Logo variant="emblem" className="w-14 h-14 text-gold" />
          </div>
          <h2 className="font-serif text-xl md:text-2xl font-bold tracking-widest text-white uppercase mb-1">
            HAZAR ARCHITECTURE
          </h2>
          <p className="text-[10px] tracking-[0.25em] text-gold uppercase font-mono font-bold">
            ADMINISTRATIVE INTERFACE
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs tracking-wider uppercase text-white/50 font-medium block">
              Access Passcode
            </label>
            
            <motion.div 
              animate={shakeLogin ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gold">
                <Lock className="w-4 h-4" />
              </div>
              
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-4 pl-12 pr-12 rounded-none bg-white/5 text-sm text-white placeholder-white/20 border border-white/10 hover:border-white/20 focus:border-gold outline-none transition-all duration-300 font-sans tracking-widest"
                placeholder="••••••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-gold transition-colors duration-300 pointer-events-auto"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </motion.div>

            {loginError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-400 mt-1 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{loginError}</span>
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            className="w-full relative py-4 bg-gradient-to-r from-gold to-[#8A6D25] text-navy-dark font-sans text-xs md:text-sm font-extrabold uppercase tracking-[0.2em] transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,168,76,0.5)] hover:scale-[1.01] active:scale-[0.99]"
          >
            Authenticate Portal
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <button
            onClick={onBackToSite}
            className="text-white/40 text-xs uppercase tracking-widest hover:text-gold transition-colors duration-300 inline-flex items-center gap-1.5 font-semibold animate-pulse"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Back to Public Atelier</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

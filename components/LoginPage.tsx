
import React, { useState } from 'react';
import { Scissors, User, Lock, ArrowLeft, AlertCircle, Eye, EyeOff, Loader2, Mail } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface LoginPageProps {
  onLogin: (user: string, pass: string) => void;
  onBack: () => void;
  error?: string;
  isLoading?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack, error, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { heroSettings } = useContent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#052e28] relative overflow-hidden font-sans">
      {/* Decorative background overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0c7565] opacity-[0.07] blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0c7565] opacity-[0.07] blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <button 
        onClick={onBack}
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
      >
        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#0c7565] group-hover:border-[#0c7565] transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="font-bold text-sm tracking-widest uppercase">Kembali</span>
      </button>

      <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in zoom-in duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex mb-6 overflow-hidden rounded-3xl">
              {heroSettings.logo ? (
                <img 
                  src={heroSettings.logo} 
                  alt="Pixel Logo" 
                  className="h-24 w-auto object-contain transition-all shadow-xl shadow-[#0c7565]/20" 
                />
              ) : heroSettings.footerLogo ? (
                 <img 
                  src={heroSettings.footerLogo} 
                  alt="Pixel Logo" 
                  className="h-20 w-auto object-contain transition-all shadow-xl shadow-[#0c7565]/20" 
                />
              ) : (
                <div className="p-4 bg-[#0c7565] text-white shadow-xl shadow-[#0c7565]/20">
                  <Scissors size={32} />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">PIXEL <span className="text-[#0c7565]">ADMIN</span></h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-bold animate-pulse">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Email Admin</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-[#0c7565] transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#0c7565] focus:border-transparent transition-all placeholder:text-white/20 disabled:opacity-50"
                  placeholder="admin@pixel.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-[#0c7565] transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#0c7565] focus:border-transparent transition-all placeholder:text-white/20 disabled:opacity-50"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-[#0c7565] text-white font-black rounded-2xl shadow-xl shadow-black/20 hover:bg-[#0d8a77] hover:-translate-y-1 active:translate-y-0 transition-all text-sm tracking-widest uppercase flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
              {isLoading ? 'Menyiapkan...' : 'Masuk Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

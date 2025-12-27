import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import CostCalculator from './views/CostCalculator.tsx';
import ProductManager from './views/ProductManager.tsx';
import POS from './views/POS.tsx';
import Settings from './views/Settings.tsx';
import { AppMode, AuthState, UserProfile, DEFAULT_BRAND_INFO } from './types.ts';
import { LogIn } from 'lucide-react';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.POS);
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [loginForm, setLoginForm] = useState({ name: '', password: '' });

  useEffect(() => {
    const session = sessionStorage.getItem('eyn_session');
    if (session) setAuth({ user: JSON.parse(session), isAuthenticated: true });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = loginForm.name.trim().toLowerCase();
    const pass = loginForm.password.trim();

    if (user === 'admin' && pass === '1234') {
      const admin: UserProfile = { id: 'admin', name: 'ADMIN', role: 'ADMIN', isActive: true };
      setAuth({ user: admin, isAuthenticated: true });
      sessionStorage.setItem('eyn_session', JSON.stringify(admin));
    } else {
      alert("Accès refusé. Utilisez admin / 1234");
    }
  };

  if (!auth.isAuthenticated) return (
    <div className="h-full bg-[#111827] flex flex-col items-center justify-center p-8 animate-fade">
      <div className="w-full max-w-xs space-y-10 text-center">
        <div className="flex justify-center">
          <div className="w-28 h-28 bg-yellow-400 rounded-[2rem] flex items-center justify-center shadow-2xl rotate-12">
            <span className="text-[#111827] font-black text-5xl -rotate-12">E</span>
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">EYN<span className="text-yellow-400">PRO</span></h1>
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em]">Skin Professional System</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" placeholder="UTILISATEUR" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold outline-none focus:border-yellow-400" value={loginForm.name} onChange={e => setLoginForm({...loginForm, name: e.target.value})} />
          <input type="password" placeholder="CODE SECRET" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold outline-none focus:border-yellow-400" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
          <button type="submit" className="w-full bg-yellow-400 text-[#111827] py-5 rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all">DÉVERROUILLER</button>
        </form>
      </div>
    </div>
  );

  return (
    <Layout activeMode={activeMode} onModeChange={setActiveMode} title={activeMode} currentUser={auth.user}>
      {activeMode === AppMode.CALCULATOR && <CostCalculator currentUser={auth.user} />}
      {activeMode === AppMode.MANAGER && <ProductManager currentUser={auth.user} />}
      {activeMode === AppMode.POS && <POS currentUser={auth.user} />}
      {activeMode === AppMode.ADMIN && <Settings onLogout={() => setAuth({user:null, isAuthenticated:false})} />}
    </Layout>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Barcode, ArrowRight, X, Minus, Plus } from 'lucide-react';
import { Product, UserProfile } from '../types.ts';

const POS: React.FC<{ currentUser: UserProfile | null }> = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [cash, setCash] = useState('');

  const total = cart.reduce((s, i) => s + (i.sellPrice * i.quantity), 0);
  const change = parseFloat(cash) > total ? parseFloat(cash) - total : 0;

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Barre de recherche blanche style photo */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input type="text" placeholder="Nom ou code..." className="w-full bg-white rounded-3xl pl-12 pr-6 py-5 text-sm font-bold shadow-sm outline-none" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="bg-[#111827] text-yellow-400 p-5 rounded-3xl shadow-xl"><Barcode className="w-6 h-6" /></button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 hide-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 text-center">
            <ShoppingBag className="w-20 h-20 mb-4" />
            <p className="font-black uppercase tracking-[0.3em] text-[10px]">Prêt pour encaisser</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-[2.5rem] flex items-center gap-4 shadow-sm animate-fade">
              <div className="flex-1">
                <p className="text-xs font-black uppercase">{item.name}</p>
                <p className="text-[10px] text-slate-400 font-bold">{(item.sellPrice * item.quantity).toLocaleString()} FG</p>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl">
                <button className="p-2 bg-white rounded-xl shadow-sm"><Minus className="w-3 h-3"/></button>
                <span className="text-xs font-black">{item.quantity}</span>
                <button className="p-2 bg-white rounded-xl shadow-sm"><Plus className="w-3 h-3"/></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Panneau Noir style photo */}
      <div className="bg-[#111827] p-8 rounded-[3rem] shadow-2xl space-y-6">
        <div className="flex justify-between items-center text-white/50 text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-4">
          <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4"/> {cart.length} ARTICLES</span>
          <span className="text-white text-sm">{total.toLocaleString()} FG</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
             <label className="text-[8px] font-black text-white/30 uppercase ml-1">Reçu Cash ?</label>
             <input type="number" placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-sm font-black outline-none" value={cash} onChange={e => setCash(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black text-white/30 uppercase ml-1">À Rendre :</label>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center justify-center">
              <p className="text-sm font-black text-yellow-400">{change.toLocaleString()} FG</p>
            </div>
          </div>
        </div>
        <button disabled={cart.length === 0} className="w-full bg-yellow-600/90 text-white py-6 rounded-3xl font-black uppercase text-xs flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-20 shadow-xl">
          CONFIRMER & FACTURER <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default POS;
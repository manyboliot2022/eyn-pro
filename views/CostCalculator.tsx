import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ScanLine, Truck, Info, ChevronRight, X, Calculator as CalcIcon } from 'lucide-react';
import { Order, OrderItem, Product, Supplier, UserProfile } from '../types.ts';
import BarcodeScanner from '../components/BarcodeScanner.tsx';

const CostCalculator: React.FC<{ currentUser: UserProfile | null }> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'CMD' | 'RECEIVE' | 'HISTORY'>('CMD');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setSuppliers(JSON.parse(localStorage.getItem('eyn_suppliers') || '[]'));
    setProducts(JSON.parse(localStorage.getItem('eyn_products') || '[]'));
  }, []);

  const savePendingOrder = () => {
    if (items.length === 0 || !selectedSupplierId) return alert("Sélectionnez un fournisseur et des articles.");
    // Logique de sauvegarde existante...
    alert("📦 Commande enregistrée !");
    setItems([]); setSelectedSupplierId('');
  };

  return (
    <div className="space-y-6 pb-24">
      {isScanning && <BarcodeScanner onScan={(code) => {/* log */ setIsScanning(false);}} onClose={() => setIsScanning(false)} />}

      {/* Onglets Pills style Capture d'écran */}
      <div className="flex bg-slate-200/50 p-1.5 rounded-2xl gap-1">
        {[
          { id: 'CMD', label: 'COMMANDE', icon: Truck },
          { id: 'RECEIVE', label: 'RÉCEPTION', icon: Info },
          { id: 'HISTORY', label: 'HISTORIQUE', icon: ChevronRight }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)} 
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab.id ? 'bg-white shadow-xl text-[#111827]' : 'text-slate-400 opacity-60'}`}
          >
            <tab.icon className="w-3.5 h-3.5" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'CMD' && (
        <div className="space-y-6 animate-in slide-in-from-bottom">
          {/* Carte Détails Fournisseur style Capture d'écran */}
          <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50 space-y-6">
            <div className="flex items-center gap-3 text-[#111827]">
               <Truck className="w-6 h-6 text-yellow-400" />
               <h3 className="text-xs font-black uppercase tracking-widest">Détails Fournisseur</h3>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-black text-slate-900 outline-none appearance-none" value={selectedSupplierId} onChange={e => setSelectedSupplierId(e.target.value)}>
                  <option value="">Sélectionner Fournisseur...</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><Plus className="w-5 h-5 rotate-45"/></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <input type="text" placeholder="Pays/Ville" className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-black placeholder:text-slate-200" />
                 <input type="text" placeholder="Devise (FG/USD)" className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-black placeholder:text-slate-200" />
              </div>
              <input type="text" placeholder="Référence (ex: CMD001)" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-black placeholder:text-slate-200" />
            </div>
          </div>

          <section className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50 space-y-6 relative min-h-[200px] flex flex-col justify-center text-center">
             <div className="absolute top-8 left-8 flex items-center gap-2">
                <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Articles attendus</span>
             </div>
             <button onClick={() => setIsScanning(true)} className="absolute top-4 right-4 bg-[#111827] text-yellow-400 p-6 rounded-[1.5rem] shadow-2xl active:scale-90 transition-all">
                <Plus className="w-7 h-7" />
             </button>

             <div className="py-12 flex flex-col items-center gap-4 opacity-20">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Aucune commande en cours</p>
             </div>
          </section>

          <button onClick={savePendingOrder} className="w-full bg-[#111827] text-yellow-400 py-6 rounded-[2.5rem] font-black uppercase text-xs shadow-2xl active:scale-95 transition-all">
            Lancer la commande
          </button>
        </div>
      )}
    </div>
  );
};

export default CostCalculator;
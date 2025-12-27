import React, { useState, useEffect, useRef } from 'react';
import { Search, Edit2, Trash2, X, ScanLine, Layers, Info, Ruler, Plus, Image as ImageIcon, Camera, ImagePlus, TrendingUp, ChevronRight, CheckCircle, Package } from 'lucide-react';
import { Product, UserProfile, Family } from '../types.ts';
import BarcodeScanner from '../components/BarcodeScanner.tsx';

const ProductManager: React.FC<{ currentUser: UserProfile | null }> = ({ currentUser }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const emptyProduct: Product = {
    id: '',
    name: '',
    category: 'Cosmétique',
    barcode: '',
    costPrice: 0,
    sellPrice: 0,
    stock: 0,
    description: '',
    volume: '',
    imageUrl: '',
    familyId: ''
  };

  const [formState, setFormState] = useState<Product>(emptyProduct);
  const [marginInput, setMarginInput] = useState<number>(0);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem('eyn_products') || '[]'));
    setFamilies(JSON.parse(localStorage.getItem('eyn_families') || '[]'));
  }, []);

  useEffect(() => {
    if (formState.costPrice > 0) {
      const calculated = Math.round(((formState.sellPrice - formState.costPrice) / formState.costPrice) * 100);
      setMarginInput(calculated);
    }
  }, [formState.costPrice, formState.sellPrice]);

  const handlePriceChange = (field: 'cost' | 'sell' | 'margin', value: number) => {
    setFormState(prev => {
      const newState = { ...prev };
      if (field === 'cost') newState.costPrice = value;
      else if (field === 'sell') newState.sellPrice = value;
      else if (field === 'margin') newState.sellPrice = Math.round(newState.costPrice * (1 + (value / 100)));
      return newState;
    });
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setFormState(p);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name) return;
    const newList = editingProduct 
      ? products.map(p => p.id === formState.id ? formState : p)
      : [{...formState, id: Math.random().toString(36).substr(2, 9)}, ...products];
    setProducts(newList);
    localStorage.setItem('eyn_products', JSON.stringify(newList));
    setIsCreating(false);
    setEditingProduct(null);
    setFormState(emptyProduct);
  };

  return (
    <div className="space-y-4 pb-24 relative min-h-[60vh]">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const r = new FileReader();
          r.onloadend = () => setFormState(prev => ({...prev, imageUrl: r.result as string}));
          r.readAsDataURL(file);
        }
      }} />
      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const r = new FileReader();
          r.onloadend = () => setFormState(prev => ({...prev, imageUrl: r.result as string}));
          r.readAsDataURL(file);
        }
      }} />
      
      {isScanning && (
        <BarcodeScanner 
          onScan={(code) => { setFormState(prev => ({...prev, barcode: code})); setIsScanning(false); }} 
          onClose={() => setIsScanning(false)} 
        />
      )}
      
      {(isCreating || editingProduct) && (
        <div className="fixed inset-0 z-[600] bg-slate-900/90 backdrop-blur-md flex items-end sm:items-center justify-center">
           <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[2.5rem] p-6 pt-8 space-y-5 animate-in slide-in-from-bottom duration-300 shadow-2xl overflow-y-auto max-h-[92vh] hide-scrollbar">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <h3 className="font-black text-[9px] uppercase tracking-[0.2em] text-slate-400">
                  {editingProduct ? "ÉDITER L'ARTICLE" : "VÉRIFICATION INVENTAIRE"}
                </h3>
                <button type="button" onClick={() => { setIsCreating(false); setEditingProduct(null); setFormState(emptyProduct); }} className="p-2 bg-slate-50 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <div className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Code Barres / Code Produit</label>
                  <div className="flex gap-2">
                    <input type="text" className="flex-1 bg-slate-50 p-4 rounded-2xl text-sm font-black border-2 border-transparent focus:border-slate-900 outline-none" value={formState.barcode} onChange={e => setFormState({...formState, barcode: e.target.value})} />
                    <button type="button" onClick={() => setIsScanning(true)} className="bg-slate-900 text-yellow-500 px-5 rounded-2xl shadow-lg active:scale-90 transition-transform"><ScanLine className="w-5 h-5"/></button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Désignation</label>
                  <input type="text" required className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-black border-2 border-transparent focus:border-slate-900 outline-none" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Famille</label>
                    <select className="w-full bg-slate-50 p-4 rounded-2xl text-[10px] font-black border-2 border-transparent outline-none appearance-none" value={formState.familyId} onChange={e => setFormState({...formState, familyId: e.target.value})}>
                      <option value="">Standard</option>
                      {families.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Stock Compté</label>
                    <input type="number" className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-black border-2 border-transparent outline-none" value={formState.stock} onChange={e => setFormState({...formState, stock: parseInt(e.target.value) || 0})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Visuel</label>
                  <div className="flex gap-4 h-24">
                    <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex-1 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 active:bg-slate-100 transition-colors">
                      <Camera className="w-6 h-6 text-slate-400" />
                      <span className="text-[8px] font-black uppercase text-slate-500">Photo</span>
                    </button>
                    {formState.imageUrl && (
                      <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-slate-900 shadow-xl relative animate-in zoom-in-50">
                        <img src={formState.imageUrl} className="w-full h-full object-cover" />
                        <button onClick={() => setFormState(prev => ({...prev, imageUrl: ''}))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X className="w-3 h-3"/></button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-[2.5rem] space-y-5 shadow-2xl">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest ml-1">P. Achat</label>
                        <input type="number" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm font-black text-white outline-none focus:border-yellow-500" value={formState.costPrice || ''} onChange={e => handlePriceChange('cost', parseFloat(e.target.value) || 0)} placeholder="0" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-white/30 tracking-widest ml-1">P. Vente</label>
                        <input type="number" className="w-full bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl text-sm font-black text-yellow-500 outline-none focus:border-yellow-500" value={formState.sellPrice || ''} onChange={e => handlePriceChange('sell', parseFloat(e.target.value) || 0)} placeholder="0" />
                      </div>
                   </div>
                   <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black uppercase text-white/50 tracking-widest flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400"/> Marge (%)</span>
                      <input type="number" className="w-16 bg-emerald-500/10 text-emerald-400 text-right p-2 rounded-xl font-black text-sm border-none outline-none" value={marginInput} onChange={e => handlePriceChange('margin', parseFloat(e.target.value) || 0)} />
                   </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-yellow-500 py-6 rounded-[2.2rem] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-[0.97] transition-all">
                {editingProduct ? "Sauvegarder les modifs" : "Valider l'Inventaire"}
              </button>
           </form>
        </div>
      )}

      {/* Barre de Recherche Épurée */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input type="text" placeholder="Recherche..." className="w-full bg-white rounded-3xl pl-12 pr-6 py-5 text-sm font-black shadow-sm border border-slate-100 outline-none focus:border-slate-300 transition-all" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2.5">
        {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search)).map(p => (
          <div key={p.id} className="bg-white p-4 rounded-[2.5rem] border border-slate-100 flex justify-between items-center shadow-sm active:bg-slate-50 transition-all cursor-pointer" onClick={() => startEdit(p)}>
            <div className="flex gap-4 flex-1 min-w-0 items-center">
              {p.imageUrl ? (
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-inner">
                  <img src={p.imageUrl} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200">
                  <ImageIcon className="w-6 h-6 opacity-30" />
                </div>
              )}
              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-[11px] font-black uppercase text-slate-800 truncate leading-none mb-1">{p.name}</h4>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{families.find(f => f.id === p.familyId)?.name || 'Standard'} • {p.volume || 'S/V'}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase ${p.stock <= 5 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'}`}>Stock: {p.stock}</span>
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase">{p.sellPrice.toLocaleString()} FG</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl text-slate-200"><ChevronRight className="w-5 h-5" /></div>
          </div>
        ))}
      </div>

      {/* FAB Bouton "Plus" Standard */}
      <button onClick={() => { setIsCreating(true); setEditingProduct(null); setFormState(emptyProduct); }} className="fixed bottom-24 right-6 w-16 h-16 bg-slate-900 text-yellow-500 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all z-50 border-4 border-white">
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
};

export default ProductManager;
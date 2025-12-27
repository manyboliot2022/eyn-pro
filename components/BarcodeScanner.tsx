import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Camera } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  title?: string;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose, title = "SCANNER UN PRODUIT" }) => {
  const [manualCode, setManualCode] = useState('');
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true'); // Important pour iOS
          await videoRef.current.play();
        }
      } catch (e) {
        console.error("Caméra non accessible", e);
        setHasError(true);
      }
    }
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black flex flex-col animate-fade">
      {/* Header du scanner */}
      <div className="p-6 flex justify-between items-center text-white z-20 safe-top">
        <button onClick={onClose} className="bg-white/10 p-3 rounded-full active:scale-90 transition-transform backdrop-blur-md">
          <X className="w-6 h-6"/>
        </button>
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">{title}</h2>
        <div className="w-12"></div>
      </div>

      {/* Zone de visée */}
      <div className="flex-1 relative flex items-center justify-center">
        {hasError ? (
          <div className="text-center p-10 space-y-4">
             <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-10 h-10 text-red-500" />
             </div>
             <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Caméra bloquée ou indisponible</p>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            muted
            playsInline 
            className="absolute inset-0 w-full h-full object-cover" 
          />
        )}
        
        {/* Cadre de scan style App Native */}
        <div className="relative w-72 h-48 border-2 border-yellow-400/50 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 border-[40px] border-black/20"></div>
          <div className="absolute w-full h-1 bg-yellow-400 top-0 left-0 shadow-[0_0_20px_#facc15] animate-[scanLine_2.5s_infinite_ease-in-out]"></div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 text-center">
           <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em] animate-pulse">Positionnez le code dans le cadre</p>
        </div>
      </div>

      {/* Entrée manuelle en bas */}
      <div className="p-8 bg-[#111827] rounded-t-[3.5rem] safe-bottom shadow-[0_-20px_60px_rgba(0,0,0,0.8)] border-t border-white/5">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input 
            autoFocus 
            type="text"
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white text-sm font-black placeholder:text-white/10 focus:ring-2 ring-yellow-400 transition-all outline-none" 
            placeholder="SAISIR CODE MANUEL..." 
            value={manualCode} 
            onChange={e => setManualCode(e.target.value)} 
          />
          <button type="submit" className="bg-yellow-400 text-[#111827] px-6 rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center">
            <ArrowRight className="w-6 h-6"/>
          </button>
        </form>
      </div>
      
      <style>{`
        @keyframes scanLine {
          0% { transform: translateY(0); }
          50% { transform: translateY(192px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default BarcodeScanner;
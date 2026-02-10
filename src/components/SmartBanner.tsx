'use client';
import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

export default function SmartBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Solo mostramos si no lo ha cerrado antes (usando localStorage)
    const closed = localStorage.getItem('smartBannerClosed');
    if (!closed) {
        setIsVisible(true);
    }
  }, []);

  const closeBanner = () => {
      setIsVisible(false);
      localStorage.setItem('smartBannerClosed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-3 z-50 md:hidden animate-in slide-in-from-bottom duration-500">
        <div className="flex items-center justify-between gap-3">
            <button onClick={closeBanner} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    {/* Aquí iría tu logo real */}
                    <span className="font-bold text-lg">O</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-sm leading-tight">Ofertitas Tucumán</span>
                    <span className="text-xs text-gray-300">Mejor experiencia en la App</span>
                </div>
            </div>

            <button 
                onClick={() => alert("Aquí iría el link al APK o PlayStore")}
                className="bg-blue-600 px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-blue-900/50 whitespace-nowrap"
            >
                INSTALAR
            </button>
        </div>
    </div>
  );
}
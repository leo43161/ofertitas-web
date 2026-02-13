import { MapPin, Loader2 } from 'lucide-react';

export default function LocationBar({ loading, hasLocation }: { loading: boolean; hasLocation: boolean }) {
  return (
    <div className={`border-b-2 py-2 px-5 flex items-center gap-2 text-[0.82rem] font-bold transition-colors ${hasLocation ? 'bg-blue-50 border-blue-100 text-blue-800' : 'bg-cream-dark border-red/15 text-text-mid'}`}>
      
      {loading ? (
        <>
           <Loader2 className="w-3.5 h-3.5 animate-spin" />
           <span>Localizando ofertas...</span>
        </>
      ) : hasLocation ? (
        <>
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Ofertas cerca de <span className="underline decoration-blue-300">tu ubicación</span></span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span>📍 Tucumán (Ubicación desactivada)</span>
        </>
      )}

      {hasLocation && (
        <span className="ml-auto text-blue-600 text-[0.7rem] uppercase tracking-wider hidden sm:block">
           Radio: 5km
        </span>
      )}
    </div>
  );
}
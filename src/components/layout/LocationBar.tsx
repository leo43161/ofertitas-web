export default function LocationBar() {
  return (
    <div className="bg-cream-dark border-b-2 border-red/15 py-2 px-5 flex items-center gap-2 text-[0.82rem] font-bold text-text-mid">
      <div className="w-2 h-2 bg-red rounded-full animate-pulse-dot"></div>
      <span>📍 Tucumán, ARG</span>
      <span className="hidden sm:inline">· Mostrando <span className="text-red">ofertas activas</span> cerca tuyo</span>
      
      <span className="ml-auto text-orange-light font-extrabold flex items-center gap-1">
        ⚡ 5 Flashes activos
      </span>
    </div>
  );
}
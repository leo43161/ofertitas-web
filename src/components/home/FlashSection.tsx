'use client';
import { Offer } from '@/types';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import CountDown from '@/components/ui/CountDown';

export default function FlashSection({ offers }: { offers?: Offer[] }) {
  console.log("Ofertas recibidas en FlashSection:", offers);
  const flashOffers = offers?.filter(o => o.promo_type === 'flash') || [];
  if (flashOffers.length === 0) return null;

  return (
    <div className="my-5 mx-3 rounded-[20px] p-0.5 bg-linear-to-br from-red-600 via-[#3d1008] to-black animate-gradient shadow-hard-xl">
      
      {/* Contenedor Interior Negro */}
      <div className="bg-[#1a0505] rounded-[18px] p-4">
        
        {/* Header con Rayo Animado */}
        <div className="flex justify-between items-center mb-3">
          <div className="font-bangers text-flash text-2xl tracking-wide flex items-center gap-1 drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
             <Zap className="w-5 h-5 fill-flash animate-pulse-fast" /> 
             FLASH SALE
          </div>
          {/* Link sutil */}
          <Link href="/ofertas?type=flash" className="text-white/40 text-[0.65rem] font-bold uppercase tracking-wider hover:text-white transition-colors">
            Ver Todo
          </Link>
        </div>

        {/* Carrusel Horizontal */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {flashOffers.map(offer => (
            <Link 
              key={offer.id} 
              href={`/oferta/${offer.id}`} 
              className="snap-start flex-none w-[135px] group cursor-pointer relative"
            >
              
              {/* 1. Imagen + Overlay Oscuro */}
              <div className="h-[100px] w-full rounded-t-xl overflow-hidden relative border-2 border-b-0 border-white/10 bg-gray-900">
                <img 
                  src={`${process.env.URL_SERVER}${offer.image_url}`} 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500" 
                  alt={offer.title} 
                />
                
                {/* Timer Badge Flotante (Rojo Urgencia) */}
                {offer.end_date && (
                   <div className="absolute bottom-1 left-1 bg-red text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded shadow-md flex items-center gap-1 animate-pulse-fast border border-white/20">
                      ⚡ <CountDown targetDate={offer.end_date} />
                   </div>
                )}
              </div>

              {/* 2. Info Compacta (Fondo Oscuro) */}
              <div className="bg-white/5 backdrop-blur-sm border-2 border-t-0 border-white/10 rounded-b-xl p-2.5 transition-colors group-hover:bg-white/10">
                
                {/* Título Truncado */}
                <div className="text-gray-200 text-[0.7rem] font-bold leading-tight truncate mb-1">
                  {offer.title}
                </div>

                {/* Precio Gigante (Amarillo Flash) */}
                <div className="flex items-end justify-between">
                    <div className="font-bangers text-flash text-xl leading-none tracking-wide drop-shadow-md">
                        ${Number(offer.price_offer).toLocaleString()}
                    </div>
                    {/* Flecha Mini */}
                    <div className="text-white/20 text-[0.6rem] group-hover:text-white group-hover:translate-x-1 transition-all">
                        ➜
                    </div>
                </div>

                {/* Empresa (Muy sutil) */}
                <div className="text-white/30 text-[0.6rem] truncate mt-1">
                    {offer.company_name}
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
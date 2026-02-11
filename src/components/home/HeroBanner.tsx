'use client';
import { Offer } from '@/types';
import Link from 'next/link';
import { Phone, MapPin } from 'lucide-react';

export default function HeroBanner({ offers }: { offers?: Offer[] }) {
  // Buscar la mejor oferta para el Hero
  const heroOffer = offers?.find(o => o.is_featured === 1) || offers?.[0];

  if (!heroOffer) return null;

  const mapLink = heroOffer.latitude && heroOffer.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${heroOffer.latitude},${heroOffer.longitude}`
    : '#';

  const whatsappLink = heroOffer.phone 
    ? `https://wa.me/${heroOffer.phone}?text=Hola, vi la oferta ${heroOffer.title} en Ofertitas`
    : '#';

  return (
    <div className="px-4 py-4">
      <div className="relative rounded-2xl overflow-hidden min-h-[220px] flex items-center shadow-hard-xl border-[3px] border-white/10 bg-linear-to-br from-[#1a0a06] via-[#3d1008] to-[#C0392B]">
        
        {/* Contenido Texto */}
        <div className="relative z-10 p-7 flex-1">
          <div className="inline-block font-bangers text-sm tracking-[2px] px-3 py-1 rounded-[20px] mb-2 shadow-sm bg-red text-white animate-flash-ring">
             {heroOffer.promo_type === 'flash' ? '⚡ FLASH' : '🔥 DESTACADO'}
          </div>
          
          <h2 className="font-bangers text-[2.5rem] text-white leading-none tracking-[1px] drop-shadow-md mb-1">
            {heroOffer.title}
          </h2>
          
          <div className="text-white/65 text-sm font-semibold mb-3.5 flex items-center gap-1">
             <MapPin size={14} /> {heroOffer.company_name}
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <div className="font-bangers text-[2.6rem] text-[#FFE082] drop-shadow-md leading-none">
              ${Number(heroOffer.price_offer).toLocaleString()}
            </div>
            {Number(heroOffer.price_normal) > Number(heroOffer.price_offer) && (
                 <div className="text-base text-white/45 line-through decoration-white/45">
                    ${Number(heroOffer.price_normal).toLocaleString()}
                 </div>
            )}
          </div>

          <a href={whatsappLink} target="_blank" className="relative overflow-hidden inline-flex items-center gap-2 bg-[#25D366] text-white border-none rounded-full py-2.5 px-5 font-nunito font-extrabold text-sm shadow-hard transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-xl group">
             <div className="absolute top-[-50%] left-[-60%] w-[30%] h-[200%] bg-white/30 skew-x-[-20deg] animate-shimmer"></div>
             <Phone size={16} fill="white" /> Pedir por WhatsApp
          </a>
        </div>

        {/* Imagen Hero (Corte diagonal o flotante) */}
        <div className="hidden sm:flex relative w-60 h-full items-center justify-center shrink-0 pr-4">
            <img 
                src={`${process.env.URL_SERVER}${heroOffer.image_url}`} 
                className="rounded-xl rotate-3 border-4 border-white/20 shadow-2xl max-h-[180px] object-cover" 
                alt={heroOffer.title} 
            />
             <div className="absolute top-4 right-4 bg-black/50 border border-white/20 rounded-lg p-2 backdrop-blur-sm flex flex-col items-center">
                <span className="text-white/60 text-[0.6rem] font-bold uppercase tracking-wider">Vence en</span>
                <span className="font-bangers text-xl text-[#FFE082] tracking-wide leading-none">23:14:07</span>
             </div>
        </div>
      </div>
    </div>
  );
}
/* 'use client';

import Link from 'next/link';
import { Offer } from '@/types';
import { Calendar, Clock, MapPin, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

// Pequeño componente local de Timer
const Countdown = ({ date }: { date: string }) => {
    const [left, setLeft] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(date).getTime();
            const diff = end - now;

            if (diff < 0) {
                setLeft("Finalizó");
                return;
            }

            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            setLeft(`${h}h ${m}m ${s}s`);
        }, 1000);
        return () => clearInterval(interval);
    }, [date]);

    return <span className="font-mono font-bold text-yellow-400">{left}</span>;
}

export default function HeroBanner({ offers }: { offers?: Offer[] }) {
    const heroOffer =
        offers?.find(o => o.promo_type === 'flash') ||
        offers?.find(o => o.promo_type === 'day') ||
        offers?.find(o => o.promo_type === 'week') ||
        offers?.find(o => o.is_featured === 1);

    if (!heroOffer) return null;

    // Renderizador de Badge Grande
    const renderBadge = () => {
        switch (heroOffer.promo_type) {
            case 'flash':
                return <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse"><Zap className="w-3 h-3 fill-white" /> FLASH</span>;
            case 'day':
                return <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> SOLO POR HOY</span>;
            case 'week':
                return <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><Calendar className="w-3 h-3" /> DE LA SEMANA</span>;
            default: return null;
        }
    };
    const mapQuery = (heroOffer.latitude && heroOffer.longitude)
        ? `${heroOffer.latitude},${heroOffer.longitude}`
        : encodeURIComponent(heroOffer.location_address || 'Tucumán');
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
    
    return (
        <section className="max-w-7xl mx-auto px-4 pt-2">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl group cursor-pointer h-70 md:h-96">
                
                <Link href={`/oferta/${heroOffer.id}`} className="absolute inset-0 z-0" aria-label={`Ver oferta ${heroOffer.title}`} />

               
                <div className="absolute inset-0 pointer-events-none">
                    <img
                        src={`http://10.20.20.5/ofertitas_api2/public${heroOffer.image_url}`}
                        alt={heroOffer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white pointer-events-none">
                    <div className="flex items-center gap-2 mb-2">
                        {renderBadge()}
                        <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                            {heroOffer.company_name}
                        </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-white">
                        <MapPin className="w-3 h-3" /> {heroOffer.location_address}
                    </span>

                    <h2 className="text-2xl md:text-4xl font-extrabold leading-tight mb-2 md:max-w-2xl">
                        {heroOffer.title}
                    </h2>

                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            <span className="text-gray-300 text-sm mb-1">{heroOffer.discount_text}</span>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-yellow-400">${Number(heroOffer.price_offer).toLocaleString()}</span>
                                {heroOffer.price_normal && (
                                    <span className="text-lg text-gray-400 line-through decoration-red-500">
                                        ${Number(heroOffer.price_normal).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {heroOffer.end_date && (
                            <div className="hidden md:flex flex-col items-end bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
                                <span className="text-xs text-gray-300 uppercase flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Termina en
                                </span>
                                <Countdown date={heroOffer.end_date} />
                            </div>
                        )}

                        <a
                            href={mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="md:hidden bg-blue-600 p-3 rounded-full shadow-lg shadow-blue-900/50 transform hover:scale-105 transition-transform pointer-events-auto relative z-10">
                            <MapPin className="w-6 h-6" />
                        </a>
                    </div>
                </div>
                
                {heroOffer.end_date && (
                    <div className="flex md:hidden gap-2 bg-zinc-200/60 backdrop-blur-md items-center rounded-xl border-zinc-300/70 border-2 absolute top-3 right-3 px-1.5 py-0.5 pointer-events-none">
                        <span className="text-xs uppercase flex items-center gap-1">
                            <Clock className="w-4 h-4" /> Termina en
                        </span>
                        <Countdown date={heroOffer.end_date} />
                    </div>
                )}
            </div>
        </section>
    );
} */
'use client';

import { useGetCategoriesQuery, useGetAllOffersQuery } from '@/store/api/apiSlice';
import Link from 'next/link';
import { ShoppingBag, Zap, Clock, Calendar } from 'lucide-react';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';

// Importamos los nuevos componentes con estilo HTML Demo
import Navbar from '@/components/layout/Navbar';
import LocationBar from '@/components/layout/LocationBar';
import StoriesRail from '@/components/home/StoriesRail';
import FlashSection from '@/components/home/FlashSection';
import HeroBanner from '@/components/home/HeroBanner';
/* import MobileNav from '@/components/layout/MobileNav'; */ // Asumo que crearás este archivo similar al footer del HTML

export default function Home() {
  const { data: categories } = useGetCategoriesQuery();
  const { data: offers, isLoading } = useGetAllOffersQuery();

  return (
    <div className="min-h-screen bg-cream pb-24">
      
      {/* 1. Navbar Estilo Demo */}
      <Navbar />
      <LocationBar />

      <div className="max-w-[1100px] mx-auto px-0 sm:px-4">
        
        {/* 2. Stories */}
        <StoriesRail />

        {/* 3. Flash Section (Horizontal Scroll Dark) */}
        <FlashSection offers={offers} />

        {/* 4. Hero Banner */}
        {!isLoading && <HeroBanner offers={offers} />}

        {/* 5. Categorías */}
        <div className="py-4">
           <div className="px-4 mb-3 flex items-center justify-between">
              <div className="font-bangers text-[1.6rem] text-red-dark tracking-wide flex items-center gap-2">
                 🏷️ Categorías
              </div>
           </div>
           
           <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 px-4">
              {categories?.map(cat => (
                <Link href={`/categoria/${cat.id}`} key={cat.id} className="bg-white rounded-[14px] py-3.5 px-2 flex flex-col items-center gap-2 shadow-hard border-2 border-transparent transition-all hover:border-red hover:-translate-y-1 hover:shadow-hard-xl cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-text-mid">
                        <DynamicIcon name={cat.icon_name as IconName || 'Circle'} className="w-5 h-5" />
                    </div>
                    <div className="text-[0.68rem] font-extrabold text-text-mid uppercase text-center leading-tight tracking-wide">
                        {cat.name}
                    </div>
                </Link>
              ))}
           </div>
        </div>

        {/* 6. Grid de Ofertas (Offer Cards Estilo Demo) */}
        <div className="py-4">
            <div className="px-4 mb-3 flex items-center justify-between">
              <div className="font-bangers text-[1.6rem] text-red-dark tracking-wide flex items-center gap-2">
                 🔥 Destacados Hoy
              </div>
              <div className="text-[0.78rem] font-bold text-red border-2 border-red rounded-xl px-3 py-1 uppercase tracking-wide cursor-pointer hover:bg-red hover:text-white transition-colors">
                  Ver todas
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
              {offers?.map((offer) => (
                 <Link href={`/oferta/${offer.id}`} key={offer.id} className="bg-white rounded-[14px] overflow-hidden shadow-hard border-2 border-transparent transition-all hover:-translate-y-1 hover:shadow-hard-xl hover:border-red/20 group">
                    <div className="relative h-[155px] bg-cream-dark overflow-hidden">
                        <img 
                           src={ `${process.env.URL_SERVER}${offer.image_url}`} 
                           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                           alt={offer.title} 
                        />
                        
                        {/* Badges Flotantes */}
                        {offer.promo_type === 'flash' && (
                             <div className="absolute top-2.5 left-2.5 font-bangers text-xs bg-red text-white px-2.5 py-1 rounded-[20px] shadow-sm animate-pulse">
                                ⚡ FLASH
                             </div>
                        )}
                        
                        <div className={`absolute bottom-2.5 right-2.5 font-bangers text-[1.3rem] px-3 py-1 rounded-lg shadow-sm leading-none ${offer.promo_type === 'flash' ? 'bg-red text-white' : 'bg-white text-text-dark'}`}>
                            ${offer.price_offer}
                        </div>
                    </div>
                    
                    <div className="p-3 pb-3.5">
                        <div className="font-extrabold text-[0.88rem] text-text-dark leading-[1.3] mb-1 line-clamp-2 h-[2.6em]">
                            {offer.title}
                        </div>
                        <div className="text-[0.73rem] text-[#888] mb-2.5 truncate">
                            📍 {offer.company_name}
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1.5">
                                <span className="font-bangers text-xl text-red leading-none">
                                   ${offer.price_offer}
                                </span>
                                {Number(offer.price_normal) > Number(offer.price_offer) && (
                                    <span className="text-[0.76rem] text-[#aaa] line-through decoration-red/50">
                                       ${offer.price_normal}
                                    </span>
                                )}
                            </div>
                            <button className="w-8 h-8 rounded-full border-2 border-black/10 flex items-center justify-center hover:bg-red/10 hover:border-red hover:text-red transition-colors">
                               🤍
                            </button>
                        </div>
                    </div>
                 </Link>
              ))}
           </div>
        </div>

      </div>

      {/* Mobile Nav Fixed */}
      {/* <MobileNav /> */}
      
    </div>
  );
}
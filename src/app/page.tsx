'use client';

import { useGetCategoriesQuery, useGetAllOffersQuery } from '@/store/api/apiSlice';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';

// Importamos los nuevos componentes con estilo HTML Demo
import Navbar from '@/components/layout/Navbar';
import LocationBar from '@/components/layout/LocationBar';
import StoriesRail from '@/components/home/StoriesRail';
import FlashSection from '@/components/home/FlashSection';
import HeroBanner from '@/components/home/HeroBanner';
import { setLocation, setLocationError } from '@/store/locationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '@/store/store';
/* import MobileNav from '@/components/layout/MobileNav'; */ // Asumo que crearás este archivo similar al footer del HTML

export default function Home() {
   const dispatch = useDispatch();

   // 1. Obtener estado de ubicación de Redux
   const { lat, lng, loading: locLoading } = useSelector((state: RootState) => state.location);
   useEffect(() => {
      if ('geolocation' in navigator) {
         navigator.geolocation.getCurrentPosition(
            (position) => {
               dispatch(setLocation({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
               }));
            },
            (error) => {
               console.warn("Ubicación denegada:", error);
               dispatch(setLocationError("Permiso denegado"));
               // Opcional: Establecer coordenadas por defecto (Centro Tucumán)
               // dispatch(setLocation({ lat: -26.830, lng: -65.203 })); 
            }
         );
      }
   }, [dispatch]);
   const { data: offers, isLoading } = useGetAllOffersQuery(
      lat && lng ? { lat, lng } : undefined
   );
   const { data: categories } = useGetCategoriesQuery();

   return (
      <div className="min-h-screen bg-cream pb-24">
         <Navbar />

         {/* Pasamos el estado de carga a la barra */}
         <LocationBar loading={locLoading} hasLocation={!!lat} />

         <div className="max-w-[1100px] mx-auto px-0 sm:px-4">
            <StoriesRail />
            <FlashSection offers={offers} />

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
            {/* 6. GRID DE OFERTAS MEJORADO (MAQUILLAJE) */}
            <div className="py-4">
               <div className="px-4 mb-3 flex items-center justify-between">
                  <div className="font-bangers text-[1.6rem] text-red-dark tracking-wide flex items-center gap-2">
                     🔥 {lat ? 'Cerca de ti' : 'Destacados Hoy'}
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
                  {offers?.map((offer) => (
                     <Link href={`/oferta/${offer.id}`} key={offer.id} className="bg-white rounded-[14px] overflow-hidden shadow-hard border-2 border-transparent transition-all hover:-translate-y-1 hover:shadow-hard-xl hover:border-red/20 group flex flex-col h-full">

                        <div className="relative h-[155px] bg-cream-dark overflow-hidden shrink-0">
                           <img
                              src={`${process.env.URL_SERVER}${offer.image_url}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              alt={offer.title}
                              loading="lazy"
                           />

                           {/* Badge de Distancia (NUEVO) */}
                           {offer.distance_text && (
                              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                 <MapPin className="w-3 h-3 text-yellow-400" />
                                 {offer.distance_text}
                              </div>
                           )}

                           {/* Precio */}
                           <div className={`absolute bottom-2.5 left-2.5 font-bangers text-[1.3rem] px-3 py-1 rounded-lg shadow-sm leading-none ${offer.promo_type === 'flash' ? 'bg-red text-white' : 'bg-white text-text-dark'}`}>
                              ${Number(offer.price_offer).toLocaleString()}
                           </div>
                        </div>

                        <div className="p-3 pb-3.5 flex flex-col flex-1">
                           <div className="font-extrabold text-[0.88rem] text-text-dark leading-[1.3] mb-1 line-clamp-2">
                              {offer.title}
                           </div>

                           <div className="text-[0.73rem] text-[#888] mb-auto truncate">
                              📍 {offer.company_name}
                           </div>

                           {/* Tiempo Restante (NUEVO) */}
                           {offer.time_remaining_text && (
                              <div className={`mt-2 text-[0.7rem] font-bold flex items-center gap-1 ${offer.is_ending_soon ? 'text-red animate-pulse' : 'text-blue-600'}`}>
                                 <Clock className="w-3 h-3" />
                                 {offer.time_remaining_text}
                              </div>
                           )}
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
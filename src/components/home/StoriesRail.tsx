'use client';
import { useGetRecentActivityQuery } from '@/store/api/apiSlice';
import Link from 'next/link';
import { Zap, Plus } from 'lucide-react';
import BusinessModal from '@/components/modals/BusinessModal';
import { useState } from 'react';

export default function StoriesRail() {
  const { data: activities, isLoading } = useGetRecentActivityQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Skeleton Loading (Se muestra mientras carga)
  if (isLoading) return <StoriesSkeleton />;


  return (
    <>
      <BusinessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="pt-4 pb-2 bg-transparent">
        {/* Scroll Container */}
        <div className="flex gap-4 overflow-x-auto px-5 scrollbar-hide snap-x snap-mandatory py-2">

          {/* Tu Historia (Opcional - Upselling para comercios) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer snap-start"
          >
            {/* Contenedor Avatar */}
            <div className="relative w-[76px] h-[76px] flex items-center justify-center">
              {/* Anillo Dashed Animado */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-300 group-hover:border-red group-hover:rotate-12 transition-all duration-500"></div>

              {/* Círculo Interior */}
              <div className="w-[68px] h-[68px] rounded-full bg-gray-50 flex items-center justify-center shadow-inner group-active:scale-95 transition-transform">
                <Plus className="w-8 h-8 text-gray-400 group-hover:text-red transition-colors" />
              </div>

              {/* Badge "Nuevo" */}
              <div className="absolute bottom-0 right-0 translate-x-1 translate-y-1">
                <div className="bg-blue-600 text-white p-1 rounded-full border-2 border-cream shadow-sm">
                  <Plus className="w-3 h-3" strokeWidth={4} />
                </div>
              </div>
            </div>

            {/* Label */}
            <div className="text-[0.7rem] font-bold text-gray-400 text-center max-w-[74px] leading-tight group-hover:text-red transition-colors">
              Tu Negocio
            </div>
          </button>

          {activities?.map((item) => {
            // Normalización de datos (a veces viene como string "1" o bool true)
            // @ts-ignore
            const isFlash = item.has_flash_offer === "1" || item.has_flash_offer === true || item.has_flash_offer === 1;

            return (
              <Link
                key={item.company_id}
                href={`/stories/${item.company_id}`}
                className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer snap-start"
              >

                {/* Contenedor del Avatar */}
                <div className="relative w-[76px] h-[76px] flex items-center justify-center">

                  {/* 1. Anillo Animado de Fondo (Solo Flash) */}
                  {isFlash && (
                    <div className="absolute inset-0 rounded-full bg-flash animate-ripple blur-sm opacity-50 z-0"></div>
                  )}

                  {/* 2. Borde del Anillo (Gradiente) */}
                  <div className={`absolute inset-0 rounded-full p-[3px] z-10 
                    ${isFlash
                      ? 'bg-linear-to-tr from-flash via-orange to-red animate-spin-slow'
                      : 'bg-linear-to-tr from-gray-300 to-red-300'
                    }`}>
                  </div>

                  {/* 3. Imagen (Avatar) */}
                  <div className="relative z-20 w-[68px] h-[68px] rounded-full border-[3px] border-cream bg-white overflow-hidden transition-transform duration-200 group-active:scale-90 group-hover:scale-105">
                    <img
                      src={item.company_logo ? `${process.env.URL_SERVER}${item.company_logo}` : `https://ui-avatars.com/api/?name=${item.company_name}&background=random`}
                      alt={item.company_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 4. Badge Flash (Icono Flotante) */}
                  {isFlash && (
                    <div className="absolute bottom-0 right-0 z-30 translate-x-1 translate-y-1">
                      <div className="bg-red text-white p-1 rounded-full border-2 border-cream shadow-sm flex items-center justify-center animate-bounce">
                        <Zap className="w-3 h-3 fill-flash text-flash" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Nombre de la Empresa */}
                <div className="text-[0.7rem] font-bold text-text-dark text-center max-w-[74px] truncate leading-tight transition-colors group-hover:text-red">
                  {item.company_name}
                </div>

              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

// Subcomponente Skeleton para mejorar la UX de carga
function StoriesSkeleton() {
  return (
    <div className="pt-4 pb-2 flex gap-4 overflow-hidden px-5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col items-center gap-2 shrink-0">
          <div className="w-[76px] h-[76px] rounded-full bg-gray-200 animate-pulse border-4 border-white"></div>
          <div className="w-12 h-2 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}
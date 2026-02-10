'use client';
import { useGetRecentActivityQuery } from '@/store/api/apiSlice';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function StoriesRail() {
  const { data: activities } = useGetRecentActivityQuery();

  return (
    <div className="pt-6 bg-transparent">
      <div className="px-4 mb-3 flex items-center gap-2 text-text-mid font-fredoka text-base">
         📖 Historias de hoy
         <div className="flex-1 h-0.5 bg-linear-to-r from-red/20 to-transparent rounded-sm"></div>
      </div>
      
      <div className="flex gap-3.5 overflow-x-auto px-5 scrollbar-hide">
        {activities?.map((item, i) => {
          // @ts-ignore
          const isFlash = item.has_flash_offer === 1 || item.has_flash_offer === true;

          return (
            <Link key={item.company_id} href={`/stories/${item.company_id}`} className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer">
              {/* Anillo de la historia */}
              <div className={`w-16 h-16 rounded-full p-[3px] shadow-hard transition-transform group-hover:scale-110 group-hover:shadow-hard-xl ${isFlash ? 'bg-linear-to-br from-orange-light via-red-light to-red animate-flash-ring' : 'bg-linear-to-br from-red-light to-orange-light'}`}>
                <div className="w-full h-full rounded-full bg-cream-dark border-[2.5px] border-cream flex items-center justify-center overflow-hidden">
                   <img 
                      src={item.company_logo ? `http://10.20.20.5/ofertitas_api2/public${item.company_logo}` : 'https://placehold.co/100x100/orange/white?text=' + item.company_name.substring(0,2)} 
                      alt={item.company_name}
                      className="w-full h-full object-cover"
                   />
                </div>
              </div>
              
              <div className="text-[0.7rem] font-bold text-text-mid text-center max-w-[68px] truncate">
                {item.company_name}
              </div>
              
              {isFlash && (
                <div className="text-[0.55rem] font-bangers bg-red text-white px-1.5 py-px rounded-lg -mt-1 tracking-wide">
                  ⚡ FLASH
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
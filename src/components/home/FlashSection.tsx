'use client';
import { Offer } from '@/types';
import Link from 'next/link';

export default function FlashSection({ offers }: { offers?: Offer[] }) {
  const flashOffers = offers?.filter(o => o.promo_type === 'flash') || [];
  if (flashOffers.length === 0) return null;

  return (
    <div className="my-4 mx-4 bg-linear-to-br from-[#1a0a06] to-[#3d1008] rounded-2xl p-5 shadow-hard-xl border border-white/10">
      <div className="flex justify-between items-center mb-3.5">
        <div className="font-bangers text-[#FFE082] text-2xl tracking-wide">⚡ OFERTAS FLASH</div>
        <div className="font-bangers text-red-light text-lg bg-white/10 px-3 py-1 rounded-lg tracking-widest">
           01:47:23
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {flashOffers.map(offer => (
          <Link key={offer.id} href={`/oferta/${offer.id}`} className="flex-none w-[150px] bg-white/10 rounded-xl overflow-hidden border border-white/10 transition-transform hover:-translate-y-1 hover:bg-white/15">
             <div className="h-[90px] bg-black/20 flex items-center justify-center overflow-hidden">
                <img src={`http://10.20.20.5/ofertitas_api2/public${offer.image_url}`} className="w-full h-full object-cover" alt={offer.title} />
             </div>
             <div className="p-2.5">
                <div className="text-white text-xs font-bold truncate mb-1">{offer.title}</div>
                <div className="font-bangers text-[#FFE082] text-lg leading-none">${Number(offer.price_offer).toLocaleString()}</div>
                <div className="text-white/45 text-[0.68rem] truncate">{offer.company_name}</div>
             </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
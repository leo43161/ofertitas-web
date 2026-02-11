// src/components/CompanyStoryFeed.tsx
'use client';

import { useEffect, useState } from 'react';
import { Offer } from '@/types'; // Tu archivo types importado
import { Zap, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function CompanyStoryFeed({ companyId }: { companyId: string }) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Asumiendo que configuraste la ruta en tu API
        fetch(`${process.env.URL_SERVER}/offers/${companyId}/feed`)
            .then(res => res.json())
            .then(data => {
                setOffers(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [companyId]);

    if (loading) return <div className="text-white text-center p-10">Cargando historias...</div>;

    if (offers.length === 0) return <div className="text-white text-center p-10">No hay ofertas activas.</div>;

    return (
        <div className="flex flex-col gap-4 pb-20">
            {offers.map((offer) => (
                <div key={offer.id} className="relative w-full bg-white rounded-2xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Badge de Tipo de Oferta */}
                    <div className="absolute top-3 left-3 z-10">
                        {renderBadge(offer.promo_type)}
                    </div>

                    <div className="h-64 relative">
                         {/* Usa tu componente de Imagen optimizado aquí si tienes */}
                        <img 
                            src={`${process.env.URL_SERVER}${offer.image_url}`} 
                            alt={offer.title} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                    </div>

                    <div className="p-5 absolute bottom-0 w-full text-white">
                        <h3 className="text-xl font-bold mb-1">{offer.title}</h3>
                        <p className="text-sm text-gray-200 line-clamp-2 mb-3">{offer.description}</p>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-yellow-400 font-bold">{offer.discount_text}</span>
                                <span className="text-2xl font-bold">${Number(offer.price_offer).toLocaleString()}</span>
                            </div>
                            <Link 
                                href={`/oferta/${offer.id}`}
                                className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition"
                            >
                                Ver
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

const renderBadge = (type: string) => {
    switch (type) {
        case 'flash':
            return <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><Zap className="w-3 h-3" /> FLASH</span>;
        case 'day':
            return <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> HOY</span>;
        case 'week':
            return <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><Calendar className="w-3 h-3" /> SEMANA</span>;
        default: return null;
    }
};
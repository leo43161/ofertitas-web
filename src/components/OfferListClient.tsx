'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

// Tipos...

export default function OfferListClient({ initialOffers }: { initialOffers: any[] }) {
    const [search, setSearch] = useState('');
    
    const filtered = initialOffers.filter(o => 
        o.title.toLowerCase().includes(search.toLowerCase()) || 
        o.company_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Search Bar */}
            <div className="p-4 bg-white sticky top-16 z-10">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Buscar sushi, helado..."
                        className="w-full bg-slate-100 py-3 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Lista Filtrada */}
            <div className="grid grid-cols-2 gap-3 p-4">
                {filtered.map(offer => (
                    <Link href={`/oferta/${offer.id}`} key={offer.id}>
                        {/* ... TU TARJETA ... */}
                        <div className="bg-white rounded-xl shadow border p-2">
                             <img src={`${ process.env.URL_SERVER}${offer.image_url}`} className="w-full h-32 object-cover rounded" />
                             <p className="font-bold mt-2 truncate">{offer.title}</p>
                             <p className="text-blue-600 font-bold">${offer.price_offer}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft, MapPin, Clock, Calendar, Share2, Zap, Phone, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Offer } from '@/types';

// --- HELPER: BADGE VISUAL (Estilo Pop) ---
const PromoBadge = ({ type }: { type: string }) => {
    switch (type) {
        case 'flash':
            return (
                <div className="absolute top-4 right-4 bg-red text-white px-4 py-1 rounded-xl font-bangers tracking-wider text-lg shadow-hard border-2 border-white/20 z-10 animate-pulse flex items-center gap-1">
                    <Zap className="w-4 h-4 fill-white" /> FLASH
                </div>
            );
        case 'day':
            return (
                <div className="absolute top-4 right-4 bg-orange text-white px-4 py-1 rounded-xl font-bangers tracking-wider text-lg shadow-hard border-2 border-white/20 z-10 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> SOLO POR HOY
                </div>
            );
        case 'week':
            return (
                <div className="absolute top-4 right-4 bg-[#8E44AD] text-white px-4 py-1 rounded-xl font-bangers tracking-wider text-lg shadow-hard border-2 border-white/20 z-10 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> SEMANAL
                </div>
            );
        default:
            return null;
    }
};

// 1. GENERAR RUTAS ESTÁTICAS
export async function generateStaticParams() {
    try {
        const res = await fetch(`${process.env.URL_SERVER}/offers`);
        const offers: Offer[] = await res.json();
        return offers.map((offer) => ({
            id: String(offer.id),
        }));
    } catch (error) {
        console.error("Error fetching offers for build:", error);
        return [];
    }
}

// 2. FETCH DE DATOS
async function getOffer(id: string): Promise<Offer | null> {
    try {
        const res = await fetch(`${process.env.URL_SERVER}/offers/${id}`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

type Props = {
    params: Promise<{ id: string }>
}

// 3. METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const offer = await getOffer(id);
    if (!offer) return { title: 'Oferta no encontrada' };

    return {
        title: `${offer.title} | ${offer.discount_text}`,
        description: `Consigue ${offer.title} en ${offer.company_name} por $${offer.price_offer}.`,
        openGraph: {
            images: [`${process.env.URL_SERVER}${offer.image_url}`]
        }
    };
}

// 4. COMPONENTE DE PÁGINA
export default async function OfferPage({ params }: Props) {
    const { id } = await params;
    const offer = await getOffer(id);

    if (!offer) {
        notFound();
    }

    const isExpired = offer.end_date ? new Date(offer.end_date) < new Date() : false;

    // Link de WhatsApp
    const waMessage = `Hola ${offer.company_name}, vi la promo "${offer.title}" en Ofertitas y quiero pedirla.`;
    const waLink = `https://wa.me/${offer.phone}?text=${encodeURIComponent(waMessage)}`;

    const mapQuery = (offer.latitude && offer.longitude)
        ? `${offer.latitude},${offer.longitude}`
        : encodeURIComponent(offer.location_address || 'Tucumán');
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

    return (
        <div className="min-h-screen bg-cream md:py-10 flex justify-center font-nunito">

            {/* Navbar Flotante (Solo Móvil) - Estilo Botón Redondo */}
            <div className="md:hidden absolute top-4 left-4 z-30">
                <Link href="/" className="bg-white text-text-dark w-10 h-10 flex items-center justify-center rounded-full shadow-hard border-2 border-transparent active:scale-95 transition-all">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </div>

            <main className="w-full max-w-5xl bg-cream md:rounded-3xl md:shadow-hard-xl md:border-4 md:border-white/50 overflow-hidden md:flex min-h-screen md:min-h-[600px]">

                {/* --- COLUMNA IZQUIERDA: IMAGEN --- */}
                <div className="relative w-full md:w-1/2 h-80 md:h-auto bg-cream-dark border-r-0 md:border-r-4 border-white/50">
                    <img
                        src={`${process.env.URL_SERVER}${offer.image_url}`}
                        alt={offer.title}
                        className={`w-full h-full object-cover transition-all ${isExpired ? 'grayscale contrast-125' : ''}`}
                    />

                    {/* Overlay Gradiente para móvil */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent md:hidden" />

                    {/* Badges */}
                    {isExpired ? (
                        <div className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-1 rounded-xl font-bangers tracking-wider text-lg shadow-hard z-10">
                            AGOTADA
                        </div>
                    ) : (
                        <PromoBadge type={offer.promo_type} />
                    )}
                </div>

                {/* --- COLUMNA DERECHA: INFO --- */}
                <div className="relative w-full md:w-1/2 p-6 md:p-10 flex flex-col -mt-8 md:mt-0 bg-white rounded-t-[30px] md:rounded-none z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none">

                    {/* Breadcrumb Desktop */}
                    <div className="hidden md:flex mb-6">
                        <Link href="/" className="flex items-center text-text-mid hover:text-red transition font-bold text-sm bg-cream px-3 py-1 rounded-lg border-2 border-transparent hover:border-red/20">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a ofertas
                        </Link>
                    </div>

                    {/* Header Info */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-600 border-2 border-blue-100 font-extrabold text-xs tracking-wide uppercase shadow-sm">
                                <ShoppingBag className="w-3 h-3 mr-1.5" />
                                {offer.company_name}
                            </div>
                            
                            <button className="text-gray-400 hover:text-red hover:bg-red/10 p-2 rounded-full transition-all">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>

                        <h1 className="font-bangers text-[2.4rem] md:text-[3rem] text-text-dark leading-none mb-2 drop-shadow-sm">
                            {offer.title}
                        </h1>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">{offer.discount_text}</p>
                    </div>

                    {/* Pricing Block - Estilo Impacto */}
                    <div className="flex items-end gap-3 pb-6 border-b-2 border-dashed border-gray-100 mb-6">
                        <span className="font-bangers text-[3.5rem] text-red leading-[0.9] drop-shadow-sm">
                            ${Number(offer.price_offer).toLocaleString()}
                        </span>
                        {Number(offer.price_normal) > Number(offer.price_offer) && (
                            <div className="flex flex-col mb-1.5">
                                <span className="text-[0.7rem] text-gray-400 font-black uppercase tracking-wider">Antes</span>
                                <span className="text-xl text-gray-400 font-bold line-through decoration-red decoration-2">
                                    ${Number(offer.price_normal).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Detalles Grid */}
                    <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Card Tiempo */}
                            {offer.end_date && !isExpired && (
                                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border-2 border-gray-100 shadow-sm">
                                    <div className="bg-orange/10 p-2 rounded-lg text-orange">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-wider">Finaliza</p>
                                        <p className="font-bold text-gray-700 text-sm leading-tight">
                                            {new Date(offer.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Card Mapa */}
                            <a
                                href={mapLink}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-start gap-3 bg-white p-3 rounded-xl border-2 border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group"
                            >
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-wider">Ubicación</p>
                                    <p className="font-bold text-gray-700 text-sm leading-tight line-clamp-1">
                                        {offer.location_address || 'Ver en mapa'}
                                    </p>
                                </div>
                            </a>
                        </div>

                        <div className="bg-cream/50 p-4 rounded-xl border-2 border-cream-dark/50">
                            <h3 className="font-bangers text-lg text-text-mid mb-2 flex items-center gap-2">
                                📝 Sobre la oferta
                            </h3>
                            <p className="text-text-mid leading-relaxed text-sm md:text-base font-medium">
                                {offer.description || "Disfruta de esta increíble promoción por tiempo limitado. Visita el local o haz tu pedido ahora mismo."}
                            </p>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-8 md:mt-auto pt-4">
                        {isExpired ? (
                            <button disabled className="w-full bg-gray-200 text-gray-400 text-xl py-3.5 rounded-2xl font-bangers tracking-wider cursor-not-allowed border-2 border-gray-300">
                                OFERTA FINALIZADA
                            </button>
                        ) : (
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative overflow-hidden w-full bg-[#25D366] text-white text-lg py-3.5 rounded-2xl font-nunito font-black shadow-hard border-2 border-transparent hover:border-white/20 hover:shadow-hard-xl hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none flex items-center justify-center gap-3 group"
                            >
                                {/* Efecto Shimmer */}
                                <div className="absolute top-[-50%] left-[-60%] w-[40%] h-[200%] bg-white/20 skew-x-[-20deg] animate-shimmer pointer-events-none"></div>
                                
                                <Phone className="w-6 h-6 fill-white" />
                                <span className="relative z-10 tracking-wide">PEDIR POR WHATSAPP</span>
                            </a>
                        )}
                        <p className="text-center text-[0.7rem] text-gray-400 mt-3 font-bold">
                            Serás redirigido al chat del comercio
                        </p>
                    </div>

                </div>
            </main>
        </div>
    );
}
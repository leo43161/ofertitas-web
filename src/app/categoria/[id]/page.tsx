import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

// Tipos necesarios
interface Category {
  id: string | number;
  name: string;
}

interface Offer {
  id: string | number;
  title: string;
  image_url: string;
  price_offer: string;
  price_normal: string;
  company_name: string;
  promo_type: string;
  discount_text: string;
}

// 1. GENERAR RUTAS ESTÁTICAS (Build Time)
// Next.js preguntará: "¿Cuántas categorías existen?" y creará un HTML para cada una.
export async function generateStaticParams() {
  try {
    const res = await fetch('http://10.20.20.5/ofertitas_api2/public/categories');
    const categories: Category[] = await res.json();
    return categories.map((cat) => ({
      id: String(cat.id),
    }));
  } catch (error) {
    console.error("Error fetching categories for build:", error);
    return [];
  }
}

// Helper para traer info de la categoría
async function getCategory(id: string): Promise<Category | null> {
  try {
    const res = await fetch('http://10.20.20.5/ofertitas_api2/public/categories');
    const categories: Category[] = await res.json();
    return categories.find(c => String(c.id) === id) || null;
  } catch (error) {
    return null;
  }
}

// Helper para traer ofertas DE ESA categoría
async function getOffersByCategory(id: string): Promise<Offer[]> {
  try {
    // Usamos el filtro que ya programamos en el Backend: ?category_id=X
    const res = await fetch(`http://10.20.20.5/ofertitas_api2/public/offers?category_id=${id}`);
    const offers: Offer[] = await res.json();
    return offers;
  } catch (error) {
    return [];
  }
}

// 2. Metadata Dinámica
type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategory(id);
  if (!category) return { title: 'Categoría no encontrada' };

  return {
    title: `Ofertas de ${category.name} en Tucumán | Ofertitas`,
    description: `Descubre las mejores promociones de ${category.name} cerca de ti.`,
  };
}

// 3. Componente de Página
export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  
  // Ejecutamos las peticiones en paralelo para que el build sea más rápido
  const categoryData = getCategory(id);
  const offersData = getOffersByCategory(id);
  
  const [category, offers] = await Promise.all([categoryData, offersData]);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Simple */}
      <header className="bg-white sticky top-0 z-30 border-b border-gray-200 shadow-sm px-4 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-100 transition">
             <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 capitalize">{category.name}</h1>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-6">
             <span className="text-sm text-gray-500">Mostrando {offers.length} resultados</span>
          </div>

          {offers.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                  <p className="text-gray-400">No hay ofertas activas en esta categoría por ahora.</p>
                  <Link href="/" className="text-blue-600 font-medium mt-2 inline-block">Ver todo</Link>
              </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {offers.map(offer => (
                    <Link href={`/oferta/${offer.id}`} key={offer.id} className="group">
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all h-full flex flex-col">
                            <div className="aspect-4/3 bg-gray-200 relative">
                                <img 
                                    src={`http://10.20.20.5/ofertitas_api2/public${offer.image_url}`} 
                                    alt={offer.title} 
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                {offer.promo_type === 'flash' && (
                                    <span className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                        ⚡ FLASH
                                    </span>
                                )}
                                <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-2 py-1 rounded shadow-sm">
                                    {offer.discount_text}
                                </span>
                            </div>
                            <div className="p-3 flex flex-col flex-1">
                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-2 flex-1">
                                    {offer.title}
                                </h3>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-lg font-extrabold text-blue-600">
                                        ${Number(offer.price_offer).toLocaleString()}
                                    </span>
                                    <div className="text-blue-600 bg-blue-50 p-1 rounded">
                                        <ShoppingBag className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
          )}
      </main>
    </div>
  );
}
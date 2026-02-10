import { notFound } from 'next/navigation';
import { Metadata, Viewport } from 'next'; // Agregamos Viewport
import { ArrowLeft, Ghost } from 'lucide-react';
import Link from 'next/link';
import { Offer, Company } from '@/types';
import StoriesFeed from '@/components/StoriesFeed';

// 0. CONFIGURACIÓN DE VIEWPORT (Importante para Stories en Móvil)
// Esto fuerza el color negro en la barra de estado del navegador móvil
export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Evita zoom accidental al tocar rápido
};

// 1. GENERAR RUTAS ESTÁTICAS (BUILD TIME)
export async function generateStaticParams() {
    try {
        const res = await fetch('http://10.20.20.5/ofertitas_api2/public/offers/feed');
        const companies: Company[] = await res.json();
        return companies.map((company) => ({
            id: String(company.id),
        }));
    } catch (error) {
        console.error("Error fetching companies for build:", error);
        return [];
    }
}

// 2. FETCH DE DATOS
async function getCompanyFeed(id: string): Promise<Offer[]> {
    try {
        const res = await fetch(`http://10.20.20.5/ofertitas_api2/public/offers/feed/${id}`, { 
            next: { revalidate: 60 } // Cache corto para ofertas flash
        });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        return [];
    }
}

async function getCompany(id: string): Promise<Company | null> {
    try {
        const res = await fetch(`http://10.20.20.5/ofertitas_api2/public/companies/${id}`, { 
            next: { revalidate: 3600 } // La info de la empresa cambia menos
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

type Props = {
    params: Promise<{ id: string }>
}

// 3. METADATA DINÁMICA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const company = await getCompany(id);
    
    if (!company) return { title: 'Ofertitas Tucumán' };

    return {
        title: `Historias de ${company.name} | Ofertitas`,
        description: `Mira las ofertas flash activas de ${company.name} ahora mismo.`,
        openGraph: {
            title: `⚡ Historias de ${company.name}`,
            description: '¡No te pierdas estas ofertas antes de que venzan!',
            // Usamos el logo de la empresa como preview si existe
            images: company.logo_url 
                ? [`http://10.20.20.5/ofertitas_api2/public${company.logo_url}`]
                : [],
        }
    };
}

// 4. COMPONENTE DE PÁGINA (SERVER COMPONENT)
export default async function CompanyStoriesPage({ params }: Props) {
    const { id } = await params;
    
    // Ejecución en paralelo para velocidad
    const feedData = getCompanyFeed(id);
    const companyData = getCompany(id);

    const [offers, company] = await Promise.all([feedData, companyData]);

    // Caso: No hay ofertas (Empty State con Estilo)
    if (!offers || offers.length === 0) {
        return (
            <div className="h-screen w-full bg-[#1a1a1a] flex flex-col items-center justify-center p-6 text-center font-nunito relative overflow-hidden">
                
                {/* Fondo animado sutil */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                <div className="bg-white/10 p-6 rounded-full mb-6 animate-bounce">
                    <Ghost className="w-16 h-16 text-gray-400" />
                </div>

                <h1 className="font-bangers text-3xl text-white mb-2 tracking-wide">
                    ¡Ups! No hay nada aquí
                </h1>
                
                <p className="text-gray-400 mb-8 max-w-xs text-lg">
                    {company?.name || 'Esta empresa'} no tiene historias activas en este momento.
                </p>

                <Link 
                    href="/" 
                    className="flex items-center gap-2 bg-red text-white px-8 py-3 rounded-2xl font-bangers text-xl shadow-[4px_4px_0px_#922B21] active:translate-y-[2px] active:shadow-[2px_2px_0px_#922B21] transition-all"
                >
                    <ArrowLeft className="w-5 h-5" /> Volver al Inicio
                </Link>
            </div>
        );
    }

    // Caso Éxito: Renderizamos el Feed
    return (
        <main className="h-[100dvh] w-full bg-black overflow-hidden">
             {/* Pasamos offers y companyId para lógica interna */}
            <StoriesFeed offers={offers} />
        </main>
    );
}
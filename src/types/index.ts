export type Category = {
  id: string;
  name: string;
  icon_name: string;
};

export type Offer = {
  // --- Campos directos de la tabla 'offers' (o.*) ---
  id: number | string;
  location_id: number | string;
  category_id: number | string;
  
  title: string;
  phone: string;
  description: string | null;
  image_url: string | null;  
  discount_text: string;
  
  // IMPORTANTE: PDO/MySQL suelen devolver DECIMAL como string para preservar precisión
  price_normal: string;
  price_offer: string;
  
  // Fechas (vienen como strings desde MySQL)
  created_at: string;

  
  is_visible: number;
  is_featured: number;
  active: number;
  
  status: 'active' | 'expired' | 'draft';
  
  location_address: string; // Alias de l.address
  latitude: string;  // Alias de l.latitude (Decimal suele ser string)
  longitude: string; // Alias de l.longitude (Decimal suele ser string)
  
  company_name: string;      // Alias de c.name
  
  category_name: string;     // Alias de cat.name
  category_icon: string;     // Alias de cat.name

  promo_type: 'regular' | 'flash' | 'day' | 'week' | 'custom';
  start_date: string | null;
  end_date: string | null;

  distance_text?: string;       // Ej: "450 m" o "1.2 km"
  time_remaining_text?: string; // Ej: "Termina en 2h 15m"
  is_ending_soon?: boolean;     // Ej: true (para ponerlo rojo/fuego)
  company_logo?: string;
};

export interface CompanyActivity {
  company_id: number;
  company_name: string;
  company_logo: string | null;
  last_update: string;       // Fecha de la última oferta
  new_offers_count: number;  // Cantidad de ofertas nuevas
  latest_offer_id: number;   // ID para navegar directo
}

export interface Company {
  id: string;
  name: string;
  owner_id?: string | null;
  is_active: boolean; // ¡Ojo! En DB es tinyint(1), aquí boolean
  // Campos opcionales si decides expandir
  logo_url?: string;
  website: string | null;
  description: string | null;
}
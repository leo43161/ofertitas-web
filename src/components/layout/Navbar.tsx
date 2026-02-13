'use client';
import { Search, User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-red sticky top-0 z-50 h-[60px] px-5 flex items-center justify-between shadow-[0_3px_0_var(--color-red-dark)]">
      {/* Logo Bangers */}
      <Link href="/">
        <div className="font-bangers text-[2.2rem] text-white tracking-0.5 drop-shadow-[3px_3px_0_var(--color-red-dark)] cursor-pointer">
          Ofertitas
        </div>
      </Link>

      {/* Enlaces Desktop */}
      <div className="hidden md:flex gap-6 items-center">
        {['Categorías', 'Ofertas', 'Mapa', 'Contacto'].map((item) => (
          <a key={item} href="#" className="text-white/90 no-underline font-bold text-sm tracking-[1.5px] uppercase transition-colors hover:text-flash">
            {item}
          </a>
        ))}
      </div>

      {/* Derecha: Buscador + Login */}
      <div className="flex gap-3 items-center">
        <div className="relative hidden sm:block">
            <input 
                className="bg-white/15 border-2 border-white/30 rounded-[20px] py-1.5 px-4 text-white text-sm outline-none w-[180px] transition-all focus:bg-white/25 focus:border-white/70 focus:w-[220px] placeholder:text-white/60"
                type="text" 
                placeholder="🔍  Buscar..." 
            />
        </div>
        <button className="bg-white text-red border-none rounded-[20px] py-1.5 px-4 font-nunito font-extrabold text-sm cursor-pointer shadow-[2px_2px_0_var(--color-red-dark)] transition-transform hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_var(--color-red-dark)] flex items-center gap-2">
            <User size={16} /> LOGIN
        </button>
      </div>
    </nav>
  );
}
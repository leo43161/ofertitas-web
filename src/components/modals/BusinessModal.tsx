'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Store, ShoppingBag, Zap, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface BusinessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BusinessModal({ isOpen, onClose }: BusinessModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 1. Backdrop (Fondo oscuro borroso) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 mx-auto"
                    />
                    {/* 2. Modal Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full flex justify-center "
                    >
                        <div className='max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden'>
                            {/* Header: Gradiente Impactante */}
                            <div className="relative h-32 bg-linear-to-br from-red-600 to-[#3d1008] flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

                                {/* Botón Cerrar */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors backdrop-blur-md"
                                >
                                    <X size={20} />
                                </button>

                                <div className="text-center relative z-10">
                                    <div className="inline-block bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full mb-2 shadow-lg transform -rotate-2">
                                        🚀 ÚNETE A LA REVOLUCIÓN
                                    </div>
                                    <h2 className="font-bangers text-3xl text-white tracking-wide drop-shadow-md">
                                        Vende Más. <span className="text-yellow-300">Ahora.</span>
                                    </h2>
                                </div>
                            </div>

                            {/* Body: Propuesta de Valor */}
                            <div className="p-6">
                                <p className="text-center text-gray-600 font-medium mb-6 leading-relaxed">
                                    Ofertitas conecta tu stock con clientes hambrientos que están <strong className="text-red">cerca de tu local</strong>. Sin algoritmos complicados.
                                </p>

                                {/* Grid de Tipos de Negocio */}
                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    <FeatureItem icon={<Store size={20} />} label="Kioscos" color="bg-blue-100 text-blue-600" />
                                    <FeatureItem icon={<ShoppingBag size={20} />} label="Tiendas" color="bg-purple-100 text-purple-600" />
                                    <FeatureItem icon={<Zap size={20} />} label="PyMEs" color="bg-yellow-100 text-yellow-700" />
                                </div>

                                {/* Beneficios Bullet Points */}
                                <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <Benefit text="📍 Visibilidad Hiperlocal (Radio 5km)" />
                                    <Benefit text="⚡ Ventas Flash para liquidar stock" />
                                    <Benefit text="💰 0% Comisiones por venta" />
                                </div>

                                {/* Footer: CTAs */}
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="mailto:ofertitas@gmail.com?subject=Quiero%20unirme%20a%20Ofertitas&body=Hola,%20me%20interesa%20sumar%20mi%20negocio..."
                                        className="w-full bg-red hover:bg-red-dark text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-hard active:translate-y-0.5 active:shadow-none"
                                    >
                                        <Mail size={18} />
                                        Enviar Correo
                                    </Link>

                                    <p className="text-center text-xs text-gray-400 mt-2">
                                        ¿Tienes dudas? Escríbenos a <span className="font-bold text-gray-600">ofertitas@gmail.com</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Subcomponentes para limpiar el código
function FeatureItem({ icon, label, color }: { icon: any, label: string, color: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-sm`}>
                {icon}
            </div>
            <span className="text-xs font-bold text-gray-500">{label}</span>
        </div>
    );
}

function Benefit({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="min-w-[6px] h-[6px] rounded-full bg-green-500"></div>
            {text}
        </div>
    );
}
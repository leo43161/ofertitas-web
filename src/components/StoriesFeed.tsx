'use client';

import { useState, useRef, useEffect } from 'react';
import { Offer } from '@/types';
import { motion, useInView, AnimatePresence, Variants } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, MessageCircle, Share2, Heart, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const StoryCountdown = ({ date }: { date: string }) => {
    const [left, setLeft] = useState('');

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date().getTime();
            const end = new Date(date).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setLeft("00:00:00");
                return;
            }

            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            // Formato HH:MM:SS con ceros a la izquierda
            const pad = (num: number) => num.toString().padStart(2, '0');
            setLeft(`${pad(h)}:${pad(m)}:${pad(s)}`);
        };

        updateTimer(); // Ejecutar inmediatamente
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [date]);

    return <span className="font-mono tracking-widest ml-1">{left}</span>;
};

const StoryItem = ({ offer, index }: { offer: Offer; index: number }) => {
    const ref = useRef(null);
    console.log(offer);
    // useInView detecta si el elemento está en pantalla (threshold 0.5 = 50% visible)
    const isInView = useInView(ref, { amount: 0.5 });

    // Estado local para "Like" (solo visual por ahora)
    const [liked, setLiked] = useState(false);

    // Lógica para "Pausar/Reproducir" (Preparado para Video)
    useEffect(() => {
        if (isInView) {
            console.log(`Reproduciendo slide ${offer.id} (Simulado)`);
            // Aquí iría: videoRef.current.play();
        } else {
            console.log(`Pausando slide ${offer.id} (Simulado)`);
            // Aquí iría: videoRef.current.pause();
        }
    }, [isInView, offer.id]);

    const isExpired = offer.end_date ? new Date(offer.end_date) < new Date() : false;

    // Variantes de animación para textos
    const textVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div
            ref={ref}
            className="h-dvh w-full snap-start relative bg-black overflow-hidden shrink-0"
        >
            {/* 1. IMAGEN DE FONDO (Con efecto Ken Burns suave si está activo) */}
            <motion.div
                className="absolute inset-0 z-0"
                animate={isInView ? { scale: 1.1 } : { scale: 1.0 }}
                transition={{ duration: 10, ease: "linear" }}
            >
                <img
                    src={`http://10.20.20.5/ofertitas_api2/public${offer.image_url}`}
                    alt={offer.title}
                    className={`w-full h-full object-cover ${isExpired ? 'grayscale' : ''}`}
                />
            </motion.div>

            {/* 2. OVERLAYS (Gradientes para legibilidad) */}
            <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/90 z-10" />

            {/* 3. SIDEBAR DE ACCIONES (Derecha) */}
            <div className="absolute right-4 bottom-24 z-30 flex flex-col gap-6 items-center text-white">
                <div className="flex flex-col items-center gap-1">
                    <button
                        /* onClick={() => setLiked(!liked)} */
                        className="p-3 bg-secondary/90 backdrop-blur-md rounded-full active:scale-90 transition-transform"
                    >
                        <MapPin className={`w-7 h-7 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </button>
                    <span className="text-xs font-bold shadow-black drop-shadow-md">¿Donde?</span>
                </div>
                {offer.phone && (
                    <div className="flex flex-col items-center gap-1">
                        <a 
                            href={`https://wa.me/${offer.phone}?text=Hola quiero la oferta ${offer.title}`}
                            target="_blank"
                            className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-green-500/20 transition-colors"
                        >
                            <MessageCircle className="w-7 h-7" />
                        </a>
                        <span className="text-xs font-bold shadow-black drop-shadow-md">Pedir</span>
                    </div>
                )}
                <div className="flex flex-col items-center gap-1">
                    <button className="p-3 bg-white/10 backdrop-blur-md rounded-full">
                        <Share2 className="w-7 h-7" />
                    </button>
                    <span className="text-xs font-bold shadow-black drop-shadow-md">Share</span>
                </div>
            </div>

            {/* 4. CONTENIDO INFERIOR (Info Oferta) */}
            <div className="absolute bottom-0 left-0 w-full p-6 pb-8 z-20 text-white pr-20">
                <AnimatePresence>
                    {isInView && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                        >
                            {/* Badges */}
                            <motion.div variants={textVariants} className="flex gap-2 mb-3 items-center">
                                {offer.promo_type === 'flash' && offer.end_date && (
                                    <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-yellow-500/20">
                                        <Zap className="w-3 h-3 fill-black animate-pulse" />
                                        FLASH: <StoryCountdown date={offer.end_date} />
                                    </span>
                                )}
                                <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-2 py-1 rounded-full border border-white/10">
                                    {offer.discount_text || 'Oferta'}
                                </span>
                            </motion.div>

                            {/* Título y Precio */}
                            <motion.h2 variants={textVariants} className="text-2xl font-bold leading-tight mb-1 shadow-black drop-shadow-lg">
                                {offer.title}
                            </motion.h2>

                            <motion.div variants={textVariants} className="flex items-baseline gap-3 mb-2">
                                <span className="text-4xl font-black text-yellow-400 drop-shadow-md">
                                    ${Number(offer.price_offer).toLocaleString()}
                                </span>
                                {Number(offer.price_normal) > Number(offer.price_offer) && (
                                    <span className="text-lg text-gray-300 line-through decoration-red-500">
                                        ${Number(offer.price_normal).toLocaleString()}
                                    </span>
                                )}
                            </motion.div>

                            {/* Descripción Corta */}
                            <motion.p variants={textVariants} className="text-sm text-gray-200 line-clamp-2 mb-3 max-w-[90%]">
                                {offer.description}
                            </motion.p>

                            {/* Ubicación */}
                            <motion.div variants={textVariants} className="flex items-center gap-1 text-xs text-gray-300">
                                <MapPin className="w-3 h-3" /> {offer.location_address}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- CONTENEDOR PRINCIPAL (SCROLL SNAP) ---
export default function StoriesFeed({ offers, startIdx = 0 }: { offers: Offer[], startIdx?: number }) {
    const router = useRouter();

    return (
        <div className="relative w-full h-dvh bg-black">
            {/* Header Flotante Global */}
            <div className="absolute top-0 left-0 w-full z-50 p-4 flex justify-between items-start bg-linear-to-b from-black/60 to-transparent">
                <button
                    onClick={() => router.back()}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                {/* Logo de la empresa (tomado del primer item o props) */}
                {offers[0] && (
                    <div className="flex flex-col items-center">
                        <span className="text-white font-bold text-sm tracking-widest uppercase drop-shadow-md">
                            {offers[0].company_name}
                        </span>
                        <span className="text-[10px] text-gray-300">Feed de ofertas</span>
                    </div>
                )}

                <div className="w-10"></div> {/* Spacer para centrar */}
            </div>

            {/* CONTENEDOR DE SCROLL */}
            <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">
                {offers.map((offer, index) => (
                    <StoryItem key={offer.id} offer={offer} index={index} />
                ))}

                {/* Spacer final para asegurar snap en el último elemento si es necesario */}
                <div className="h-px w-full snap-start" />
            </div>
        </div>
    );
}
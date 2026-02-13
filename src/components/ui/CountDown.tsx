'use client';
import { useState, useEffect } from 'react';

export default function CountDown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - new Date().getTime();
      if (diff <= 0) return setTimeLeft("FINALIZADA");

      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimeLeft(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };
    
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return <span className="font-mono tracking-widest">{timeLeft}</span>;
}
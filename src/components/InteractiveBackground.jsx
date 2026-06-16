'use client';

import { useEffect } from 'react';

export default function InteractiveBackground() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let currentX = 50;
    let currentY = 24;
    let targetX = 50;
    let targetY = 24;
    let scrollDepth = 0;
    let frame = 0;

    const sync = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      root.style.setProperty('--bg-pointer-x', `${currentX.toFixed(2)}vw`);
      root.style.setProperty('--bg-pointer-y', `${currentY.toFixed(2)}vh`);
      root.style.setProperty('--bg-scroll', scrollDepth.toFixed(3));
      root.style.setProperty('--bg-tilt', `${((currentX - 50) * 0.18).toFixed(2)}deg`);

      frame = window.requestAnimationFrame(sync);
    };

    const handleMove = (event) => {
      targetX = (event.clientX / window.innerWidth) * 100;
      targetY = (event.clientY / window.innerHeight) * 100;
    };

    const handleLeave = () => {
      targetX = 50;
      targetY = 24;
    };

    const handleScroll = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollDepth = Math.min(window.scrollY / maxScroll, 1);
    };

    root.style.setProperty('--bg-pointer-x', '50vw');
    root.style.setProperty('--bg-pointer-y', '24vh');
    root.style.setProperty('--bg-scroll', '0');
    root.style.setProperty('--bg-tilt', '0deg');

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerleave', handleLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (!reducedMotion) {
      frame = window.requestAnimationFrame(sync);
    }

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerleave', handleLeave);
      window.removeEventListener('scroll', handleScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return null;
}

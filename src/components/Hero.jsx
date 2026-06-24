'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import GridOverlay from './GridOverlay';

// Text decode effect
function useDecodedText(finalText, delay = 0, duration = 1500) {
  const [displayText, setDisplayText] = useState(finalText);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      if (progress < 1) {
        const decodedLength = Math.floor(progress * finalText.length);
        let result = finalText.slice(0, decodedLength);

        for (let i = decodedLength; i < finalText.length; i++) {
          if (finalText[i] === ' ') {
            result += ' ';
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }

        setDisplayText(result);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayText(finalText);
      }
    };

    const timeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [finalText, delay, duration]);

  return displayText;
}

// Glitch effect component
function GlitchOverlay() {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.85) triggerGlitch();
    }, 2000);

    // Initial glitch
    setTimeout(triggerGlitch, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!glitchActive) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(74,109,86,0.1)',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
}

export default function Hero({ isMuted, volume }) {

  const trackingRef = useRef(null);
  const cursorRef = useRef(null);
  const videoRef = useRef(null);
  const [coords, setCoords] = useState({ x: '0000', y: '0000' });
  const [heroHovered, setHeroHovered] = useState(false);

  const decodedHeading1 = useDecodedText('Join Khalai Makhlooq', 500, 600);
  const decodedHeading2 = useDecodedText('Rule the Stars', 700, 600);
  const decodedLabel = useDecodedText(heroHovered ? 'Fleet: Full Throttle Ahead' : 'Elite Star Citizen PMC', heroHovered ? 0 : 400, heroHovered ? 250 : 400);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
    }
  }, [isMuted, volume]);


  useEffect(() => {
    const area = trackingRef.current;

    const cursor = cursorRef.current;
    if (!area || !cursor) return;
    let coordFrame = 0;
    let nextCoords = { x: '0000', y: '0000' };

    const handleMouseMove = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      nextCoords = {
        x: String(e.clientX).padStart(4, '0'),
        y: String(e.clientY).padStart(4, '0')
      };

      if (!coordFrame) {
        coordFrame = requestAnimationFrame(() => {
          setCoords(nextCoords);
          coordFrame = 0;
        });
      }
    };

    const handleEnter = () => cursor.style.opacity = '1';
    const handleLeave = () => cursor.style.opacity = '0';

    area.addEventListener('mousemove', handleMouseMove);
    area.addEventListener('mouseenter', handleEnter);
    area.addEventListener('mouseleave', handleLeave);

    return () => {
      area.removeEventListener('mousemove', handleMouseMove);
      area.removeEventListener('mouseenter', handleEnter);
      area.removeEventListener('mouseleave', handleLeave);
      if (coordFrame) cancelAnimationFrame(coordFrame);
    };
  }, []);

  return (
    <section id="hero" className="hero-section" ref={trackingRef} onMouseEnter={() => setHeroHovered(true)} onMouseLeave={() => setHeroHovered(false)}>
      <div className="hero-bg">
        <motion.video
          ref={videoRef}
          initial={{ scale: 1.1, filter: 'brightness(0)' }}
          animate={{ scale: 1, filter: 'brightness(0.75)' }}
          transition={{ duration: 2, ease: 'circOut' }}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          poster="/backgrounds/jp.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/Fight space and ground  Star Citizen epic cinematic,   Lighthouse.mp4" type="video/mp4" />
        </motion.video>
        <GlitchOverlay />
      </div>


      <div className="tracking-area">
        <div className="custom-cursor" ref={cursorRef}>
          <div className="line-vertical"></div>
          <div className="line-horizontal"></div>
          <div className="cursor-dot"></div>
          <div className="coords">
            <div className="coord-x">X: <span className="coords-x-val">{coords.x}</span></div>
            <div className="coord-y">Y: <span className="coords-y-val">{coords.y}</span></div>
          </div>
        </div>
      </div>

      <div className="hero-wrapper">
        <div className="hero-bottom">
          <div className="hero-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="hero-label"
            >
              <span className="hero-label-text">{decodedLabel}</span>
            </motion.div>



            <div className="hero-heading-wrapper">
              <a
                href="https://discord.gg/kmhq"
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative z-20"
              >
                <motion.h1
                  initial={{ y: '100%' }}
                  animate={{ y: 0, letterSpacing: heroHovered ? '-0.055em' : '-0.03em' }}
                  transition={{ delay: 0.5, duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                  className="hero-heading text-glow"
                >
                  {decodedHeading1}
                </motion.h1>
              </a>
            </div>

            <div className="hero-heading-wrapper">
              <a
                href="https://discord.gg/kmhq"
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative z-20"
              >
                <motion.h1
                  initial={{ y: '100%' }}
                  animate={{ y: 0, scale: heroHovered ? 1.025 : 1 }}
                  transition={{ delay: 0.6, duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                  className="hero-heading accent text-glow"
                  whileHover={{ scale: 1.05, skewX: -5 }}
                >
                  <img
                    src="/nobglogo.png"
                    alt="Khalai Makhlooq"
                    style={{
                      display: 'inline-block',
                      width: '1.5em',
                      height: '1.5em',
                      verticalAlign: 'middle',
                      marginRight: '0.3em',
                      filter: 'drop-shadow(0 0 10px rgba(74, 109, 86, 0.4))'
                    }}
                  />
                  {decodedHeading2}
                </motion.h1>
              </a>
            </div>


            <div className="hero-subheadings">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, color: heroHovered ? '#bef264' : undefined }}
                transition={{ delay: 0.75, duration: 0.5 }}
                className="hero-subheading"
              >
                {heroHovered ? 'Infiltrators' : 'Large Scale Operators'}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, color: heroHovered ? '#a3e635' : undefined }}
                transition={{ delay: 0.85, duration: 0.5 }}
                className="hero-subheading"
              >
                {heroHovered ? 'Space Capitalists' : 'Bounty Hunters'}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, color: heroHovered ? '#84cc16' : undefined }}
                transition={{ delay: 0.95, duration: 0.5 }}
                className="hero-subheading"
              >
                {heroHovered ? 'Deep Space Explorers' : 'Mercenaries'}
              </motion.div>
            </div>
          </div>

          <div className="hero-right">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.5 }}
              className="scroll-indicator"
            >
              <span>++</span>
              <span>scroll</span>
            </motion.div>
          </div>
        </div>
      </div>


      <GridOverlay id="hero-grid" triggerSelector="#hero" />
    </section>
  );
}

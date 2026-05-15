'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import GridOverlay from './GridOverlay';

export default function Footer() {
  const [timeStr, setTimeStr] = useState('');
  
  useEffect(() => {
    function updateClock() {
      const n = new Date();
      const ds = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const d = ds[n.getDay()];
      const h = String(n.getHours()).padStart(2, '0');
      const m = String(n.getMinutes()).padStart(2, '0');
      const s = String(n.getSeconds()).padStart(2, '0');
      const tz = -(n.getTimezoneOffset() / 60);
      const sg = tz >= 0 ? '+' : '';
      setTimeStr(`${d} ${h}:${m}:${s} (GMT${sg}${tz})`);
    }
    
    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <footer className="footer" style={{ position: 'relative', overflow: 'hidden' }}>
      <GridOverlay id="footer-grid" triggerSelector=".footer" isFooter={true} />
      
      <div className="footer-content" style={{ padding: '40px 24px' }}>
        <div className="footer-top">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="footer-logo"
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            KHALAI MAKHLOOQ
          </motion.div>

          <div className="footer-links">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="footer-link-group"
            >
              <h4 style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', fontSize: '0.75rem' }}>
                [ COMMS ]
              </h4>
              <motion.a whileHover={{ x: 5, color: 'var(--accent)' }} href="#">info@khalai.makhlooq</motion.a>
              <motion.a whileHover={{ x: 5, color: 'var(--accent)' }} href="https://discord.gg/K7SfxPSwXk" target="_blank" rel="noopener noreferrer">discord.gg/K7SfxPSwXk</motion.a>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="footer-link-group"
            >
              <h4 style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', fontSize: '0.75rem' }}>
                [ ALLIES ]
              </h4>
              <motion.a whileHover={{ x: 5, color: 'var(--accent)' }} href="#">RSI Organization</motion.a>
              <motion.a whileHover={{ x: 5, color: 'var(--accent)' }} href="#">Star Citizen</motion.a>
            </motion.div>
          </div>
          
          {/* Transmission log */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{
              padding: '16px',
              background: 'rgba(12,16,22,0.5)',
              border: '1px solid rgba(74,109,86,0.2)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              minWidth: '200px',
            }}
          >
            <div style={{ 
              color: '#4A6D56', 
              marginBottom: '8px',
              letterSpacing: '0.1em',
            }}>
              ◈ TRANSMISSION LOG ◈
            </div>
            <div style={{ color: 'rgba(160,170,180,0.6)', lineHeight: 1.6 }}>
              <div>[14:23] Site update deployed</div>
              <div>[12:15] Fleet roster synced</div>
              <div>[09:42] Systems optimal</div>
            </div>
          </motion.div>
        </div>
        
        <div className="footer-bottom" style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(74,109,86,0.2)' }}>
          <div className="footer-bottom-text" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
            © {new Date().getFullYear()} KHALAI MAKHLOOQ // SECTOR 7
          </div>
          <div className="footer-socials">
            <motion.a whileHover={{ y: -3, color: 'var(--accent)' }} href="#" className="footer-social">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>RSI</span>
            </motion.a>
            <motion.a whileHover={{ y: -3, color: 'var(--accent)' }} href="https://discord.gg/K7SfxPSwXk" target="_blank" rel="noopener noreferrer" className="footer-social">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>DISCORD</span>
            </motion.a>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="footer-clock" 
            id="footer-clock"
            style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.7rem',
              color: '#4A6D56',
              letterSpacing: '0.1em',
            }}
          >
            {timeStr}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

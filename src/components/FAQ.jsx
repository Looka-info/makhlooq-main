'use client';

import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

const faqs = [
  {
    q: "How do I join the Khalai Makhlooq organization?",
    a: "Recruitment is open to all Citizens. You can apply through our RSI page or join our Discord to start your onboarding. We look for pilots, miners, and tactical strategists of all experience levels."
  },
  {
    q: "Where is the organization's main base of operations?",
    a: "Our primary technical campus is located at MicroTech in the Stanton System, with satellite logistics hubs at Port Olisar and GrimHEX for deep-space operations. We maintain a persistent presence across all major planetary bodies."
  },
  {
    q: "What types of operations do you conduct in the PU?",
    a: "We run weekly operations ranging from tactical strike missions and bounty hunting to large-scale mining expeditions and trade security. Every Citizen in the fleet is assigned to a squadron based on their expertise."
  },
  {
    q: "Do you provide ships for new members?",
    a: "Yes! Our industrial division manages a fleet of loaner ships including Cutlass Blacks and Prospectors for new members to help them get started in the Persistent Universe and earn their own UEC."
  },
  {
    q: "What makes Khalai Makhlooq different from other Orgs?",
    a: "Our tactical integration. We don't just fly together; we coordinate through a unified command structure with real-time telemetry and strategy. This gives us an edge in both high-stakes combat and logistics efficiency."
  }
];

function FAQItem({ faq, index, isOpen, onClick }) {
  const [loading, setLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const contentRef = useRef(null);
  
  const handleClick = () => {
    if (!isOpen) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowResponse(true);
      }, 400);
    } else {
      setShowResponse(false);
    }
    onClick();
  };
  
  useEffect(() => {
    if (!isOpen) setShowResponse(false);
  }, [isOpen]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={clsx("faq-item", isOpen && "open")}
      onClick={handleClick}
      style={{
        border: '1px solid rgba(74,109,86,0.2)',
        marginBottom: '12px',
        background: 'rgba(12,16,22,0.5)',
        cursor: 'pointer',
        transition: 'all 0.3s',
      }}
    >
      <div className="faq-question" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ 
            color: 'rgba(74,109,86,0.6)', 
            fontSize: '0.7rem',
            minWidth: '60px',
          }}>
            Q-{String(index + 1).padStart(3, '0')}
          </span>
          <span>{faq.q}</span>
        </div>
        <div style={{
          width: 20,
          height: 20,
          border: '1px solid rgba(74,109,86,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          color: '#4A6D56',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s',
        }}>
          {isOpen ? '×' : '+'}
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div 
              ref={contentRef}
              style={{ 
                padding: '0 24px 20px 96px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                lineHeight: 1.7,
                color: 'rgba(200,210,220,0.8)',
              }}
            >
              {loading ? (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: '#4A6D56',
                }}>
                  <span className="blink">◈</span>
                  <span>RETRIEVING DATA...</span>
                </div>
              ) : (
                <div>
                  <div style={{ 
                    fontSize: '0.65rem', 
                    color: '#4A6D56', 
                    marginBottom: '8px',
                    letterSpacing: '0.1em',
                  }}>
                    RESPONSE:
                  </div>
                  {faq.a}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="faq" className="faq-section" style={{ position: 'relative' }}>
      {/* Database header */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        color: 'rgba(74,109,86,0.6)',
      }}>
        ◈ KNOWLEDGE BASE // QUERY SYSTEM ◈
      </div>
      
      <div className="faq-wrapper" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '60px' }}>
        <div className="faq-header" style={{ marginBottom: '40px' }}>
          <div className="section-label" style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.8rem',
            color: '#4A6D56',
            letterSpacing: '0.1em',
            marginBottom: '16px',
          }}>
            [ DATABASE: FREQUENT QUERIES ]
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem' }}>FAQ</h2>
        </div>
        
        {/* Search bar */}
        <div style={{
          marginBottom: '32px',
          position: 'relative',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid rgba(74,109,86,0.3)',
            background: 'rgba(12,16,22,0.8)',
            padding: '12px 16px',
          }}>
            <span style={{ 
              color: '#4A6D56', 
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              marginRight: '12px',
            }}>
              &gt;_
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ENTER SEARCH QUERY..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'rgba(74,109,86,0.6)',
            }}>
              {filteredFaqs.length} RECORDS
            </span>
          </div>
        </div>
        
        {filteredFaqs.map((faq, i) => (
          <FAQItem
            key={i}
            faq={faq}
            index={i}
            isOpen={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
        
        {filteredFaqs.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'rgba(160,170,180,0.6)',
          }}>
            ◈ NO MATCHING RECORDS FOUND ◈
          </div>
        )}
      </div>
      
      {/* Blink animation style */}
      <style>{`
        .blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

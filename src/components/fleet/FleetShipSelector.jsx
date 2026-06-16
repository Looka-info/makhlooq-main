'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Bookmark, DollarSign } from 'lucide-react';

const formatCurrency = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return 'Price N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(number);
};

export default function FleetShipSelector({
  ships,
  selectedIndex,
  onSelect,
  totalValue = 0,
  totalCrew = 0,
}) {
  return (
    <motion.section
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fleet-showcase rounded-[2.5rem] border border-lime-300/10 bg-white/[0.025] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.35)]"
    >
      <div className="mb-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-mono text-sm font-black tracking-[0.34em] text-lime-300/55 uppercase">Fleet Showcase</h2>
          <p className="mt-1 max-w-2xl text-base text-white/40">Apni ride choose karo. Click karo, spotlight us ship par.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-mono uppercase tracking-[0.22em] text-white/40">
          <span className="rounded-full border border-lime-300/10 bg-black/35 px-3 py-2">Ships: {ships.length}</span>
          <span className="rounded-full border border-lime-300/10 bg-black/35 px-3 py-2">Value: {formatCurrency(totalValue)}</span>
          <span className="rounded-full border border-lime-300/10 bg-black/35 px-3 py-2">Crew: {totalCrew || 0}</span>
        </div>
      </div>

      <div className="fleet-showcase-grid">
        {ships.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-white/45">
            Hangar abhi khaali hai. Ships add karo phir yahan full flex hoga.
          </div>
        )}
        {ships.map((ship, index) => {
          const isActive = index === selectedIndex;
          const price = ship.pledgePriceLabel || ship.priceLabel || formatCurrency(ship.pledgePrice || ship.price);
          return (
            <motion.button
              key={ship.id}
              onClick={() => onSelect(index)}
              className={`fleet-showcase-card group ${isActive ? 'is-active' : ''}`}
              style={isActive ? { '--ship-accent': ship.accentColor } : {}}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              {ship.thumbnail ? (
                <img src={ship.thumbnail} alt={ship.name} className="fleet-showcase-card-img" />
              ) : (
                <div className="fleet-showcase-card-empty">No Image</div>
              )}
              <div className="fleet-showcase-card-shade" />
              <div className="fleet-showcase-corners" />

              <div className="absolute left-5 top-5 z-10 text-left">
                <div className="max-w-[85%] text-3xl font-black leading-none tracking-[-0.06em] text-white/95 drop-shadow-lg">
                  {ship.name}
                </div>
                <div className="mt-4 text-base font-medium text-lime-100/45 drop-shadow">
                  {ship.manufacturer}
                </div>
              </div>

              <div className="absolute right-5 top-5 z-10 rounded-md border border-lime-300/20 bg-black/20 p-1.5 text-lime-200/80 backdrop-blur-sm">
                <Bookmark size={22} />
              </div>

              <div className="absolute left-0 top-[34%] z-10 flex items-center overflow-hidden rounded-r-xl border-y border-r border-lime-300/15 bg-lime-300 text-black shadow-xl">
                <span className="flex h-14 w-14 items-center justify-center">
                  <DollarSign size={20} />
                </span>
                <span className="max-w-0 whitespace-nowrap text-sm font-black opacity-0 transition-all duration-300 group-hover:max-w-[140px] group-hover:pr-4 group-hover:opacity-100">
                  {price}
                </span>
              </div>

              <div className="absolute bottom-4 right-5 z-10 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-lime-100/65 backdrop-blur">
                {ship.role}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}

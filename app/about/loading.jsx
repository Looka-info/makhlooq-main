'use client';

import React from 'react';

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-[#05070A] p-8 flex flex-col items-center justify-center space-y-8">
      {/* Header Skeleton */}
      <div className="w-full max-w-4xl h-64 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-pulse flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        <div className="w-48 h-48 rounded-full border-2 border-emerald-500/20 animate-spin-slow" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-emerald-500/5 border border-emerald-500/10 rounded-xl animate-pulse relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        ))}
      </div>

      {/* Content Blocks */}
      <div className="w-full max-w-4xl space-y-4">
        <div className="h-4 w-1/4 bg-emerald-500/20 rounded animate-pulse" />
        <div className="h-32 w-full bg-emerald-500/5 border border-emerald-500/10 rounded-xl animate-pulse" />
        <div className="h-32 w-full bg-emerald-500/5 border border-emerald-500/10 rounded-xl animate-pulse" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

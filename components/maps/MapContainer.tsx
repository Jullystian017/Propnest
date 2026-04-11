'use client';
import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the map component to avoid "window is not defined" error in Next.js
const LeafletMap = dynamic(() => import('./LeafletMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface-dim flex items-center justify-center animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-text-gray">Memuat Peta Interaktif...</p>
      </div>
    </div>
  )
});

interface MapContainerProps {
  properties: any[];
}

export default function MapContainer({ properties }: MapContainerProps) {
  return (
    <div className="w-full h-full">
      <LeafletMap properties={properties} />
    </div>
  );
}

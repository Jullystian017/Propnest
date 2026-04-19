'use client';

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

interface ChartData {
  day: string;
  leads: number;
  click: number;
}

interface LeadsChartProps {
  data?: ChartData[];
}

const defaultData = [
  { day: 'Sen', leads: 0, click: 0 },
  { day: 'Sel', leads: 0, click: 0 },
  { day: 'Rab', leads: 0, click: 0 },
  { day: 'Kam', leads: 0, click: 0 },
  { day: 'Jum', leads: 0, click: 0 },
  { day: 'Sab', leads: 0, click: 0 },
  { day: 'Min', leads: 0, click: 0 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white-pure p-4 rounded-2xl shadow-premium border border-border-line/20 backdrop-blur-md">
        <p className="text-[10px] font-medium text-text-gray/50 uppercase tracking-widest mb-2">{label}</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div>
            <p className="text-sm font-medium text-text-dark">
              {payload[0].value} <span className="text-text-gray font-normal">Leads Baru</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-blue/30"></div>
            <p className="text-sm font-medium text-text-dark">
              {payload[1].value} <span className="text-text-gray font-normal">Klik AI</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function LeadsChart({ data = defaultData }: LeadsChartProps) {
  return (
    <div className="w-full h-[350px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#93C5FD" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#E2E8F0" 
            strokeOpacity={0.3} 
          />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Area 
            type="monotone" 
            dataKey="click" 
            stroke="#BFDBFE" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorClicks)" 
            animationDuration={2000}
          />

          <Area 
            type="monotone" 
            dataKey="leads" 
            stroke="#1D4ED8" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorLeads)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

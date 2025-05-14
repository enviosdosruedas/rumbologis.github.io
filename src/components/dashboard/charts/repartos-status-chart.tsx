
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartDataPoint {
  name: string;
  count: number;
  fill: string;
}

interface RepartosStatusChartProps {
  data: ChartDataPoint[];
}

export function RepartosStatusChart({ data }: RepartosStatusChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-sm text-muted-foreground p-4">No hay datos para el gráfico.</div>;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}> {/* Adjusted left margin for YAxis labels */}
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis 
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          allowDecimals={false}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'hsl(var(--popover))', 
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
            fontSize: '12px',
          }}
          labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 'bold' }}
          itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

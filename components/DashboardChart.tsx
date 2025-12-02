"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

// Formatação de Moeda
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
};

interface ChartData {
    month: string;
    entrada: number;
    saida: number;
}

interface DashboardChartProps {
    data: ChartData[];
}

export function DashboardChart({ data }: DashboardChartProps) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                    <XAxis
                        dataKey="month"
                        stroke="#71717a"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12, fill: '#71717a' }}
                        dy={10}
                    />
                    <YAxis
                        stroke="#71717a"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12, fill: '#71717a' }}
                        tickFormatter={(value) => `R$${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value: number) => formatCurrency(value)}
                    />
                    <Area
                        type="monotone"
                        dataKey="entrada"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorEntrada)"
                        name="Receitas"
                    />
                    <Area
                        type="monotone"
                        dataKey="saida"
                        stroke="#ef4444"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorSaida)"
                        name="Despesas"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

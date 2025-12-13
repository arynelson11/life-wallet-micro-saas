"use client";

import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, ReferenceLine } from "recharts";

const data = [
    { day: "01", actual: 50, limit: 100 },
    { day: "05", actual: 250, limit: 500 },
    { day: "10", actual: 600, limit: 1000 },
    { day: "15", actual: 950, limit: 1500 },
    { day: "20", actual: 1600, limit: 2000 }, // Slight overspend trend
    { day: "25", actual: null, limit: 2500, projected: 2100 },
    { day: "30", actual: null, limit: 3000, projected: 2800 },
];

export function SpendPredictability() {
    // Logic to determine status
    const currentSpend = 1600;
    const projectedSpend = 2800;
    const limit = 3000;
    const status = projectedSpend > limit ? "danger" : "safe";

    return (
        <div className="orvion-card p-6 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        Previsibilidade de Gastos
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Beta</span>
                    </h3>
                    <p className="text-sm text-muted-foreground">Baseado no seu consumo médio diário</p>
                </div>
                {status === "safe" ? (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Dentro da Meta
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">
                        <AlertTriangle className="w-4 h-4" />
                        Risco de Estourar
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-muted/50 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Gasto Atual</p>
                    <p className="text-2xl font-bold">R$ {currentSpend}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Previsão Fim do Mês</p>
                    <p className="text-2xl font-bold text-blue-600">R$ {projectedSpend}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Limite Definido</p>
                    <p className="text-2xl font-bold text-zinc-500">R$ {limit}</p>
                </div>
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a1a1aa' }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <ReferenceLine y={limit} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Limite', fill: '#ef4444', fontSize: 10 }} />
                        <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} fill="url(#colorActual)" name="Gasto Real" />
                        <Area type="monotone" dataKey="projected" stroke="#93c5fd" strokeDasharray="5 5" fill="none" name="Projeção" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4">
                * A linha tracejada representa a projeção se você mantiver o ritmo atual.
            </p>
        </div>
    );
}

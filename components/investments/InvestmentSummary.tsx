"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Wallet } from "lucide-react";

interface Asset {
    id: string;
    name: string;
    category: string;
    amount: number;
}

interface InvestmentSummaryProps {
    assets: Asset[];
}

const COLORS = ["#ccf381", "#3b82f6", "#a855f7", "#ef4444", "#f59e0b"];

export function InvestmentSummary({ assets }: InvestmentSummaryProps) {
    const totalEquity = assets.reduce((acc, curr) => acc + curr.amount, 0);

    const data = useMemo(() => {
        const categoryMap = assets.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    }, [assets]);

    return (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Total Equity Card */}
            <div className="orvion-card p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-zinc-400">
                        <Wallet className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Patrimônio Total</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white tracking-tight">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalEquity)}
                    </h2>
                    <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium bg-primary/10 w-fit px-3 py-1 rounded-full">
                        <TrendingUp className="w-4 h-4" />
                        <span>+2.4% este mês</span>
                    </div>
                </div>
            </div>

            {/* Allocation Chart */}
            <div className="orvion-card p-6 flex items-center justify-between">
                <div className="w-1/2 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={40}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                                itemStyle={{ color: "#fff" }}
                                formatter={(value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-1/2 pl-4 flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-zinc-400 mb-2">Alocação</h3>
                    {data.map((entry, index) => (
                        <div key={entry.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="text-zinc-300">{entry.name}</span>
                            </div>
                            <span className="font-bold text-white">{((entry.value / totalEquity) * 100).toFixed(0)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

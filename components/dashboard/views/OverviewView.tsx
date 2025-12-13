"use client";

import { SalesPerformance } from "@/components/dashboard/widgets/SalesPerformance";
import { Activity } from "@/components/dashboard/widgets/Activity";
import { RevenueComparison } from "@/components/dashboard/widgets/RevenueComparison";
import { TotalSpend } from "@/components/dashboard/widgets/TotalSpend";
import { VirtualCards } from "@/components/dashboard/widgets/VirtualCards";
import { LayoutGrid, Calendar as CalendarIcon, Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const overviewData = [
    { name: "Jan", ganhos: 4000, despesas: 2400 },
    { name: "Fev", ganhos: 3000, despesas: 1398 },
    { name: "Mar", ganhos: 2000, despesas: 9800 }, // Algo aconteceu em Março rs
    { name: "Abr", ganhos: 2780, despesas: 3908 },
    { name: "Mai", ganhos: 1890, despesas: 4800 },
    { name: "Jun", ganhos: 2390, despesas: 3800 },
    { name: "Jul", ganhos: 3490, despesas: 4300 },
];

export function OverviewView() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header Actions */}
            <div className="flex justify-end p-2">
                <Button className="rounded-full gap-2 font-semibold">
                    <Plus className="w-4 h-4" />
                    Adicionar Manualmente
                </Button>
            </div>

            {/* Dynamic Consolidated Graph */}
            <div className="orvion-card p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold">Fluxo de Caixa Global</h3>
                        <p className="text-muted-foreground"> Comparativo de Entradas vs Saídas</p>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={overviewData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorGanhos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa' }} tickFormatter={(value) => `R$${value}`} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f4f4f5" />
                            <Area type="monotone" dataKey="ganhos" stroke="#22c55e" fillOpacity={1} fill="url(#colorGanhos)" name="Ganhos" strokeWidth={3} />
                            <Area type="monotone" dataKey="despesas" stroke="#ef4444" fillOpacity={1} fill="url(#colorDespesas)" name="Despesas" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewData.slice(-4).map((item, i) => ( // Show last 4 months mini summary
                    <div key={i} className="orvion-card p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-bold text-lg">{item.name}</span>
                            {item.ganhos > item.despesas ? (
                                <TrendingUp className="text-green-500 w-5 h-5" />
                            ) : (
                                <TrendingDown className="text-red-500 w-5 h-5" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Entrou</span>
                                <span className="text-green-600 font-medium">R$ {item.ganhos}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Saiu</span>
                                <span className="text-red-500 font-medium">R$ {item.despesas}</span>
                            </div>
                            <div className="h-px bg-zinc-100 my-2" />
                            <div className="flex justify-between font-bold">
                                <span>Saldo</span>
                                <span>R$ {item.ganhos - item.despesas}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Original Widget Grid (Retained for detail) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 h-[400px]">
                    <SalesPerformance />
                </div>
                <div className="md:col-span-4 h-[400px]">
                    <Activity />
                </div>
                <div className="md:col-span-4 h-[400px]">
                    <RevenueComparison />
                </div>
                <div className="md:col-span-3 h-[350px]">
                    <div className="orvion-card p-6 h-full flex flex-col justify-center items-center text-center hover:bg-zinc-50 transition-colors cursor-pointer group">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-black transition-all">
                            <span className="text-2xl font-bold">+</span>
                        </div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">Adicionar Novo Widget</h3>
                    </div>
                </div>
                <div className="md:col-span-5 h-[350px]">
                    <TotalSpend />
                </div>
                <div className="md:col-span-4 h-[350px]">
                    <VirtualCards />
                </div>
            </div>
        </div>
    );
}

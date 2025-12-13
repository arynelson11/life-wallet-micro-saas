"use client";

import { ArrowUpRight, TrendingUp, Wallet, ArrowDownRight, CreditCard, DollarSign, PiggyBank, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Progress } from "@/components/ui/progress";

// Mock Data for Mini Charts
const earningsData = [
    { name: "S1", value: 1200 },
    { name: "S2", value: 2100 },
    { name: "S3", value: 800 },
    { name: "S4", value: 1600 },
];

const expensesData = [
    { name: "Fixas", value: 3200, fill: "#f97316" }, // Orange
    { name: "Variavéis", value: 1450, fill: "#8b5cf6" }, // Purple
];

const creditCardData = [
    { name: "Nubank", value: 3450, limit: 10000 },
    { name: "Inter", value: 1200, limit: 5000 },
];

export function OverviewView() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-end p-2">
                <Button className="rounded-full gap-2 font-semibold" disabled>
                    <ArrowUpRight className="w-4 h-4" />
                    Gerar Relatório (Em Breve)
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* 1. Ganhos Summary */}
                <div className="orvion-card p-6 flex flex-col justify-between h-[280px]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100/10 text-green-500 rounded-xl flex items-center justify-center border border-green-500/20">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Ganhos</h3>
                                <p className="text-sm text-muted-foreground">Receita Mensal</p>
                            </div>
                        </div>
                        <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded-full text-xs font-bold">+12.5%</span>
                    </div>

                    <div>
                        <span className="text-3xl font-bold">R$ 40.000,00</span>
                    </div>

                    <div className="h-[100px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={earningsData}>
                                <defs>
                                    <linearGradient id="colorEarningsOverview" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorEarningsOverview)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Despesas Summary */}
                <div className="orvion-card p-6 flex flex-col justify-between h-[280px]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100/10 text-red-500 rounded-xl flex items-center justify-center border border-red-500/20">
                                <ArrowDownRight className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Despesas</h3>
                                <p className="text-sm text-muted-foreground">Fixas vs Variáveis</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-8 items-end mb-2">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Total Fixas</p>
                            <span className="text-xl font-bold text-orange-500">R$ 3.200</span>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Total Variáveis</p>
                            <span className="text-xl font-bold text-purple-500">R$ 1.450</span>
                        </div>
                    </div>

                    <div className="h-[12px] w-full flex rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-orange-500" style={{ width: '68%' }} />
                        <div className="h-full bg-purple-500" style={{ width: '32%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">R$ 4.650,00 Total gasto este mês</p>
                </div>


                {/* 3. Dividas Summary */}
                <div className="orvion-card p-6 flex flex-col justify-between h-[280px]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-100/10 text-rose-500 rounded-xl flex items-center justify-center border border-rose-500/20">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Dívidas</h3>
                                <p className="text-sm text-muted-foreground">Status de Quitação</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-2">
                        <span className="text-3xl font-bold">R$ 12.500</span>
                        <p className="text-sm text-muted-foreground">Restantes</p>
                    </div>

                    <div className="relative h-[80px] w-full flex items-center justify-center">
                        <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                            <span className="font-bold text-xl">35%</span>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[{ value: 35 }, { value: 65 }]}
                                    innerRadius={30}
                                    outerRadius={40}
                                    paddingAngle={5}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    <Cell fill="#f43f5e" />
                                    <Cell fill="#e4e4e7" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Cartões de Crédito Summary */}
                <div className="orvion-card p-6 md:col-span-2 h-[280px] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100/10 text-blue-500 rounded-xl flex items-center justify-center border border-blue-500/20">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Cartões</h3>
                                <p className="text-sm text-muted-foreground">Limite Utilizado</p>
                            </div>
                        </div>
                        <span className="text-xl font-bold">R$ 6.010,90 <span className="text-sm text-muted-foreground font-normal">/ R$ 15.000</span></span>
                    </div>

                    <div className="space-y-6">
                        {creditCardData.map((card, i) => (
                            <div key={i}>
                                <div className="flex justify-between mb-2 text-sm">
                                    <span className="font-medium">{card.name}</span>
                                    <span>{Math.round((card.value / card.limit) * 100)}%</span>
                                </div>
                                <Progress value={(card.value / card.limit) * 100} className="h-3" />
                                <p className="text-right text-xs text-muted-foreground mt-1">R$ {card.value} usados</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Economias Summary */}
                <div className="orvion-card p-6 h-[280px] bg-black text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl translate-x-10 -translate-y-10" />

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 bg-white/10 text-primary rounded-xl flex items-center justify-center backdrop-blur-md">
                            <PiggyBank className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Patrimônio</h3>
                            <p className="text-sm text-zinc-400">Total Acumulado</p>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <span className="text-4xl font-bold tracking-tight">R$ 150k</span>
                        <div className="flex items-center gap-2 text-primary mt-2">
                            <Target className="w-4 h-4" />
                            <span className="text-sm font-medium">3 Metas Ativas</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10 mt-auto">
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-xs text-zinc-400">Renda Fixa</p>
                            <p className="font-bold">66%</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-xs text-zinc-400">Variável</p>
                            <p className="font-bold">34%</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

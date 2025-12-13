"use client";

import { ArrowUpRight, TrendingUp, Wallet, Plus } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { TransactionDialog } from "@/components/dashboard/TransactionDialog";

const data = [
    { name: "Jan", value: 4000 },
    { name: "Fev", value: 6000 },
    { name: "Mar", value: 5500 },
    { name: "Abr", value: 8000 },
    { name: "Mai", value: 7500 },
    { name: "Jun", value: 9000 },
];

export function EarningsView() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-end">
                <TransactionDialog type="earning" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="orvion-card p-8 col-span-2 md:col-span-1">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold mb-1">Receita Total</h3>
                            <p className="text-muted-foreground">Últimos 6 meses</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="mb-8">
                        <span className="text-5xl font-bold">R$ 40.000,00</span>
                        <span className="ml-3 text-green-600 font-medium bg-green-50 px-2 py-1 rounded-lg">+12.5%</span>
                    </div>

                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#22c55e" fillOpacity={1} fill="url(#colorEarnings)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-6 col-span-2 md:col-span-1">
                    <div className="orvion-card p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Salário</h4>
                                <p className="text-muted-foreground">Renda Fixa</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-xl">R$ 8.500,00</p>
                            <p className="text-sm text-green-600">Mensal</p>
                        </div>
                    </div>
                    <div className="orvion-card p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                <ArrowUpRight className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Freelance</h4>
                                <p className="text-muted-foreground">Renda Variável</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-xl">R$ 2.300,00</p>
                            <p className="text-sm text-green-600">Este Mês</p>
                        </div>
                    </div>
                    {/* Placeholder for future detailed breakdowns */}
                </div>
            </div>
        </div>
    );
}

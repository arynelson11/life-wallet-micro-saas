"use client";

import { PiggyBank, TrendingUp, Target, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TransactionDialog } from "@/components/dashboard/TransactionDialog";

export function SavingsView() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-end">
                <TransactionDialog type="investment" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="orvion-card p-8 bg-black text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                                <PiggyBank className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Patrimônio Total</h3>
                                <p className="text-zinc-400">Investimentos e Reservas</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-4xl font-bold mb-2">R$ 150.000,00</h2>
                            <div className="flex items-center gap-2 text-green-400 bg-green-900/30 w-fit px-3 py-1 rounded-full text-sm">
                                <TrendingUp className="w-4 h-4" />
                                <span>+2.4% este mês</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-zinc-400 text-sm mb-1">Renda Fixa</p>
                                <p className="font-bold text-lg">R$ 100k</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-zinc-400 text-sm mb-1">Renda Variável</p>
                                <p className="font-bold text-lg">R$ 50k</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg mb-2">Metas Financeiras</h3>
                    {[
                        { name: "Reserva de Emergência", current: 15000, target: 20000, icon: Target },
                        { name: "Viagem Fim de Ano", current: 5000, target: 12000, icon: Target },
                        { name: "Troca de Carro", current: 45000, target: 80000, icon: Target },
                    ].map((goal, i) => (
                        <div key={i} className="orvion-card p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-100 rounded-lg">
                                        <goal.icon className="w-5 h-5 text-zinc-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{goal.name}</h4>
                                        <p className="text-xs text-zinc-500">R$ {goal.current} de R$ {goal.target}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-primary">{Math.round((goal.current / goal.target) * 100)}%</span>
                            </div>
                            <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

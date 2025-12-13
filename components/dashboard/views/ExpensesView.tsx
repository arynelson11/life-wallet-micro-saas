"use client";

import { ArrowDownRight, ShoppingBag, Home, Wifi, Zap, Droplets, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TransactionDialog } from "@/components/dashboard/TransactionDialog";
import { SpendPredictability } from "@/components/dashboard/SpendPredictability";

interface ExpensesViewProps {
    type: "fixed" | "variable";
}

export function ExpensesView({ type }: ExpensesViewProps) {
    const isFixed = type === "fixed";
    const title = isFixed ? "Despesas Fixas" : "Despesas Variáveis";
    const total = isFixed ? "R$ 3.200,00" : "R$ 1.450,00";

    // Mock Data
    const fixedExpenses = [
        { name: "Aluguel", value: 2000, max: 2000, icon: Home },
        { name: "Internet", value: 150, max: 150, icon: Wifi },
        { name: "Energia", value: 280, max: 350, icon: Zap },
        { name: "Água", value: 90, max: 120, icon: Droplets },
    ];

    const variableExpenses = [
        { name: "Supermercado", value: 800, max: 1200, icon: ShoppingBag },
        { name: "Lazer", value: 350, max: 500, icon: ArrowDownRight },
        { name: "Transporte", value: 300, max: 400, icon: ArrowDownRight },
    ];

    const expenses = isFixed ? fixedExpenses : variableExpenses;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-end">
                <TransactionDialog type="expense" />
            </div>

            {!isFixed && (
                <SpendPredictability />
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Summary Card */}
                <div className="md:col-span-4 orvion-card p-8 bg-black text-white">
                    <h3 className="text-xl font-bold mb-8 text-zinc-400">{title}</h3>
                    <div className="mb-8">
                        <p className="text-sm text-zinc-400 mb-2">Total este mês</p>
                        <span className="text-5xl font-bold">{total}</span>
                    </div>
                    <div className="h-px w-full bg-zinc-800 my-8" />
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-400">Status</span>
                        <span className="text-primary font-bold">Dentro do Orçamento</span>
                    </div>
                </div>

                {/* Expenses List */}
                <div className="md:col-span-8 space-y-4">
                    {expenses.map((expense, i) => (
                        <div key={i} className="orvion-card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isFixed ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                                <expense.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-bold">{expense.name}</h4>
                                    <span className="font-medium text-zinc-600">R$ {expense.value} / R$ {expense.max}</span>
                                </div>
                                <Progress value={(expense.value / expense.max) * 100} className="h-2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

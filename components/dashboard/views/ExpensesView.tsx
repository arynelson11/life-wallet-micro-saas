"use client";

import { ArrowDownRight, ShoppingBag, Home, Wifi, Zap, Droplets, Pencil, MoreHorizontal } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { SpendPredictability } from "@/components/dashboard/SpendPredictability";
import { TransactionForm } from "@/components/dashboard/forms/TransactionForm";

interface ExpensesViewProps {
    type: "fixed" | "variable";
    transactions: any[];
    spaceId: string;
    profileId: string;
}

export function ExpensesView({ type, transactions = [], spaceId, profileId }: ExpensesViewProps) {
    const isFixed = type === "fixed";
    const title = isFixed ? "Despesas Fixas" : "Despesas Variáveis";

    // Aggregate Total
    const total = transactions.reduce((acc, t) => acc + Number(t.amount), 0);
    const formattedTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);

    // Group by Category to mock "List" behavior similar to original UI but with real data
    // Or just list them all? Listing all is better for editing.
    // Original UI had "Category | Value | Max". 
    // We don't have "Max" (Budget) per category in DB yet (only Goals).
    // So we'll list transactions directly or group by category if we want to mimic the old UI.
    // For "Add Manual" context, listing transactions allows editing individual entries.
    // Let's list transactions directly for now to enable full CRUD.

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-end">
                <TransactionForm type="expense" spaceId={spaceId} profileId={profileId} />
            </div>

            {!isFixed && (
                <SpendPredictability />
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Summary Card */}
                <div className="md:col-span-4 orvion-card p-4 md:p-8 bg-black text-white h-fit">
                    <h3 className="text-xl font-bold mb-8 text-zinc-400">{title}</h3>
                    <div className="mb-8">
                        <p className="text-sm text-zinc-400 mb-2">Total este mês</p>
                        <span className="text-5xl font-bold">{formattedTotal}</span>
                    </div>
                    <div className="h-px w-full bg-zinc-800 my-8" />
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-400">Status</span>
                        <span className="text-primary font-bold">Dentro do Orçamento</span>
                    </div>
                </div>

                {/* Expenses List */}
                <div className="md:col-span-8 space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                    {transactions.length === 0 ? (
                        <div className="text-center text-zinc-500 py-10 orvion-card">
                            Nenhuma despesa registrada.
                        </div>
                    ) : (
                        transactions.map((t, i) => (
                            <div key={t.id} className="orvion-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-shadow group">
                                <div className="flex items-center gap-4 w-full">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${isFixed ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                                        {/* Simple Icon Mapping based on category string match or default */}
                                        {t.category === 'Moradia' ? <Home className="w-5 h-5" /> :
                                            t.category === 'Alimentação' ? <ShoppingBag className="w-5 h-5" /> :
                                                <ArrowDownRight className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1 gap-2">
                                            <h4 className="font-bold truncate text-sm md:text-base">{t.description}</h4>
                                            <span className="font-medium text-zinc-600 whitespace-nowrap">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs text-zinc-400">
                                            <span>{t.category}</span>
                                            <span>{new Date(t.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <TransactionForm
                                    type="expense"
                                    initialData={t}
                                    spaceId={spaceId}
                                    profileId={profileId}
                                    trigger={
                                        <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-600 opacity-0 group-hover:opacity-100">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    }
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

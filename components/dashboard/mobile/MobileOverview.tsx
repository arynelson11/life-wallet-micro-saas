"use client";

import { useState } from "react";
import { 
    Eye, 
    EyeOff, 
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DashboardChart } from "@/components/DashboardChart";

interface MobileOverviewProps {
    summary: any;
    transactions: any[];
    onNavigate: (tab: string) => void;
}

export function MobileOverview({ summary, transactions = [], onNavigate }: MobileOverviewProps) {
    const [showBalance, setShowBalance] = useState(true);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    const processChartData = (transactions: any[]) => {
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            return d;
        });

        return last6Months.map(date => {
            const monthLabel = format(date, 'MMM', { locale: ptBR });
            const formattedLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
            
            const monthTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
            });

            const entrada = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((acc, t) => acc + t.amount, 0);

            const saida = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((acc, t) => acc + t.amount, 0);

            return {
                month: formattedLabel,
                entrada,
                saida
            };
        });
    };

    return (
        <div className="px-4 flex flex-col gap-4 mt-4 animate-fade-in-up">
            
            {/* 1. Saldo Total */}
            <div className="w-full p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm font-medium">Saldo Total</span>
                    <button onClick={() => setShowBalance(!showBalance)} className="text-zinc-500 hover:text-white transition-colors p-1 -mr-1">
                        {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                </div>
                {showBalance ? (
                    <h2 className="text-4xl font-bold text-white tracking-tighter">
                        {formatCurrency(summary.balance)}
                    </h2>
                ) : (
                    <div className="h-10 w-48 bg-zinc-800/50 rounded-lg animate-pulse" />
                )}
            </div>

            {/* 2. Resumo (Grid 2-Col) */}
            <div className="grid grid-cols-2 gap-3">
                {/* Receita */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-3xl flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-zinc-500 text-xs font-medium block mb-1">Receitas</span>
                        <span className="text-emerald-500 font-bold text-lg block tracking-tight">
                            {showBalance ? formatCurrency(summary.income) : "---"}
                        </span>
                    </div>
                </div>
                {/* Despesa */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-3xl flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/10">
                        <TrendingDown className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-zinc-500 text-xs font-medium block mb-1">Despesas</span>
                        <span className="text-red-500 font-bold text-lg block tracking-tight">
                            {showBalance ? formatCurrency(summary.expenses) : "---"}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Chart */}
            <div className="w-full h-72 bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-5 flex flex-col overflow-hidden">
                    <span className="text-zinc-400 text-sm font-medium mb-4">Fluxo de Caixa</span>
                    <div className="flex-1 w-full min-w-0 -ml-2">
                    <DashboardChart 
                        data={processChartData(transactions)} 
                    />
                    </div>
            </div>

            {/* 4. List (Transactions) */}
            <div className="flex flex-col gap-2 pb-4">
                    <div className="flex items-center justify-between mt-2 mb-2 px-1">
                    <h3 className="text-base font-bold text-white">Últimas Transações</h3>
                    <button onClick={() => onNavigate("monthly")} className="text-xs text-primary font-medium hover:underline">Ver todas</button>
                    </div>
                    
                    <div className="flex flex-col bg-zinc-900/50 border border-zinc-800/50 rounded-3xl overflow-hidden divide-y divide-zinc-800/50">
                    {transactions.slice(0, 5).map((t, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-transparent hover:bg-zinc-900/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg border border-zinc-700/30">
                                    {t.category === 'Alimentação' ? '🍔' :
                                        t.category === 'Moradia' ? '🏠' :
                                        t.category === 'Transporte' ? '🚗' : 
                                        t.category === 'Lazer' ? '🎉' : 
                                        t.type === 'income' ? '💰' : '💸'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-zinc-200 font-medium text-sm">{t.description || t.category}</span>
                                    <span className="text-zinc-500 text-xs capitalize">{format(new Date(t.date), "dd MMM", { locale: ptBR })}</span>
                                </div>
                            </div>
                            <span className={`font-bold text-sm tracking-tight ${t.type === 'income' ? 'text-emerald-500' : 'text-zinc-200'}`}>
                                {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount).replace('R$', '').trim()}
                            </span>
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <div className="text-center text-zinc-600 py-8 text-sm">Sem movimentações recentes.</div>
                    )}
                    </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import {
    Eye,
    EyeOff,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardChart } from "@/components/DashboardChart";

interface MobileDashboardProps {
    summary: any;
    transactions: any[];
    user: any;
    profile: any;
    onNavigate: (tab: string) => void;
}

export function MobileDashboard({ summary, transactions = [], user, profile, onNavigate }: MobileDashboardProps) {
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

    const firstName = profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário';

    return (
        <div className="md:hidden min-h-screen bg-black text-white pb-32 animate-fade-in-up">

            {/* 1. Header Clean & Serious */}
            <div className="flex justify-between items-center p-6 bg-black sticky top-0 z-40 border-b border-zinc-900">
                <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 opacity-80">
                        <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-lg font-semibold text-white">Visão Geral</h1>
                </div>
            </div>

            <div className="px-4 flex flex-col gap-4 mt-4">

                {/* 2. Saldo Total (Desktop Adapted) */}
                <div className="w-full p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm font-medium">Saldo Total</span>
                        <button onClick={() => setShowBalance(!showBalance)} className="text-zinc-500 hover:text-white transition-colors">
                            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                    </div>
                    {showBalance ? (
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            {formatCurrency(summary.balance)}
                        </h2>
                    ) : (
                        <div className="h-9 w-40 bg-zinc-800 rounded animate-pulse" />
                    )}
                </div>

                {/* 3. Resumo (Grid 2-Col) */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Receita */}
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-zinc-500 text-xs font-medium block mb-1">Receitas</span>
                            <span className="text-emerald-500 font-bold text-lg block">
                                {showBalance ? formatCurrency(summary.income) : "R$ ---"}
                            </span>
                        </div>
                    </div>
                    {/* Despesa */}
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                            <TrendingDown className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-zinc-500 text-xs font-medium block mb-1">Despesas</span>
                            <span className="text-red-500 font-bold text-lg block">
                                {showBalance ? formatCurrency(summary.expenses) : "R$ ---"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 4. Chart (Adapted 100% Width) */}
                <div className="w-full h-64 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col overflow-hidden">
                    <span className="text-zinc-400 text-sm font-medium mb-4">Fluxo de Caixa</span>
                    <div className="flex-1 w-full min-w-0">
                        {/* Reusing DashboardChart but ensuring it fits mobile container */}
                        <DashboardChart
                            data={processChartData(transactions)}
                        />
                    </div>
                </div>

                {/* 5. List (Transactions) - Vertical List without cards */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between mt-2 mb-2">
                        <h3 className="text-base font-bold text-white">Últimas Transações</h3>
                        <button onClick={() => onNavigate("monthly")} className="text-xs text-zinc-500 hover:text-white transition-colors">Ver todas</button>
                    </div>

                    <div className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/50">
                        {transactions.slice(0, 5).map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-zinc-900">
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
                                <span className={`font-medium text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-zinc-200'}`}>
                                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount).replace('R$', '').trim()}
                                </span>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <div className="text-center text-zinc-600 py-6 text-sm">Sem movimentações.</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

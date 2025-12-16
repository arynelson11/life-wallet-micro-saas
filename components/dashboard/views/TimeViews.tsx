"use client";

import { Calendar } from "@/components/ui/calendar"; // Assuming we want a calendar view or just a summary
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"; // Assuming table component exists or I will verify availability, if not I use div

interface TimeViewProps {
    transactions: any[];
}

import { TransactionTable } from "../TransactionTable";

export function MonthlyView({ transactions = [] }: TimeViewProps) {
    const now = new Date();
    // Filter for current month
    const monthlyTransactions = transactions.filter(t => isSameMonth(parseISO(t.date), now));

    const income = monthlyTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const expense = monthlyTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    const invested = monthlyTransactions.filter(t => t.category === 'Investimentos' || t.category === 'Economias').reduce((acc, t) => acc + Number(t.amount), 0);
    const balance = income - expense;

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white border border-zinc-100 rounded-3xl shadow-sm">
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Entradas</p>
                    <p className="text-2xl font-bold text-emerald-600">R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="p-5 bg-white border border-zinc-100 rounded-3xl shadow-sm">
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Saídas</p>
                    <p className="text-2xl font-bold text-rose-600">R$ {expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="p-5 bg-white border border-zinc-100 rounded-3xl shadow-sm">
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Investido</p>
                    <p className="text-2xl font-bold text-sky-600">R$ {invested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className={`p-5 border rounded-3xl shadow-sm ${balance >= 0 ? 'bg-zinc-900 border-zinc-800 text-primary' : 'bg-red-50 border-red-100 text-rose-600'}`}>
                    <p className="opacity-70 text-xs font-medium uppercase tracking-wider mb-1 text-white">Saldo</p>
                    <p className="text-2xl font-bold">+ R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>

            {/* List Redesign */}
            <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4 px-2">Extrato Detalhado</h3>
                <TransactionTable transactions={monthlyTransactions} />
            </div>
        </div>
    );
}

export function AnnualView({ transactions = [] }: TimeViewProps) {
    const now = new Date();
    // Generate months of current year
    const months = eachMonthOfInterval({ start: startOfYear(now), end: endOfYear(now) });

    const monthlyData = months.map(month => {
        const monthTrans = transactions.filter(t => isSameMonth(parseISO(t.date), month) && isSameYear(parseISO(t.date), month));
        const income = monthTrans.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
        return {
            month: format(month, 'MMM', { locale: ptBR }).toUpperCase(),
            value: income,
            fullDate: month
        };
    });

    const maxVal = Math.max(...monthlyData.map(d => d.value), 100); // 100 to avoid div by zero

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="orvion-card p-8">
                <h2 className="text-2xl font-bold mb-6">Panorama {format(now, 'yyyy')}</h2>
                <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-border pb-2">
                    {monthlyData.map((d, i) => (
                        <div key={i} className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-sm relative group" style={{ height: `${(d.value / maxVal) * 100}%`, minHeight: '4px' }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                                R$ {d.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between px-4 mt-2 text-xs text-muted-foreground font-mono">
                    {monthlyData.map(d => <span key={d.month}>{d.month}</span>)}
                </div>
            </div>
        </div>
    );
}

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

import { format, isSameMonth, isSameYear, parseISO, startOfYear, eachMonthOfInterval, endOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";

export function MonthlyView({ transactions = [] }: TimeViewProps) {
    const now = new Date();
    // Filter for current month
    const monthlyTransactions = transactions.filter(t => isSameMonth(parseISO(t.date), now));

    const income = monthlyTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const expense = monthlyTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    // "Investido" logic - assuming category 'Investimentos' or type 'expense' + category 'Economias'?
    // For now, let's look for category
    const invested = monthlyTransactions.filter(t => t.category === 'Investimentos' || t.category === 'Economias').reduce((acc, t) => acc + Number(t.amount), 0);

    // Balance calculation
    const balance = income - expense;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="orvion-card p-8">
                <h2 className="text-2xl font-bold mb-6">Resumo de {format(now, 'MMMM', { locale: ptBR })}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 bg-secondary/50 rounded-xl">
                        <p className="text-muted-foreground text-sm">Entradas</p>
                        <p className="text-xl font-bold text-green-500">R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-xl">
                        <p className="text-muted-foreground text-sm">Saídas</p>
                        <p className="text-xl font-bold text-red-500">R$ {expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-xl">
                        <p className="text-muted-foreground text-sm">Investido</p>
                        <p className="text-xl font-bold text-blue-500">R$ {invested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className={`p-4 rounded-xl text-white ${balance >= 0 ? 'bg-primary/20 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                        <p className="text-xs opacity-75">Saldo Final</p>
                        <p className="text-xl font-bold">+ R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>

                <h3 className="font-bold mb-4">Extrato do Mês</h3>
                <div className="border border-border rounded-xl bg-card">
                    <div className="grid grid-cols-1 divide-y divide-border">
                        {monthlyTransactions.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground">Nenhuma movimentação este mês.</div>
                        ) : (
                            monthlyTransactions.map((t, i) => (
                                <div key={i} className="flex justify-between p-4 hover:bg-secondary/20 transition-colors">
                                    <span className="text-muted-foreground font-mono text-sm w-16">{format(parseISO(t.date), 'dd/MM')}</span>
                                    <span className="flex-1 font-medium">{t.description}</span>
                                    <span className="text-sm text-muted-foreground w-32 hidden md:block">{t.category}</span>
                                    <span className={`font-bold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                        {t.type === 'income' ? '+' : '-'} {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
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

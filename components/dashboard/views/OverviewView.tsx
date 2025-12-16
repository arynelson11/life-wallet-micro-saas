"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, TrendingUp, Wallet, ArrowDownRight, CreditCard, DollarSign, PiggyBank, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Type import primarily

interface OverviewViewProps {
    summary: {
        balance: number;
        income: number;
        expenses: number;
        fixedExpenses: number;
        variableExpenses: number;
        incomeChartData: { name: string; value: number }[];
        debt: { total: number; paid: number };
        cards: { id: string; name: string; limit: number; used: number; color: string }[];
        assets: { total: number; fixed: number; variable: number; goalsCount: number };
        investments?: { total: number; fixed: number; variable: number; count: number };
    };
    onTabChange: (tab: string) => void;
}

export function OverviewView({ summary, onTabChange }: OverviewViewProps) {

    const router = useRouter();

    const handleGenerateReport = () => {
        toast.success("Relatório solicitado!", {
            description: "Enviaremos o PDF para seu email em instantes.",
        });
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    return (
        <div className="space-y-6 pb-24 animate-fade-in-up">
            <div className="flex justify-end p-2">
                <Button
                    className="rounded-full gap-2 font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleGenerateReport}
                >
                    <ArrowUpRight className="w-4 h-4" />
                    Gerar Relatório
                </Button>
            </div>

            {/* TOP ROW: Saldo, Receita, Despesas (3 Cols on Desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {/* 0. Saldo Total Summary */}
                <div className="orvion-card p-6 flex flex-col justify-between h-[280px] cursor-pointer hover:border-primary/30 transition-all border border-zinc-800 bg-zinc-950 md:bg-secondary/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-zinc-100 md:text-foreground">Saldo Geral</h3>
                                <p className="text-sm text-zinc-400 md:text-muted-foreground">Acumulado</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className={`text-2xl md:text-4xl font-bold tracking-tight truncate block ${summary.balance >= 0 ? 'text-zinc-100 md:text-foreground' : 'text-red-500'}`}>
                            {formatCurrency(summary.balance)}
                        </span>
                        <p className="text-sm text-zinc-400 md:text-muted-foreground mt-2 line-clamp-2 md:line-clamp-none">
                            Considerando todas as movimentações.
                        </p>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-4 overflow-hidden">
                        <div className={`h-full ${summary.balance >= 0 ? 'bg-primary' : 'bg-red-500'}`} style={{ width: '100%' }} />
                    </div>
                </div>

                {/* 1. Ganhos Summary */}
                <div
                    className="orvion-card p-6 flex flex-col justify-between h-[280px] cursor-pointer hover:border-green-500/30 transition-all border border-zinc-800 bg-zinc-950 md:bg-secondary/5"
                    onClick={() => onTabChange("earnings")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100/10 text-green-500 rounded-xl flex items-center justify-center border border-green-500/20">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-zinc-100 md:text-foreground">Receita</h3>
                                <p className="text-sm text-zinc-400 md:text-muted-foreground">Mensal</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span className="text-2xl md:text-4xl font-bold text-zinc-100 md:text-foreground truncate block">{formatCurrency(summary.income)}</span>
                    </div>

                    <div className="h-[100px] md:h-[120px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={summary.incomeChartData}>
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
                <div
                    className="orvion-card p-6 flex flex-col justify-between h-[280px] cursor-pointer hover:border-red-500/30 transition-all border border-zinc-800 bg-zinc-950 md:bg-secondary/5"
                    onClick={() => onTabChange("variable-expenses")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100/10 text-red-500 rounded-xl flex items-center justify-center border border-red-500/20">
                                <ArrowDownRight className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-zinc-100 md:text-foreground">Despesas</h3>
                                <p className="text-sm text-zinc-400 md:text-muted-foreground">Fixas/Var</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 items-end mb-2 justify-between">
                        <div>
                            <p className="text-xs text-zinc-400 md:text-muted-foreground mb-1">Fixas</p>
                            <span className="text-xl md:text-2xl font-bold text-orange-500 truncate block">{formatCurrency(summary.fixedExpenses)}</span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-zinc-400 md:text-muted-foreground mb-1">Variáveis</p>
                            <span className="text-xl md:text-2xl font-bold text-purple-500 truncate block">{formatCurrency(summary.variableExpenses)}</span>
                        </div>
                    </div>

                    <div className="h-[12px] w-full flex rounded-full overflow-hidden mb-4 bg-zinc-800">
                        <div className="h-full bg-orange-500" style={{ width: `${(summary.fixedExpenses / (summary.expenses || 1)) * 100}%` }} />
                        <div className="h-full bg-purple-500" style={{ width: `${(summary.variableExpenses / (summary.expenses || 1)) * 100}%` }} />
                    </div>
                    <p className="text-xs text-zinc-400 md:text-muted-foreground text-center">{formatCurrency(summary.expenses)} Total gasto este mês</p>
                </div>
            </div>

            {/* BOTTOM ROW: Dividas, Cartões, Metas, Invest (2 Cols Desktop / 4 Cols LG) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {/* 3. Dividas Summary */}
                <div
                    className="orvion-card p-6 flex flex-col justify-between h-[280px] cursor-pointer hover:border-rose-500/30 transition-all border border-zinc-800 bg-zinc-950 md:bg-secondary/5"
                    onClick={() => onTabChange("debts")}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-100/10 text-rose-500 rounded-xl flex items-center justify-center border border-rose-500/20">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-zinc-100 md:text-foreground">Dívidas</h3>
                                <p className="text-sm text-zinc-400 md:text-muted-foreground">Restantes</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-2">
                        <span className="text-2xl md:text-4xl font-bold text-zinc-100 md:text-foreground truncate block">{formatCurrency(summary.debt.total - summary.debt.paid)}</span>
                    </div>

                    {summary.debt.total > 0 && (
                        <div className="relative h-[80px] w-full flex items-center justify-center">
                            <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                                <span className="font-bold text-lg md:text-xl text-zinc-100 md:text-foreground">{Math.round((summary.debt.paid / summary.debt.total) * 100)}%</span>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[{ value: summary.debt.paid }, { value: summary.debt.total - summary.debt.paid }]}
                                        innerRadius={30}
                                        outerRadius={40}
                                        paddingAngle={5}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        <Cell fill="#f43f5e" />
                                        <Cell fill="#27272a" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                    {summary.debt.total === 0 && (
                        <div className="text-center text-sm text-zinc-500 md:text-muted-foreground mt-4">Quitado</div>
                    )}
                </div>

                {/* 4. Cartões de Crédito Summary (Takes 1 Col in 2-col/4-col grid) */}
                <div
                    className="orvion-card p-6 h-[280px] flex flex-col justify-between cursor-pointer hover:border-blue-500/30 transition-all border border-zinc-800 bg-zinc-950 md:bg-secondary/5"
                    onClick={() => onTabChange("credit-card")}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100/10 text-blue-500 rounded-xl flex items-center justify-center border border-blue-500/20">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-zinc-100 md:text-foreground">Cartões</h3>
                                <p className="text-sm text-zinc-400 md:text-muted-foreground hidden md:block">Limite</p>
                            </div>
                        </div>
                        <span className="text-xl md:text-2xl font-bold bg-zinc-800 md:bg-inherit px-3 py-1 rounded-lg text-zinc-100 md:text-foreground truncate max-w-[150px]">
                            {formatCurrency(summary.cards.reduce((acc, c) => acc + c.used, 0))}
                        </span>
                    </div>

                    <div className="space-y-4 overflow-y-auto pr-2 scrollbar-none">
                        {summary.cards.length === 0 ? (
                            <div className="text-center text-zinc-500 md:text-muted-foreground py-8">Nenhum cartão cadastrado</div>
                        ) : (
                            summary.cards.slice(0, 3).map((card, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span className="font-medium text-zinc-300 md:text-foreground truncate max-w-[150px]">{card.name}</span>
                                        <span className="text-zinc-400 md:text-muted-foreground">{card.limit > 0 ? Math.round((card.used / card.limit) * 100) : 0}%</span>
                                    </div>
                                    <Progress value={card.limit > 0 ? (card.used / card.limit) * 100 : 0} className="h-2 bg-zinc-800 md:bg-secondary" />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 5. Metas & Objetivos */}
                <div
                    className="orvion-card p-6 h-[280px] bg-zinc-950 border border-zinc-800 md:bg-zinc-900 md:border-zinc-800 text-white relative overflow-hidden flex flex-col justify-between cursor-pointer hover:border-primary/50 transition-all"
                    onClick={() => router.push("/metas")}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl translate-x-10 -translate-y-10" />

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 bg-zinc-800 text-primary rounded-xl flex items-center justify-center border border-zinc-700">
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-zinc-100">Metas</h3>
                            <p className="text-sm text-zinc-400">Sonhos</p>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <span className="text-2xl md:text-4xl font-bold tracking-tight text-zinc-100 truncate block">{formatCurrency(summary.assets.total)}</span>
                        <div className="flex items-center gap-2 text-primary mt-2">
                            <PiggyBank className="w-4 h-4" />
                            <span className="text-sm font-medium">{summary.assets.goalsCount} Alvos</span>
                        </div>
                    </div>

                    <div className="w-full bg-zinc-800 rounded-full h-2 mt-auto overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '60%' }} />
                    </div>
                </div>

                {/* 6. Total Investido */}
                <div
                    className="orvion-card p-6 h-[280px] bg-black border border-zinc-800 text-white relative overflow-hidden flex flex-col justify-between cursor-pointer hover:border-purple-500/50 transition-all"
                    onClick={() => onTabChange("savings")}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl translate-x-10 -translate-y-10" />

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 bg-zinc-900 text-purple-500 rounded-xl flex items-center justify-center border border-zinc-800">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-zinc-100">Invest.</h3>
                            <p className="text-sm text-zinc-400">Carteira</p>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <span className="text-2xl md:text-4xl font-bold tracking-tight text-zinc-100 truncate block">{formatCurrency(summary.investments?.total || 0)}</span>
                    </div>

                    {/* Mini Pie */}
                    <div className="h-16 w-full flex items-center gap-4 mt-auto">
                        <div className="h-16 w-16 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { value: summary.investments?.fixed || 0 },
                                            { value: summary.investments?.variable || 0 }
                                        ]}
                                        innerRadius={15}
                                        outerRadius={25}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        <Cell fill="#a855f7" />
                                        <Cell fill="#22c55e" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col justify-center gap-1 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                <span className="text-zinc-400">Renda Fixa</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-zinc-400">Variável</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}

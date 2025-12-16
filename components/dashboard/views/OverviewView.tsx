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
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-end p-2">
                <Button
                    className="rounded-full gap-2 font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleGenerateReport}
                >
                    <ArrowUpRight className="w-4 h-4" />
                    Gerar Relatório
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">

                {/* 0. Saldo Total Summary */}
                <div className="orvion-card p-4 md:p-6 flex flex-col justify-between h-[280px] cursor-pointer hover:border-primary/30 transition-all border border-transparent bg-secondary/5 col-span-2 md:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base md:text-lg">Saldo Geral</h3>
                                <p className="text-xs md:text-sm text-muted-foreground">Acumulado</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className={`text-2xl md:text-3xl font-bold tracking-tight truncate block ${summary.balance >= 0 ? 'text-foreground' : 'text-red-500'}`}>
                            {formatCurrency(summary.balance)}
                        </span>
                        <p className="text-xs md:text-sm text-muted-foreground mt-2 line-clamp-2 md:line-clamp-none">
                            Considerando todas as movimentações.
                        </p>
                    </div>
                    {/* Visual bar */}
                    <div className="w-full bg-muted rounded-full h-1.5 mt-4 overflow-hidden">
                        <div className={`h-full ${summary.balance >= 0 ? 'bg-primary' : 'bg-red-500'}`} style={{ width: '100%' }} />
                    </div>
                </div>

                {/* 1. Ganhos Summary */}
                <div
                    className="orvion-card p-4 md:p-6 flex flex-col justify-between h-[200px] md:h-[280px] cursor-pointer hover:border-green-500/30 transition-all border border-transparent col-span-1"
                    onClick={() => onTabChange("earnings")}
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100/10 text-green-500 rounded-xl flex items-center justify-center border border-green-500/20">
                                <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div className="hidden md:block">
                                <h3 className="font-bold text-lg">Receita</h3>
                                <p className="text-sm text-muted-foreground">Mensal</p>
                            </div>
                        </div>
                        <h3 className="font-bold text-sm md:hidden mt-2">Receita</h3>
                    </div>

                    <div>
                        <span className="text-lg md:text-3xl font-bold truncate block">{formatCurrency(summary.income)}</span>
                    </div>

                    <div className="h-16 md:h-[100px] w-full mt-2">
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
                    className="orvion-card p-4 md:p-6 flex flex-col justify-between h-[200px] md:h-[280px] cursor-pointer hover:border-red-500/30 transition-all border border-transparent col-span-1"
                    onClick={() => onTabChange("variable-expenses")}
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100/10 text-red-500 rounded-xl flex items-center justify-center border border-red-500/20">
                                <ArrowDownRight className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div className="hidden md:block">
                                <h3 className="font-bold text-lg">Despesas</h3>
                                <p className="text-sm text-muted-foreground">Fixas/Var</p>
                            </div>
                        </div>
                        <h3 className="font-bold text-sm md:hidden mt-2">Despesas</h3>
                    </div>

                    <div className="flex flex-col gap-1 mb-2">
                        <span className="text-lg md:text-xl font-bold text-orange-500 truncate">{formatCurrency(summary.fixedExpenses)}</span>
                        <span className="text-lg md:text-xl font-bold text-purple-500 truncate">{formatCurrency(summary.variableExpenses)}</span>
                    </div>

                    <div className="h-[8px] w-full flex rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-orange-500" style={{ width: `${(summary.fixedExpenses / (summary.expenses || 1)) * 100}%` }} />
                        <div className="h-full bg-purple-500" style={{ width: `${(summary.variableExpenses / (summary.expenses || 1)) * 100}%` }} />
                    </div>
                </div>


                {/* 3. Dividas Summary */}
                <div
                    className="orvion-card p-4 md:p-6 flex flex-col justify-between h-[200px] md:h-[280px] cursor-pointer hover:border-rose-500/30 transition-all border border-transparent col-span-1"
                    onClick={() => onTabChange("debts")}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-100/10 text-rose-500 rounded-xl flex items-center justify-center border border-rose-500/20">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div className="hidden md:block">
                                <h3 className="font-bold text-lg">Dívidas</h3>
                            </div>
                        </div>
                        <h3 className="font-bold text-sm md:hidden">Dívidas</h3>
                    </div>

                    <div className="text-center mb-2">
                        <span className="text-lg md:text-3xl font-bold truncate block">{formatCurrency(summary.debt.total - summary.debt.paid)}</span>
                    </div>

                    {summary.debt.total > 0 && (
                        <div className="relative h-[60px] md:h-[80px] w-full flex items-center justify-center">
                            <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                                <span className="font-bold text-sm md:text-xl">{Math.round((summary.debt.paid / summary.debt.total) * 100)}%</span>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[{ value: summary.debt.paid }, { value: summary.debt.total - summary.debt.paid }]}
                                        innerRadius={25}
                                        outerRadius={35}
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
                    )}
                    {summary.debt.total === 0 && (
                        <div className="text-center text-xs md:text-sm text-muted-foreground mt-4">Quitado</div>
                    )}
                </div>

                {/* 4. Cartões (Mobile: Col-span-1, Desktop: Col-span-2) - Wait, user wants balance col-span-2 on mobile, others small. 
                   User said: "Card de Saldo Total: Esse deve ocupar a largura total"
                   User didn't specify Cards, but normally cards need space. 
                   I will make Cards col-span-2 on mobile too for better list view? 
                   Or keep col-span-1? List view in col-span-1 is tight.
                   I will set `col-span-2 md:col-span-2`.
                */}
                <div
                    className="orvion-card p-4 md:p-6 col-span-2 md:col-span-2 h-[280px] flex flex-col justify-between cursor-pointer hover:border-blue-500/30 transition-all border border-transparent"
                    onClick={() => onTabChange("credit-card")}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100/10 text-blue-500 rounded-xl flex items-center justify-center border border-blue-500/20">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Cartões</h3>
                                <p className="text-sm text-muted-foreground hidden md:block">Limite Utilizado</p>
                            </div>
                        </div>
                        <span className="text-lg md:text-xl font-bold truncate max-w-[150px]">
                            {formatCurrency(summary.cards.reduce((acc, c) => acc + c.used, 0))}
                        </span>
                    </div>

                    <div className="space-y-4 overflow-y-auto pr-2 scrollbar-none">
                        {summary.cards.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">Nenhum cartão cadastrado</div>
                        ) : (
                            summary.cards.slice(0, 3).map((card, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span className="font-medium truncate max-w-[120px]">{card.name}</span>
                                        <span>{card.limit > 0 ? Math.round((card.used / card.limit) * 100) : 0}%</span>
                                    </div>
                                    <Progress value={card.limit > 0 ? (card.used / card.limit) * 100 : 0} className="h-3" />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 5. Metas & Objetivos (Mobile: Col-span-1) */}
                <div
                    className="orvion-card p-4 md:p-6 h-[200px] md:h-[280px] bg-zinc-900 border border-zinc-800 text-white relative overflow-hidden flex flex-col justify-between cursor-pointer hover:border-primary/50 transition-all col-span-1"
                    onClick={() => router.push("/metas")}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl translate-x-10 -translate-y-10" />

                    <div className="flex items-center gap-2 md:gap-3 relative z-10">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-800 text-primary rounded-xl flex items-center justify-center border border-zinc-700">
                            <Target className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div className="hidden md:block">
                            <h3 className="font-bold text-lg">Metas</h3>
                        </div>
                        <h3 className="font-bold text-sm md:hidden">Metas</h3>
                    </div>

                    <div className="relative z-10">
                        <span className="text-lg md:text-3xl font-bold tracking-tight block truncate">{formatCurrency(summary.assets.total)}</span>
                        <div className="flex items-center gap-2 text-primary mt-2">
                            <span className="text-xs md:text-sm font-medium">{summary.assets.goalsCount} Alvos</span>
                        </div>
                    </div>

                    <div className="w-full bg-zinc-800 rounded-full h-2 mt-auto overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '60%' }} />
                    </div>
                </div>

                {/* 6. Total Investido (Mobile: Col-span-1) */}
                <div
                    className="orvion-card p-4 md:p-6 h-[200px] md:h-[280px] bg-black border border-zinc-800 text-white relative overflow-hidden flex flex-col justify-between cursor-pointer hover:border-purple-500/50 transition-all col-span-1"
                    onClick={() => onTabChange("savings")}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl translate-x-10 -translate-y-10" />

                    <div className="flex items-center gap-2 md:gap-3 relative z-10">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-900 text-purple-500 rounded-xl flex items-center justify-center border border-zinc-800">
                            <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div className="hidden md:block">
                            <h3 className="font-bold text-lg">Invest.</h3>
                        </div>
                        <h3 className="font-bold text-sm md:hidden">Invest.</h3>
                    </div>

                    <div className="relative z-10">
                        <span className="text-lg md:text-3xl font-bold tracking-tight block truncate">{formatCurrency(summary.investments?.total || 0)}</span>
                    </div>

                    {/* Mini Pie */}
                    <div className="h-12 w-12 md:h-16 md:w-16 relative mt-auto mx-auto md:mx-0">
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
                </div>

            </div>
        </div >
    );
}

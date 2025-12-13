"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewView } from "@/components/dashboard/views/OverviewView";
import { EarningsView } from "@/components/dashboard/views/EarningsView";
import { ExpensesView } from "@/components/dashboard/views/ExpensesView";
import { DebtsView } from "@/components/dashboard/views/DebtsView";
import { CreditCardView } from "@/components/dashboard/views/CreditCardView";
import { SavingsView } from "@/components/dashboard/views/SavingsView";
import { MonthlyView, AnnualView } from "@/components/dashboard/views/TimeViews";

interface DashboardTabsProps {
    summary: any;  // Type defined in OverviewView but kept loose here to avoid circular dep issues or duplication. 
    // Ideally should export type from OverviewView or types file.
    fullData: {
        transactions: any[];
        debts: any[];
        cards: any[];
        goals: any[];
    };
    spaceId: string;
    profileId: string;
}

export function DashboardTabs({ summary, fullData, spaceId, profileId }: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState("overview");

    const incomeTransactions = fullData.transactions.filter(t => t.type === 'income');
    const expenseTransactions = fullData.transactions.filter(t => t.type === 'expense');
    const fixedExpenses = expenseTransactions.filter(t => ['Moradia', 'Educação', 'Seguros', 'Assinaturas', 'Saúde'].includes(t.category) || t.category === 'Fixa'); // Simple heuristic
    const variableExpenses = expenseTransactions.filter(t => !['Moradia', 'Educação', 'Seguros', 'Assinaturas', 'Saúde'].includes(t.category) && t.category !== 'Fixa');

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="w-full overflow-x-auto pb-2 scrollbar-none">
                <TabsList className="bg-white/50 backdrop-blur-sm border border-zinc-200 p-1 h-12 rounded-full inline-flex min-w-max">
                    <TabsTrigger value="overview" className="rounded-full px-6 h-10 text-zinc-600 data-[state=active]:bg-black data-[state=active]:text-primary hover:text-black transition-colors">Visão Geral</TabsTrigger>
                    <TabsTrigger value="earnings" className="rounded-full px-6 h-10 text-zinc-600 data-[state=active]:bg-black data-[state=active]:text-primary hover:text-black transition-colors">Ganhos</TabsTrigger>
                    <TabsTrigger value="fixed-expenses" className="rounded-full px-6 h-10 text-zinc-600 data-[state=active]:bg-black data-[state=active]:text-primary hover:text-black transition-colors">Despesas Fixas</TabsTrigger>
                    <TabsTrigger value="variable-expenses" className="rounded-full px-6 h-10 text-zinc-600 data-[state=active]:bg-black data-[state=active]:text-primary hover:text-black transition-colors">Variáveis</TabsTrigger>
                    <TabsTrigger value="debts" className="rounded-full px-6 h-10 text-zinc-600 data-[state=active]:bg-black data-[state=active]:text-primary hover:text-black transition-colors">Dívidas</TabsTrigger>
                    <TabsTrigger value="credit-card" className="rounded-full px-6 h-10 text-zinc-600 data-[state=active]:bg-black data-[state=active]:text-primary hover:text-black transition-colors">Cartão de Crédito</TabsTrigger>
                    <TabsTrigger value="savings" className="rounded-full px-6 h-10 text-zinc-600 data-[state=active]:bg-black data-[state=active]:text-primary hover:text-black transition-colors">Economias</TabsTrigger>
                    <div className="w-px h-6 bg-zinc-300 mx-2" />
                    <TabsTrigger value="monthly" className="rounded-full px-6 h-10 text-zinc-600 data-[state=active]:bg-black data-[state=active]:text-white hover:text-black transition-colors">Visão Mensal</TabsTrigger>
                    <TabsTrigger value="annual" className="rounded-full px-6 h-10 text-zinc-600 data-[state=active]:bg-black data-[state=active]:text-white hover:text-black transition-colors">Visão Anual</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
                <OverviewView
                    summary={summary}
                    onTabChange={(tab) => setActiveTab(tab)}
                />
            </TabsContent>

            <TabsContent value="earnings">
                <EarningsView
                    transactions={incomeTransactions}
                    spaceId={spaceId}
                    profileId={profileId}
                />
            </TabsContent>

            <TabsContent value="fixed-expenses">
                <ExpensesView
                    type="fixed"
                    transactions={fixedExpenses}
                    spaceId={spaceId}
                    profileId={profileId}
                />
            </TabsContent>

            <TabsContent value="variable-expenses">
                <ExpensesView
                    type="variable"
                    transactions={variableExpenses}
                    spaceId={spaceId}
                    profileId={profileId}
                />
            </TabsContent>

            <TabsContent value="debts">
                <DebtsView
                    debts={fullData.debts}
                    spaceId={spaceId}
                />
            </TabsContent>

            <TabsContent value="credit-card">
                <CreditCardView
                    cards={fullData.cards}
                    spaceId={spaceId}
                />
            </TabsContent>

            <TabsContent value="savings">
                <SavingsView
                    goals={fullData.goals}
                    spaceId={spaceId}
                />
            </TabsContent>

            <TabsContent value="monthly">
                <MonthlyView />
            </TabsContent>

            <TabsContent value="annual">
                <AnnualView />
            </TabsContent>
        </Tabs>
    );
}

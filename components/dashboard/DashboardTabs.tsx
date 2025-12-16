"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useRouter } from "next/navigation";
import { OverviewView } from "@/components/dashboard/views/OverviewView";
import { EarningsView } from "@/components/dashboard/views/EarningsView";
import { ExpensesView } from "@/components/dashboard/views/ExpensesView";
import { DebtsView } from "@/components/dashboard/views/DebtsView";
import { CreditCardView } from "@/components/dashboard/views/CreditCardView";
import { SavingsView } from "@/components/dashboard/views/SavingsView";
import { MonthlyView, AnnualView } from "@/components/dashboard/views/TimeViews";
import { InvestmentsView } from "@/components/dashboard/views/InvestmentsView";

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
    const searchParams = useSearchParams();
    const router = useRouter(); // Import needed
    const tabParam = searchParams.get('tab');

    // Default to 'overview' if no tab param
    const [activeTab, setActiveTabInternal] = useState(tabParam || "overview");

    // Sync state with URL params
    useEffect(() => {
        if (tabParam) {
            setActiveTabInternal(tabParam);
        }
    }, [tabParam]);

    const setActiveTab = (tab: string) => {
        setActiveTabInternal(tab);
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        // Shallow update to URL without reload
        router.push(`?${params.toString()}`, { scroll: false });
    };

    // Import useEffect at the top if not present, but for replace_tool I can just add it inside or rely on existing imports if I check. 
    // Wait, useState is imported. useEffect is likely NOT imported in the original file snippet I saw. 
    // I need to be careful. I saw `import { useState } from "react";`. I need to add `useEffect`. 
    // The previous view_file showed `import { useState } from "react";`.
    // So I MUST update line 3 too. But I can't update line 3 in this block easily if I only target 28-148.
    // I will replace the WHOLE file to be safe and clean, or just the function and trust I can add the import in a separate call?
    // No, I'll do a separate call for the import or modify the top part too. 
    // Actually, I'll replace lines 1-148 to handle imports.

    // ... (rest of logic same as before) ...

    const query = searchParams.get('q')?.toLowerCase() || "";

    const filterList = (list: any[]) => {
        if (!query) return list;
        return list.filter(item =>
            item.description?.toLowerCase().includes(query) ||
            item.name?.toLowerCase().includes(query) ||
            item.title?.toLowerCase().includes(query) ||
            item.category?.toLowerCase().includes(query)
        );
    };

    const filteredTransactions = filterList(fullData.transactions);
    const filteredDebts = filterList(fullData.debts);
    const filteredCards = filterList(fullData.cards);
    // const filteredGoals = filterList(fullData.goals); // Unused variable

    const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    const fixedExpenses = expenseTransactions.filter(t => ['Moradia', 'Educação', 'Seguros', 'Assinaturas', 'Saúde'].includes(t.category) || t.category === 'Fixa'); // Simple heuristic
    const variableExpenses = expenseTransactions.filter(t => !['Moradia', 'Educação', 'Seguros', 'Assinaturas', 'Saúde'].includes(t.category) && t.category !== 'Fixa');

    const triggerClass = "rounded-full border border-zinc-200 bg-white/50 px-4 h-9 text-sm text-zinc-600 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:border-zinc-900 hover:text-zinc-900 transition-all shadow-sm whitespace-nowrap";

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
                <TabsList className="bg-transparent p-0 h-auto gap-2 inline-flex justify-start w-auto">
                    <TabsTrigger value="overview" className={triggerClass}>Visão Geral</TabsTrigger>
                    <TabsTrigger value="earnings" className={triggerClass}>Ganhos</TabsTrigger>
                    <TabsTrigger value="fixed-expenses" className={triggerClass}>Despesas Fixas</TabsTrigger>
                    <TabsTrigger value="variable-expenses" className={triggerClass}>Variáveis</TabsTrigger>
                    <TabsTrigger value="debts" className={triggerClass}>Dívidas</TabsTrigger>
                    <TabsTrigger value="credit-card" className={triggerClass}>Cartão de Crédito</TabsTrigger>
                    <TabsTrigger value="savings" className={triggerClass}>Economias</TabsTrigger>
                    <TabsTrigger value="monthly" className={triggerClass}>Visão Mensal</TabsTrigger>
                    <TabsTrigger value="annual" className={triggerClass}>Visão Anual</TabsTrigger>
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
                    debts={filteredDebts}
                    spaceId={spaceId}
                />
            </TabsContent>

            <TabsContent value="credit-card">
                <CreditCardView
                    cards={filteredCards}
                    spaceId={spaceId}
                    profileId={profileId}
                />
            </TabsContent>

            <TabsContent value="savings">
                <InvestmentsView
                    spaceId={spaceId}
                />
            </TabsContent>

            <TabsContent value="monthly">
                <MonthlyView transactions={fullData.transactions} />
            </TabsContent>

            <TabsContent value="annual">
                <AnnualView transactions={fullData.transactions} />
            </TabsContent>
        </Tabs>
    );
}

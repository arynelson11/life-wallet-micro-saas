"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

    // Desktop Trigger Style (Restored)
    const desktopTriggerClass = "rounded-full px-6 h-10 text-zinc-600 data-[state=active]:bg-black data-[state=active]:text-[#CCF381] hover:text-black transition-colors";

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* MOBILE DROPDOWN (Native Select) */}
            <div className="md:hidden w-full mb-6">
                <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl font-medium focus:ring-primary/20 focus:ring-offset-0">
                        <span className="text-zinc-500 mr-2 font-normal">Visualizando:</span>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem value="overview">Visão Geral</SelectItem>
                        <SelectItem value="earnings">Ganhos</SelectItem>
                        <SelectItem value="fixed-expenses">Despesas Fixas</SelectItem>
                        <SelectItem value="variable-expenses">Variáveis</SelectItem>
                        <SelectItem value="debts">Dívidas</SelectItem>
                        <SelectItem value="credit-card">Cartão de Crédito</SelectItem>
                        <SelectItem value="savings">Economias</SelectItem>
                        <SelectItem value="monthly">Visão Mensal</SelectItem>
                        <SelectItem value="annual">Visão Anual</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* DESKTOP TABS (Original Horizontal List) */}
            <div className="hidden md:block w-full overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
                <TabsList className="bg-white/50 backdrop-blur-sm border border-zinc-200 p-1 h-12 rounded-full inline-flex min-w-max">
                    <TabsTrigger value="overview" className={desktopTriggerClass}>Visão Geral</TabsTrigger>
                    <TabsTrigger value="earnings" className={desktopTriggerClass}>Ganhos</TabsTrigger>
                    <TabsTrigger value="fixed-expenses" className={desktopTriggerClass}>Despesas Fixas</TabsTrigger>
                    <TabsTrigger value="variable-expenses" className={desktopTriggerClass}>Variáveis</TabsTrigger>
                    <TabsTrigger value="debts" className={desktopTriggerClass}>Dívidas</TabsTrigger>
                    <TabsTrigger value="credit-card" className={desktopTriggerClass}>Cartão de Crédito</TabsTrigger>
                    <TabsTrigger value="savings" className={desktopTriggerClass}>Economias</TabsTrigger>
                    <div className="w-px h-6 bg-zinc-300 mx-2 self-center" />
                    <TabsTrigger value="monthly" className={desktopTriggerClass}>Visão Mensal</TabsTrigger>
                    <TabsTrigger value="annual" className={desktopTriggerClass}>Visão Anual</TabsTrigger>
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

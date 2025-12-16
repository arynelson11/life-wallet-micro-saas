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
import { MobileDashboard } from "@/components/dashboard/MobileDashboard";

interface DashboardTabsProps {
    summary: any;
    fullData: {
        transactions: any[];
        debts: any[];
        cards: any[];
        goals: any[];
    };
    spaceId: string;
    profileId: string;
    user?: any;
    profile?: any;
}

export function DashboardTabs({ summary, fullData, spaceId, profileId, user, profile }: DashboardTabsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = searchParams.get('tab');

    const [activeTab, setActiveTabInternal] = useState(tabParam || "overview");

    useEffect(() => {
        if (tabParam) {
            setActiveTabInternal(tabParam);
        }
    }, [tabParam]);

    const setActiveTab = (tab: string) => {
        setActiveTabInternal(tab);
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        router.push(`?${params.toString()}`, { scroll: false });
    };

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

    const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    const fixedExpenses = expenseTransactions.filter(t => ['Moradia', 'Educação', 'Seguros', 'Assinaturas', 'Saúde'].includes(t.category) || t.category === 'Fixa');
    const variableExpenses = expenseTransactions.filter(t => !['Moradia', 'Educação', 'Seguros', 'Assinaturas', 'Saúde'].includes(t.category) && t.category !== 'Fixa');

    // Desktop Trigger Style (Restored)
    const desktopTriggerClass = "rounded-full px-6 h-10 text-zinc-600 data-[state=active]:bg-black data-[state=active]:text-[#CCF381] hover:text-black transition-colors";

    return (
        <>
            {/* MOBILE ONLY DASHBOARD */}
            <MobileDashboard
                summary={summary}
                transactions={fullData.transactions || []}
                user={user}
                profile={profile}
                onNavigate={setActiveTab}
            />

            {/* DESKTOP ONLY DASHBOARD */}
            <div className="hidden md:block">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    {/* DESKTOP TABS (Original Horizontal List) */}
                    <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
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
            </div>
        </>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useRouter } from "next/navigation";
import { OverviewView } from "@/components/dashboard/views/OverviewView";
import { EarningsView } from "@/components/dashboard/views/EarningsView";
import { ExpensesView } from "@/components/dashboard/views/ExpensesView";
import { DebtsView } from "@/components/dashboard/views/DebtsView";
import { CreditCardView } from "@/components/dashboard/views/CreditCardView";
import { InvestmentsView } from "@/components/dashboard/views/InvestmentsView";
import { MonthlyView, AnnualView } from "@/components/dashboard/views/TimeViews";
import { MobileHeader } from "@/components/dashboard/mobile/MobileHeader";
import { MobileOverview } from "@/components/dashboard/mobile/MobileOverview";
import { cn } from "@/lib/utils";

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

    // Desktop Trigger Style
    const desktopTriggerClass = "rounded-full px-6 h-10 text-zinc-600 data-[state=active]:bg-black data-[state=active]:text-[#CCF381] hover:text-black transition-colors";

    // Mobile Trigger Style (Pill)
    const mobileTriggerClass = "rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm whitespace-nowrap text-zinc-400 data-[state=active]:bg-[#CCF381] data-[state=active]:text-black data-[state=active]:border-[#CCF381] data-[state=active]:font-bold transition-all";

    const tabsItems = [
        { value: "overview", label: "Visão Geral" },
        { value: "earnings", label: "Ganhos" },
        { value: "fixed-expenses", label: "Fixas" },
        { value: "variable-expenses", label: "Variáveis" },
        { value: "debts", label: "Dívidas" },
        { value: "credit-card", label: "Cartões" },
        { value: "savings", label: "Investimentos" },
        { value: "monthly", label: "Extrato" },
        { value: "annual", label: "Anual" },
    ];

    return (
        <div className="min-h-screen md:min-h-0 bg-black md:bg-transparent pb-32 md:pb-0">

            {/* MOBILE ONLY HEADER */}
            <div className="md:hidden">
                <MobileHeader user={user} profile={profile} />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0 md:space-y-6">

                {/* TABS NAVIGATION BAR */}
                <div className="sticky top-[86px] md:static z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-800 md:bg-transparent md:border-none md:z-auto transition-all pt-2 pb-3 md:py-0">

                    {/* DESKTOP TABS LIST */}
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

                    {/* MOBILE TABS LIST (SCROLLABLE PILLS) */}
                    <div className="md:hidden w-full overflow-x-auto no-scrollbar px-4 flex gap-2 snap-x">
                        <TabsList className="bg-transparent h-auto p-0 gap-2 w-max text-start justify-start">
                            {tabsItems.map(item => (
                                <TabsTrigger
                                    key={item.value}
                                    value={item.value}
                                    className={mobileTriggerClass}
                                >
                                    {item.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="md:mt-0">
                    <TabsContent value="overview" className="space-y-6 focus-visible:ring-0 outline-none">
                        {/* Mobile Optimized Overview */}
                        <div className="md:hidden">
                            <MobileOverview summary={summary} transactions={fullData.transactions} onNavigate={setActiveTab} />
                        </div>
                        {/* Desktop Overview */}
                        <div className="hidden md:block">
                            <OverviewView
                                summary={summary}
                                onTabChange={(tab) => setActiveTab(tab)}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="earnings">
                        <div className="px-4 md:px-0">
                            <EarningsView
                                transactions={incomeTransactions}
                                spaceId={spaceId}
                                profileId={profileId}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="fixed-expenses">
                        <div className="px-4 md:px-0">
                            <ExpensesView
                                type="fixed"
                                transactions={fixedExpenses}
                                spaceId={spaceId}
                                profileId={profileId}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="variable-expenses">
                        <div className="px-4 md:px-0">
                            <ExpensesView
                                type="variable"
                                transactions={variableExpenses}
                                spaceId={spaceId}
                                profileId={profileId}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="debts">
                        <div className="px-4 md:px-0">
                            <DebtsView
                                debts={filteredDebts}
                                spaceId={spaceId}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="credit-card">
                        <div className="px-4 md:px-0">
                            <CreditCardView
                                cards={filteredCards}
                                spaceId={spaceId}
                                profileId={profileId}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="savings">
                        <div className="px-4 md:px-0">
                            <InvestmentsView
                                spaceId={spaceId}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="monthly">
                        <div className="px-4 md:px-0">
                            <MonthlyView transactions={fullData.transactions} />
                        </div>
                    </TabsContent>

                    <TabsContent value="annual">
                        <div className="px-4 md:px-0">
                            <AnnualView transactions={fullData.transactions} />
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

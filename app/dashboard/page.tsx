import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Views
import { OverviewView } from "@/components/dashboard/views/OverviewView";
import { EarningsView } from "@/components/dashboard/views/EarningsView";
import { ExpensesView } from "@/components/dashboard/views/ExpensesView";
import { DebtsView } from "@/components/dashboard/views/DebtsView";
import { CreditCardView } from "@/components/dashboard/views/CreditCardView";
import { SavingsView } from "@/components/dashboard/views/SavingsView";
import { MonthlyView, AnnualView } from "@/components/dashboard/views/TimeViews";

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Verificar Usuário
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-black">

            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto">
                <Header />

                <Tabs defaultValue="overview" className="space-y-8">
                    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
                        <TabsList className="bg-white/50 backdrop-blur-sm border border-zinc-200 p-1 h-12 rounded-full inline-flex min-w-max">
                            <TabsTrigger value="overview" className="rounded-full px-6 h-10 data-[state=active]:bg-black data-[state=active]:text-primary">Visão Geral</TabsTrigger>
                            <TabsTrigger value="earnings" className="rounded-full px-6 h-10 data-[state=active]:bg-black data-[state=active]:text-primary">Ganhos</TabsTrigger>
                            <TabsTrigger value="fixed-expenses" className="rounded-full px-6 h-10 data-[state=active]:bg-black data-[state=active]:text-primary">Despesas Fixas</TabsTrigger>
                            <TabsTrigger value="variable-expenses" className="rounded-full px-6 h-10 data-[state=active]:bg-black data-[state=active]:text-primary">Variáveis</TabsTrigger>
                            <TabsTrigger value="debts" className="rounded-full px-6 h-10 data-[state=active]:bg-black data-[state=active]:text-primary">Dívidas</TabsTrigger>
                            <TabsTrigger value="credit-card" className="rounded-full px-6 h-10 data-[state=active]:bg-black data-[state=active]:text-primary">Cartão de Crédito</TabsTrigger>
                            <TabsTrigger value="savings" className="rounded-full px-6 h-10 data-[state=active]:bg-black data-[state=active]:text-primary">Economias</TabsTrigger>
                            <div className="w-px h-6 bg-zinc-300 mx-2" />
                            <TabsTrigger value="monthly" className="rounded-full px-6 h-10 data-[state=active]:bg-black data-[state=active]:text-white">Visão Mensal</TabsTrigger>
                            <TabsTrigger value="annual" className="rounded-full px-6 h-10 data-[state=active]:bg-black data-[state=active]:text-white">Visão Anual</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="space-y-6">
                        <OverviewView />
                    </TabsContent>

                    <TabsContent value="earnings">
                        <EarningsView />
                    </TabsContent>

                    <TabsContent value="fixed-expenses">
                        <ExpensesView type="fixed" />
                    </TabsContent>

                    <TabsContent value="variable-expenses">
                        <ExpensesView type="variable" />
                    </TabsContent>

                    <TabsContent value="debts">
                        <DebtsView />
                    </TabsContent>

                    <TabsContent value="credit-card">
                        <CreditCardView />
                    </TabsContent>

                    <TabsContent value="savings">
                        <SavingsView />
                    </TabsContent>

                    <TabsContent value="monthly">
                        <MonthlyView />
                    </TabsContent>

                    <TabsContent value="annual">
                        <AnnualView />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { getFinancialSummary, getFullFinancialData } from "@/actions/finance-actions";


export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Verificar Usuário
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 2. Fetch de Dados Reais
    // Precisamos do Space ID. Por enquanto vamos assumir o primeiro space Pessoal dele.
    const { data: space } = await supabase
        .from('spaces')
        .select('id')
        .eq('owner_id', user.id)
        .eq('type', 'PERSONAL')
        .single();

    // Fallback se não tiver space (edge case) ou criar on the fly?
    // Inicialmente o usuario ganha um space no signup.
    const spaceId = space?.id;

    // Se não tiver spaceId, talvez redirecionar para setup ou lidar com erro.
    // Vamos assumir que existe para não bloquear o fluxo agora.

    const summary = spaceId ? await getFinancialSummary(spaceId) : {
        income: 0, expenses: 0, fixedExpenses: 0, variableExpenses: 0,
        incomeChartData: [], debt: { total: 0, paid: 0 }, cards: [],
        assets: { total: 0, fixed: 0, variable: 0, goalsCount: 0 }
    };

    const fullData = spaceId ? await getFullFinancialData(spaceId) : {
        transactions: [], debts: [], cards: [], goals: []
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-black">

            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto">
                <Header />
                <DashboardTabs
                    summary={summary}
                    fullData={fullData}
                    spaceId={spaceId!}
                    profileId={user.id}
                />
            </div>
        </div>
    );
}
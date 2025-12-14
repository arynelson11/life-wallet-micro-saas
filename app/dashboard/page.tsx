import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { getFinancialSummary, getFullFinancialData } from "@/actions/finance-actions";
import { OnboardingView } from "@/components/dashboard/OnboardingView";


export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Verificar Usuário
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 2. Fetch de Dados Reais
    // Relaxed Query: Get ANY space owned by the user, regardless of type.
    const { data: space } = await supabase
        .from('spaces')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1)
        .single();

    // 3. Fallback: Se não tiver space, mostrar OnboardingView
    // Isso evita o erro "space not identified" ao forçar a criação explicita.
    let spaceId = space?.id;

    if (!spaceId) {
        return (
            <div className="min-h-screen bg-background text-foreground font-sans">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                    <Header user={user} />
                    <OnboardingView />
                </div>
            </div>
        );
    }

    let summary = null;
    let fullData: any = { transactions: [], debts: [], cards: [], goals: [] };

    try {
        if (spaceId) {
            summary = await getFinancialSummary(spaceId);
            fullData = await getFullFinancialData(spaceId);
        }
    } catch (error) {
        console.error("Dashboard Data Fetch Error:", error);
        // Fallback to empty data to avoid crashing the page
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-black">
            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto md:px-8">
                <Header user={user} />
                <DashboardTabs
                    summary={summary}
                    fullData={fullData}
                    spaceId={spaceId}
                    profileId={user.id}
                />
            </div>
        </div>
    );
}
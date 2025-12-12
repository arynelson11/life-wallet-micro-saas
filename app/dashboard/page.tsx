import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { SalesPerformance } from "@/components/dashboard/widgets/SalesPerformance";
import { Activity } from "@/components/dashboard/widgets/Activity";
import { RevenueComparison } from "@/components/dashboard/widgets/RevenueComparison";
import { TotalSpend } from "@/components/dashboard/widgets/TotalSpend";
import { VirtualCards } from "@/components/dashboard/widgets/VirtualCards";

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Verificar Usuário
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-black">
            {/* Sidebar (Fixed) */}
            <Sidebar />

            {/* Main Content */}
            <main className="md:pl-28 pr-4 py-4 min-h-screen">
                <div className="max-w-[1600px] mx-auto">
                    <Header />

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Row 1 */}
                        <div className="md:col-span-4 h-[400px]">
                            <SalesPerformance />
                        </div>
                        <div className="md:col-span-4 h-[400px]">
                            <Activity />
                        </div>
                        <div className="md:col-span-4 h-[400px]">
                            <RevenueComparison />
                        </div>

                        {/* Row 2 */}
                        <div className="md:col-span-3 h-[350px]">
                            {/* Placeholder or another widget if needed, using SalesPerformance style for now or empty */}
                            <div className="orvion-card p-6 h-full flex flex-col justify-center items-center text-center">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                                    <span className="text-2xl font-bold">+</span>
                                </div>
                                <h3 className="font-semibold">Add New Widget</h3>
                            </div>
                        </div>
                        <div className="md:col-span-5 h-[350px]">
                            <TotalSpend />
                        </div>
                        <div className="md:col-span-4 h-[350px]">
                            <VirtualCards />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CalendarClient from "@/components/CalendarClient";
import { FixedBillDialog } from "@/components/FixedBillDialog";
import { getMonthlyBills } from "@/app/actions/monthly-bills";

export default async function CalendarioPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Fetch Monthly Bills for a wide range (e.g., current year +/- 1 year)
    // Ideally, CalendarClient should fetch on demand, but for MVP we fetch a batch
    const start = new Date().getFullYear() + "-01-01";
    const end = (new Date().getFullYear() + 1) + "-12-31";

    const monthlyBills = await getMonthlyBills(start, end);

    // Transform to format expected by CalendarClient (if needed) or update CalendarClient
    // For now, let's assume we pass the raw bills and CalendarClient adapts

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 pb-24 md:pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Calendário de Contas</h1>
                    <p className="text-zinc-500">Gerencie suas contas fixas e vencimentos.</p>
                </div>
                <FixedBillDialog />
            </div>

            {/* Calendar Client Component (handles interactivity) */}
            {/* We pass monthlyBills as 'transactions' for now, but we should probably rename prop in Client */}
            <CalendarClient initialTransactions={monthlyBills} />
        </div>
    );
}
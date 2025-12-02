import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CalendarClient from "@/components/CalendarClient";
import { CalendarActions } from "@/components/CalendarActions";

export default async function CalendarioPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Get user's space
    const { data: spaceMember } = await supabase
        .from("space_members")
        .select("space_id")
        .eq("user_id", user.id)
        .single();

    let spaceId = spaceMember?.space_id;

    if (!spaceId) {
        const { data: personalSpace } = await supabase
            .from("spaces")
            .select("id")
            .eq("owner_id", user.id)
            .single();
        spaceId = personalSpace?.id;
    }

    // Fetch ALL transactions for the space
    const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("space_id", spaceId)
        .order("date", { ascending: false });

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8 pb-24 md:pb-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Calendário Financeiro</h1>
                <p className="text-zinc-500">Organize suas contas e compromissos financeiros.</p>
            </div>

            {/* Actions Section */}
            <CalendarActions />

            {/* Calendar Client Component (handles interactivity) */}
            <CalendarClient initialTransactions={transactions || []} />
        </div>
    );
}
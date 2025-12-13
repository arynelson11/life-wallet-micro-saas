import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CalendarClient from "@/components/CalendarClient";
import { FixedBillDialog } from "@/components/FixedBillDialog";
import { getAppointments } from "@/app/actions/appointments";
import { CalendarActions } from "@/components/CalendarActions";
import { Wallet, Calendar as CalendarIcon } from "lucide-react";

export default async function CalendarioPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Fetch Range
    const start = new Date().getFullYear() + "-01-01";
    const end = (new Date().getFullYear() + 1) + "-12-31";

    // 1. Fetch Appointments (Contas Fixas / Agendadas)
    const appointments = await getAppointments(start, end);

    // 2. Fetch Transactions (Gastos Realizados)
    const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("profile_id", user.id)
        .gte("date", start)
        .lte("date", end);

    // 3. Unificar Dados
    const normalizedAppointments = appointments.map(a => ({
        ...a,
        source: 'appointment',
        isPaid: a.status === 'paid'
    }));

    const normalizedTransactions = (transactions || []).map(t => ({
        ...t,
        title: t.description,
        source: 'transaction',
        status: 'paid',
        isPaid: true
    }));

    const allEvents = [...normalizedAppointments, ...normalizedTransactions];

    // Calculate Total Pending for Current Month (Only Appointments)
    const currentMonth = new Date().getMonth();
    const totalPending = appointments
        .filter(a => {
            const d = new Date(a.date);
            return d.getMonth() === currentMonth && a.status === 'pending';
        })
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    return (
        <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pt-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span>Calendário</span>
                    </div>
                    <h1 className="text-3xl font-bold text-black tracking-tight">
                        Calendário Financeiro
                    </h1>
                    <p className="text-muted-foreground mt-1">Organize seus vencimentos e evite juros.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <CalendarActions />
                    <FixedBillDialog />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar / Summary */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="orvion-card p-4 md:p-6 bg-black text-white border-none">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <Wallet className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-medium text-zinc-300">A Pagar este Mês</span>
                        </div>
                        <div className="text-4xl font-bold tracking-tighter mb-2">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending)}
                        </div>
                        <p className="text-xs text-zinc-400">Total de contas pendentes para o mês atual.</p>
                    </div>

                    {/* Dica ou Info Extra */}
                    <div className="glass-panel p-4 md:p-6 rounded-[2rem]">
                        <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                            <CalendarIcon className="w-4 h-4" />
                            <span>Dica</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Clique em uma data para adicionar um novo agendamento ou transação.
                        </p>
                    </div>
                </div>

                {/* Calendar Area */}
                <div className="lg:col-span-9">
                    <div className="glass-panel p-2 md:p-6 rounded-[2rem] md:rounded-[2.5rem] min-h-[600px]">
                        <CalendarClient initialTransactions={allEvents} />
                    </div>
                </div>
            </div>
        </div>
    );
}
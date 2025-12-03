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
    // Precisamos buscar manualmente aqui pois não temos uma action 'getTransactions' com range exposta
    // Vamos fazer a query direta
    const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("profile_id", user.id) // ou space_id se preferir
        .gte("date", start)
        .lte("date", end);

    // 3. Unificar Dados
    // Vamos normalizar para um formato comum para o CalendarClient
    const normalizedAppointments = appointments.map(a => ({
        ...a,
        source: 'appointment', // Identificador
        isPaid: a.status === 'paid'
    }));

    const normalizedTransactions = (transactions || []).map(t => ({
        ...t,
        title: t.description, // Transactions usam 'description', Appointments usam 'title'
        source: 'transaction',
        status: 'paid', // Transações passadas são sempre "pagas/realizadas"
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
        <div className="min-h-screen bg-zinc-50 pb-24 md:pb-8">
            {/* Header Vibrante */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 pb-12 md:pb-16 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <CalendarIcon className="w-64 h-64" />
                </div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Calendário Financeiro</h1>
                            <p className="text-blue-100 opacity-90">Organize seus vencimentos e evite juros.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <CalendarActions />
                            <FixedBillDialog />
                        </div>
                    </div>

                    {/* Card de Resumo Flutuante (Mobile/Desktop) */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Wallet className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-medium text-blue-50">A Pagar este Mês</span>
                        </div>
                        <div className="text-4xl font-bold tracking-tighter">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending)}
                        </div>
                        <p className="text-xs text-blue-200 mt-1">Total de contas pendentes para o mês atual.</p>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal (Calendário) */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-8 relative z-20">
                <div className="bg-white rounded-3xl shadow-lg border border-zinc-100 p-2 md:p-6">
                    <CalendarClient initialTransactions={allEvents} />
                </div>
            </div>
        </div>
    );
}
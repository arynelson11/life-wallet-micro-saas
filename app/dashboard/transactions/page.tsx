import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ArrowUp, Wallet, Trash2 } from "lucide-react";
import { deleteTransaction } from "@/app/actions/transactions";

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
};

export default async function TransactionsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Buscar Space ID
    const { data: spaceMember } = await supabase
        .from("space_members")
        .select("space_id")
        .eq("user_id", user.id)
        .single();

    let spaceId = spaceMember?.space_id;
    if (!spaceId) {
        const { data: personalSpace } = await supabase.from("spaces").select("id").eq("owner_id", user.id).single();
        spaceId = personalSpace?.id;
    }

    // Buscar TODAS as transações
    const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("space_id", spaceId)
        .order("date", { ascending: false });

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 pb-32 md:pb-10">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900">Extrato Completo</h1>
                <p className="text-zinc-500">Todas as suas movimentações financeiras.</p>
            </div>

            <div className="space-y-3">
                {transactions && transactions.length > 0 ? (
                    transactions.map((t) => (
                        <Card key={t.id} className="p-4 flex items-center justify-between border-zinc-100 shadow-sm hover:shadow-md transition-all rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-100' : 'bg-red-50'
                                    }`}>
                                    {t.type === 'income' ? (
                                        <ArrowUp className="h-6 w-6 text-green-600" />
                                    ) : (
                                        <Wallet className="h-6 w-6 text-red-500" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-900">{t.description}</p>
                                    <p className="text-sm text-zinc-500">{t.category} • {new Date(t.date).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`font-bold text-lg ${t.type === 'income' ? 'text-green-600' : 'text-zinc-900'
                                    }`}>
                                    {t.type === 'expense' && "- "}{formatCurrency(Number(t.amount))}
                                </div>

                                <form action={async () => {
                                    'use server';
                                    await deleteTransaction(t.id);
                                }}>
                                    <button
                                        type="submit"
                                        className="text-zinc-300 hover:text-red-500 transition-colors p-2"
                                        title="Excluir Transação"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 bg-zinc-50 rounded-3xl border border-dashed border-zinc-300">
                        <p className="text-zinc-500">Nenhuma movimentação encontrada.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

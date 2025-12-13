import { AlertCircle, CheckCircle2, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DebtForm } from "@/components/dashboard/forms/DebtForm";

interface DebtsViewProps {
    debts: any[];
    spaceId: string;
}

export function DebtsView({ debts = [], spaceId }: DebtsViewProps) {

    // Aggregations
    const totalDebt = debts.reduce((acc, d) => acc + Number(d.total_amount), 0);
    const totalPaid = debts.reduce((acc, d) => acc + Number(d.paid_amount), 0);
    const globalProgress = totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-end">
                <DebtForm spaceId={spaceId} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="orvion-card p-8 border-l-4 border-red-500">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold">Dívida Total</h3>
                            <p className="text-zinc-500">Montante restante a pagar</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full text-red-600">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold mb-8">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDebt - totalPaid)}
                    </h2>

                    <h4 className="font-semibold mb-2 text-sm">Progresso de Quitação Global</h4>
                    <Progress value={globalProgress} className="h-3 bg-zinc-100" />
                    <p className="text-right text-xs text-muted-foreground mt-2">{Math.round(globalProgress)}% Pago</p>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                    <h3 className="font-bold text-lg mb-4">Detalhamento</h3>

                    {debts.length === 0 && (
                        <div className="orvion-card p-6 bg-green-50 border border-green-200 flex items-center gap-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                            <div>
                                <h4 className="font-bold text-green-900">Limpo!</h4>
                                <p className="text-green-700 text-sm">Você não possui dívidas cadastradas. Parabéns!</p>
                            </div>
                        </div>
                    )}

                    {debts.map((debt, i) => (
                        <div key={debt.id} className="orvion-card p-6 group relative">
                            <div className="flex justify-between mb-4">
                                <span className="font-bold">{debt.title}</span>
                                <span className="text-zinc-500">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(debt.total_amount - debt.paid_amount)} restantes
                                </span>
                            </div>
                            <Progress value={(debt.paid_amount / debt.total_amount) * 100} className="h-2" />
                            <div className="flex justify-between mt-2 text-xs text-zinc-400">
                                <span>{new Date(debt.created_at).toLocaleDateString()}</span>
                                <span>{Math.round((debt.paid_amount / debt.total_amount) * 100)}% Pago</span>
                            </div>

                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DebtForm
                                    initialData={debt}
                                    spaceId={spaceId}
                                    trigger={
                                        <button className="text-zinc-400 hover:text-red-600 transition-colors">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

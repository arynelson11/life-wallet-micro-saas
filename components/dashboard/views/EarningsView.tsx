import { ArrowUpRight, TrendingUp, Wallet, Pencil } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { TransactionForm } from "@/components/dashboard/forms/TransactionForm";

interface EarningsViewProps {
    transactions: any[];
    spaceId: string;
    profileId: string;
}

export function EarningsView({ transactions = [], spaceId, profileId }: EarningsViewProps) {

    // Calculate Total Income (Client-side aggregation for now)
    const totalIncome = transactions.reduce((acc, t) => acc + Number(t.amount), 0);

    // Data for Chart (Group by Month for last 6 months)
    // Simple mock-ish mapping based on real dates if available, else placeholders
    // ideally we process this properly. For now let's map transactions to see if we have data.
    const chartData = transactions.slice(0, 6).map((t, i) => ({
        name: new Date(t.date).toLocaleDateString('pt-BR', { month: 'short' }),
        value: Number(t.amount)
    })).reverse();

    // If no data, use empty array or previous placeholder 0s to keep chart rendering
    const displayData = chartData.length > 0 ? chartData : [{ name: 'Jan', value: 0 }, { name: 'Fev', value: 0 }];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-end">
                <TransactionForm
                    type="income"
                    spaceId={spaceId}
                    profileId={profileId}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="orvion-card p-8 col-span-2 md:col-span-1">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold mb-1">Receita Total</h3>
                            <p className="text-muted-foreground">Visão acumulada</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="mb-8">
                        <span className="text-5xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}</span>
                        {/* Remove static percentage or calculate real growth later */}
                    </div>

                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={displayData}>
                                <defs>
                                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#22c55e" fillOpacity={1} fill="url(#colorEarnings)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-6 col-span-2 md:col-span-1 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                    {transactions.length === 0 ? (
                        <div className="text-center text-zinc-500 py-10">
                            Nenhuma receita registrada.
                        </div>
                    ) : (
                        transactions.map((t) => (
                            <div key={t.id} className="orvion-card p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 text-primary rounded-xl flex-shrink-0 flex items-center justify-center">
                                        <Wallet className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div className="min-w-0 overflow-hidden">
                                        <h4 className="font-bold text-base md:text-lg truncate">{t.description}</h4>
                                        <p className="text-muted-foreground text-sm truncate">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                    <div className="text-right flex-1 sm:flex-initial">
                                        <p className="font-bold text-lg md:text-xl text-green-600">
                                            + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                                        </p>
                                    </div>
                                    <TransactionForm
                                        type="income"
                                        initialData={t}
                                        spaceId={spaceId}
                                        profileId={profileId}
                                        trigger={
                                            <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-600">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        }
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

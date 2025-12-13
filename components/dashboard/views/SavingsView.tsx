import { PiggyBank, TrendingUp, Target, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { GoalForm } from "@/components/dashboard/forms/GoalForm";
import { GoalDetailsDialog } from "@/components/GoalDetailsDialog";

interface SavingsViewProps {
    goals: any[];
    spaceId: string;
}

export function SavingsView({ goals = [], spaceId }: SavingsViewProps) {

    // Aggregations based on goals (which double as assets/savings for now)
    const totalCurrent = goals.reduce((acc, g) => acc + Number(g.current_amount), 0);
    const totalTarget = goals.reduce((acc, g) => acc + Number(g.target_amount), 0);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-end">
                <GoalForm spaceId={spaceId} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="orvion-card p-6 md:p-8 bg-black text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                                <PiggyBank className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Patrimônio Total</h3>
                                <p className="text-zinc-400">Acumulado em Metas</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-4xl font-bold mb-2">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCurrent)}
                            </h2>
                            <div className="flex items-center gap-2 text-green-400 bg-green-900/30 w-fit px-3 py-1 rounded-full text-sm">
                                <TrendingUp className="w-4 h-4" />
                                <span>Alvo: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalTarget)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                    <h3 className="font-bold text-lg mb-2">Metas Financeiras</h3>

                    {goals.length === 0 && (
                        <div className="text-zinc-500 text-sm py-4">Nenhuma meta cadastrada.</div>
                    )}

                    {goals.map((goal, i) => {
                        const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
                        return (
                            <GoalDetailsDialog key={goal.id} goal={goal} spaceId={spaceId}>
                                <div className="orvion-card p-6 group relative cursor-pointer hover:scale-[1.02] transition-transform">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-zinc-100 rounded-lg">
                                                <Target className="w-5 h-5 text-zinc-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold">{goal.title}</h4>
                                                <p className="text-xs text-zinc-500">
                                                    R$ {goal.current_amount} de R$ {goal.target_amount}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-primary">{Math.round(progress)}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                </div>
                            </GoalDetailsDialog>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Plus, Target, Trophy, Car, Home, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GoalDialog } from "@/components/GoalDialog";
import { GoalDetailsDialog } from "@/components/GoalDetailsDialog";

export default async function MetasPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Fetch Space ID
    let spaceId = "";
    const { data: member } = await supabase
        .from("space_members")
        .select("space_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (member) {
        spaceId = member.space_id;
    } else {
        const { data: owner } = await supabase
            .from("spaces")
            .select("id")
            .eq("owner_id", user.id)
            .maybeSingle();
        if (owner) spaceId = owner.id;
    }

    const { data: goals } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "car": return Car;
            case "home": return Home;
            case "plane": return Plane;
            default: return Target;
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between mb-8 pt-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span>Metas</span>
                    </div>
                    <h1 className="text-3xl font-bold text-black tracking-tight">
                        Metas & Sonhos
                    </h1>
                </div>
                <GoalDialog spaceId={spaceId}>
                    <Button className="h-10 rounded-full bg-black text-white hover:bg-black/90 px-6 shadow-lg shadow-black/10">
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Meta
                    </Button>
                </GoalDialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals?.map((goal) => {
                    const Icon = getIcon(goal.icon);
                    const progress = (goal.current_amount / goal.target_amount) * 100;

                    return (
                        <GoalDetailsDialog key={goal.id} goal={goal}>
                            <div className="orvion-card p-6 cursor-pointer group hover:scale-[1.02] transition-transform">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${goal.color || 'bg-primary/20 text-primary'}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Alvo</p>
                                        <p className="font-bold text-lg">
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(goal.target_amount)}
                                        </p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-1">{goal.title}</h3>
                                <div className="flex justify-between items-end mb-4">
                                    <p className="text-sm text-muted-foreground">
                                        Guardado: <span className="text-foreground font-medium">{new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(goal.current_amount)}</span>
                                    </p>
                                    <span className="text-sm font-bold text-primary">{progress.toFixed(0)}%</span>
                                </div>

                                <Progress value={progress} className="h-3 bg-gray-100" />
                            </div>
                        </GoalDetailsDialog>
                    );
                })}

                {(!goals || goals.length === 0) && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center glass-panel rounded-[2.5rem]">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Trophy className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Nenhuma meta ainda</h3>
                        <p className="text-muted-foreground max-w-md mb-8">
                            Comece a planejar seus sonhos hoje mesmo. Defina um objetivo e acompanhe seu progresso.
                        </p>
                        <GoalDialog spaceId={spaceId}>
                            <Button className="h-12 rounded-full bg-primary text-black hover:bg-primary/90 px-8 font-bold">
                                Criar Primeira Meta
                            </Button>
                        </GoalDialog>
                    </div>
                )}
            </div>
        </div>
    );
}
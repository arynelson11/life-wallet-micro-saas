import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GoalDialog } from "@/components/GoalDialog";
import { GoalDetailsDialog } from "@/components/GoalDetailsDialog"; // <--- Importamos o novo componente
import { Plane, Car, Home, GraduationCap, Shield, Star } from "lucide-react";

// Função auxiliar para renderizar o ícone
const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'plane': return <Plane className="h-6 w-6 text-white" />;
        case 'car': return <Car className="h-6 w-6 text-white" />;
        case 'home': return <Home className="h-6 w-6 text-white" />;
        case 'education': return <GraduationCap className="h-6 w-6 text-white" />;
        case 'safety': return <Shield className="h-6 w-6 text-white" />;
        default: return iconName?.match(/\p{Emoji}/u) ? <span className="text-xl">{iconName}</span> : <Star className="h-6 w-6 text-white" />;
    }
};

const COLORS = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-pink-500"];
const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export default async function MetasPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    let spaceId = null;
    const { data: spaceMember } = await supabase.from("space_members").select("space_id").eq("user_id", user.id).maybeSingle();

    if (spaceMember) {
        spaceId = spaceMember.space_id;
    } else {
        const { data: personalSpace } = await supabase.from("spaces").select("id").eq("owner_id", user.id).maybeSingle();
        if (personalSpace) spaceId = personalSpace.id;
    }

    let goals: any[] = [];
    if (spaceId) {
        const { data } = await supabase.from("goals").select("*").eq("space_id", spaceId).order("created_at", { ascending: false });
        goals = data || [];
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Nossos Objetivos 🚀</h1>
                    <p className="text-zinc-500">O dinheiro é apenas o combustível para os seus sonhos.</p>
                </div>
                <GoalDialog spaceId={spaceId || ""} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals && goals.length > 0 ? (
                    goals.map((goal, index) => {
                        const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                        const colorClass = COLORS[index % COLORS.length];

                        return (
                            // AQUI ESTÁ A MUDANÇA: Envolvemos o Card no novo Dialog
                            <GoalDetailsDialog key={goal.id} goal={goal}>
                                <Card className="border-zinc-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden cursor-pointer h-full">
                                    <CardContent className="p-6 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg shadow-black/5 ${colorClass}`}>
                                                {getIcon(goal.icon)}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Alvo</p>
                                                <p className="font-bold text-zinc-900">{formatCurrency(goal.target_amount)}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-zinc-900 mb-1">{goal.title}</h3>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-zinc-500">Guardado: <span className="text-zinc-900 font-semibold">{formatCurrency(goal.current_amount)}</span></span>
                                                <span className="text-blue-600 font-bold">{progress.toFixed(0)}%</span>
                                            </div>
                                            <Progress value={progress} className="h-3 bg-zinc-100" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </GoalDetailsDialog>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-20 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                        <div className="mx-auto h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                            <Plane className="h-8 w-8 text-zinc-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900">Nenhum sonho cadastrado</h3>
                        <p className="text-zinc-500 max-w-sm mx-auto mt-2">
                            Crie sua primeira meta clicando no botão azul acima.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
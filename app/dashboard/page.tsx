import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ArrowUp, Wallet, Target, PieChart, Lightbulb, AlertTriangle, TrendingDown, Sparkles, ShoppingBag, Car, Home, FileText, Banknote, Package, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { TransactionDialog } from "@/components/TransactionDialog";
import { DashboardChart } from "@/components/DashboardChart";

// Formatação de Moeda
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
};

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Verificar Usuário
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // --- BUSCAR NOME DO PERFIL ---
    // USA maybeSingle() PARA EVITAR CRASH
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

    const userName = profile?.full_name || user.user_metadata?.full_name || "Viajante";

    // 2. Buscar o Space (Grupo) do Usuário
    const { data: spaceMember } = await supabase
        .from("space_members")
        .select("space_id")
        .eq("user_id", user.id)
        .maybeSingle();

    let spaceId = spaceMember?.space_id;

    if (!spaceId) {
        const { data: personalSpace } = await supabase
            .from("spaces")
            .select("id")
            .eq("owner_id", user.id)
            .maybeSingle();
        spaceId = personalSpace?.id;
    }

    // 3. Buscar Transações Reais (Últimas 5 para a lista)
    const { data: recentTransactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("space_id", spaceId)
        .order("date", { ascending: false })
        .limit(5);

    // 4. Buscar TODAS as transações para o Gráfico e Totais
    const { data: allTransactions } = await supabase
        .from("transactions")
        .select("amount, type, date, category")
        .eq("space_id", spaceId)
        .order("date", { ascending: true });

    // 5. NOVA: Buscar Metas (Goals) para calcular Total Investido
    const { data: goals } = await supabase
        .from("goals")
        .select("current_amount")
        .eq("space_id", spaceId);

    // --- CÁLCULO DOS TOTAIS ---
    const totalIncome = allTransactions
        ?.filter((t) => t.type === "income")
        .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

    const totalExpense = allTransactions
        ?.filter((t) => t.type === "expense")
        .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

    // NOVA LÓGICA: Total Investido em Metas
    const totalInvested = goals
        ?.reduce((acc, goal) => acc + Number(goal.current_amount || 0), 0) || 0;

    // Saldo Disponível = (Receitas - Despesas) - Total Investido
    const availableBalance = totalIncome - totalExpense - totalInvested;

    // --- ANÁLISE DE CATEGORIAS (Top Gastos) ---
    const categoryMap = new Map<string, number>();
    allTransactions
        ?.filter((t) => t.type === "expense")
        .forEach((t) => {
            const category = t.category || "Outros";
            const current = categoryMap.get(category) || 0;
            categoryMap.set(category, current + Math.abs(Number(t.amount)));
        });

    const topCategories = Array.from(categoryMap.entries())
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 4); // Top 4 categorias


    // --- INTELIGÊNCIA PREDITIVA DE GASTOS (FORECAST) ---
    const now = new Date();
    const currentDay = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - currentDay;

    // Categorias Variáveis (Ignora fixas)
    const variableCategories = ['Alimentação', 'Lazer', 'Transporte', 'Outros', 'Mercado', 'Restaurante'];
    const fixedCategories = ['Contas', 'Casa', 'Salário', 'Aluguel', 'Internet', 'Luz', 'Água'];

    const currentMonthTransactions = allTransactions?.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    });

    const variableSpend = currentMonthTransactions
        ?.filter(t => t.type === 'expense' && !fixedCategories.includes(t.category || ''))
        .reduce((acc, curr) => acc + Math.abs(Number(curr.amount)), 0) || 0;

    // Burn Rate (Média Diária)
    // Evita divisão por zero se for dia 1, assume 1
    const dailyBurnRate = variableSpend / (currentDay > 0 ? currentDay : 1);

    // Projeção Final
    const forecastedSpend = variableSpend + (dailyBurnRate * remainingDays);

    // Status da Previsão
    let forecastStatus: 'safe' | 'warning' | 'danger' = 'safe';
    // Se a projeção de gastos variáveis for > 60% da receita total (exemplo de regra)
    if (totalIncome > 0) {
        const ratio = forecastedSpend / totalIncome;
        if (ratio > 0.8) forecastStatus = 'danger';
        else if (ratio > 0.5) forecastStatus = 'warning';
    }


    // --- INSIGHTS INTELIGENTES ---
    const insights: { type: 'warning' | 'tip' | 'success'; message: string }[] = [];

    // Regra 1: Gastos > Receitas
    if (totalExpense > totalIncome) {
        insights.push({
            type: 'warning',
            message: '⚠️ Cuidado! Você está gastando mais do que ganha este período.'
        });
    }

    // Regra 2: Maior gasto é Lazer
    if (topCategories.length > 0 && topCategories[0].category === 'Lazer') {
        insights.push({
            type: 'tip',
            message: '🎉 Seus gastos com Lazer estão altos. Que tal um fim de semana em casa?'
        });
    }

    // Regra 3: Sem investimento
    if (totalInvested === 0) {
        insights.push({
            type: 'tip',
            message: '🎯 Você ainda não começou a guardar. Crie sua primeira meta!'
        });
    }

    // Regra 4: Saldo positivo e investindo
    if (availableBalance > 0 && totalInvested > 0) {
        insights.push({
            type: 'success',
            message: '✨ Parabéns! Você está no controle das suas finanças!'
        });
    }

    // --- PREPARAÇÃO DADOS DO GRÁFICO (Agrupado por Mês) ---
    const chartDataMap = new Map();

    // Inicializa os últimos 6 meses com 0
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = d.toLocaleString('pt-BR', { month: 'short' }); // "nov", "dez"
        chartDataMap.set(key, { month: key, entrada: 0, saida: 0 });
    }

    allTransactions?.forEach(t => {
        const date = new Date(t.date);
        const key = date.toLocaleString('pt-BR', { month: 'short' });

        if (chartDataMap.has(key)) {
            const entry = chartDataMap.get(key);
            if (t.type === 'income') entry.entrada += Number(t.amount);
            else entry.saida += Math.abs(Number(t.amount));
        }
    });

    const chartData = Array.from(chartDataMap.values());

    // Ícones e cores para categorias
    const categoryConfig: Record<string, { icon: any, gradient: string }> = {
        'Alimentação': { icon: ShoppingBag, gradient: 'from-orange-500 to-orange-600' },
        'Transporte': { icon: Car, gradient: 'from-cyan-500 to-cyan-600' },
        'Lazer': { icon: Sparkles, gradient: 'from-pink-500 to-pink-600' },
        'Casa': { icon: Home, gradient: 'from-purple-500 to-purple-600' },
        'Contas': { icon: FileText, gradient: 'from-red-500 to-red-600' },
        'Salário': { icon: Banknote, gradient: 'from-green-500 to-green-600' },
        'Outros': { icon: Package, gradient: 'from-zinc-500 to-zinc-600' }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                        Olá, {userName.split(" ")[0]}
                    </h1>
                    <p className="text-zinc-500">Aqui está o resumo financeiro de hoje.</p>
                </div>

                <div className="flex items-center gap-2">
                    <TransactionDialog spaceId={spaceId || ""} />
                </div>
            </div>

            {/* Cards de KPI - NOVA GRID (4 colunas) - RESPONSIVO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 pb-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-xl rounded-3xl flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-blue-100 font-medium">Disponível</span>
                        <Wallet className="h-6 w-6 text-blue-200" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <div className="text-3xl lg:text-4xl font-bold tracking-tighter leading-tight mb-2 break-words text-wrap balance">
                            R$ {formatCurrency(availableBalance).replace(/^R\$\s?/, '')}
                        </div>
                    </div>
                    <div className="text-sm text-blue-200 bg-white/10 w-fit px-3 py-1 rounded-full mt-auto">
                        Livre para usar
                    </div>
                </Card>

                <Card className="p-6 pb-8 bg-white border-zinc-100 shadow-sm rounded-3xl flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-zinc-500 font-medium">Receitas</span>
                        <div className="p-2 bg-green-50 rounded-full">
                            <ArrowUp className="h-5 w-5 text-green-600" />
                        </div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <div className="text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tighter leading-tight text-left break-words text-wrap balance">
                            R$ {formatCurrency(totalIncome).replace(/^R\$\s?/, '')}
                        </div>
                    </div>
                </Card>

                <Card className="p-6 pb-8 bg-white border-zinc-100 shadow-sm rounded-3xl flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-zinc-500 font-medium">Despesas</span>
                        <div className="p-2 bg-red-50 rounded-full">
                            <TrendingDown className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <div className="text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tighter leading-tight text-left break-words text-wrap balance">
                            R$ {formatCurrency(totalExpense).replace(/^R\$\s?/, '')}
                        </div>
                    </div>
                </Card>

                {/* NOVO CARD: Guardado em Metas */}
                <Card className="p-6 pb-8 bg-gradient-to-br from-purple-600 to-purple-700 text-white border-none shadow-xl rounded-3xl flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-purple-100 font-medium">Em Metas</span>
                        <Target className="h-6 w-6 text-purple-200" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <div className="text-3xl lg:text-4xl font-bold tracking-tighter leading-tight mb-2 break-words text-wrap balance">
                            R$ {formatCurrency(totalInvested).replace(/^R\$\s?/, '')}
                        </div>
                    </div>
                    <Link href="/metas" className="text-sm text-purple-200 hover:text-white underline mt-auto">
                        Ver Metas
                    </Link>
                </Card>
            </div>

            {/* --- CARD DE PREVISÃO (FORECAST) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className={`p-6 border-none shadow-lg rounded-3xl relative overflow-hidden ${forecastStatus === 'danger' ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white' :
                    forecastStatus === 'warning' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                        'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                    }`}>
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <BrainCircuit className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-white/80" />
                            <h3 className="font-semibold text-white/90 uppercase tracking-wider text-xs">Inteligência Preditiva</h3>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Previsão de Fechamento 🔮</h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-white/80 text-sm">Média diária (variáveis)</p>
                                <p className="text-3xl font-bold tracking-tight">{formatCurrency(dailyBurnRate)} <span className="text-sm font-normal text-white/60">/ dia</span></p>
                            </div>

                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                                <p className="text-sm font-medium mb-1">
                                    {forecastStatus === 'danger' ? '⚠️ Cuidado! Vai ficar apertado.' :
                                        forecastStatus === 'warning' ? '👀 Atenção aos gastos.' :
                                            '✅ Ritmo saudável!'}
                                </p>
                                <p className="text-xs text-white/80 leading-relaxed">
                                    Nesse ritmo, suas despesas variáveis fecharão o mês em aprox. <strong className="text-white text-base">{formatCurrency(forecastedSpend)}</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Dicas do Assessor (Ocupa o resto ou move para baixo) */}
                {insights.length > 0 && (
                    <Card className="lg:col-span-2 p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm rounded-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-100 rounded-full">
                                <Lightbulb className="h-5 w-5 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900">Dicas do Assessor</h3>
                        </div>
                        <div className="space-y-3">
                            {insights.map((insight, i) => (
                                <div
                                    key={i}
                                    className={`flex items-start gap-3 p-4 rounded-xl ${insight.type === 'warning' ? 'bg-red-50 border border-red-100' :
                                        insight.type === 'success' ? 'bg-green-50 border border-green-100' :
                                            'bg-blue-50 border border-blue-100'
                                        }`}
                                >
                                    {insight.type === 'warning' && <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />}
                                    {insight.type === 'success' && <Sparkles className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />}
                                    <p className="text-sm font-medium text-zinc-700 leading-relaxed">{insight.message}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>

            {/* Layout Principal: Gráfico + Categorias */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Gráfico de Fluxo */}
                <Card className="lg:col-span-2 p-6 bg-white border-zinc-100 shadow-sm rounded-3xl">
                    <h3 className="text-lg font-semibold mb-6">Fluxo Financeiro</h3>
                    <DashboardChart data={chartData} />
                </Card>

                {/* NOVA SEÇÃO: Top Gastos por Categoria - COM CORES DISTINTAS */}
                <Card className="p-6 bg-white border-zinc-100 shadow-sm rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                        <PieChart className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-bold text-zinc-900">Top Gastos</h3>
                    </div>

                    {topCategories.length > 0 ? (
                        <div className="space-y-5">
                            {topCategories.map((cat, i) => {
                                const percentage = totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0;
                                const config = categoryConfig[cat.category] || categoryConfig['Outros'];
                                const Icon = config.icon;

                                return (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-lg bg-zinc-100">
                                                    <Icon className="w-4 h-4 text-zinc-600" />
                                                </div>
                                                <span className="text-sm font-semibold text-zinc-700">{cat.category}</span>
                                            </div>
                                            <span className="text-sm font-bold text-zinc-900">{formatCurrency(cat.amount)}</span>
                                        </div>
                                        <div className="w-full bg-zinc-100 rounded-full h-2.5">
                                            <div
                                                className={`bg-gradient-to-r ${config.gradient} h-2.5 rounded-full transition-all shadow-sm`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-zinc-400 mt-1.5">{percentage.toFixed(1)}% do total</p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-sm text-zinc-400">Sem despesas registradas</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Lista de Transações Recentes */}
            <Card className="p-6 bg-white border-zinc-100 shadow-sm rounded-3xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-zinc-900">Transações Recentes</h3>
                    <Link href="/dashboard/transactions" className="text-blue-600 text-sm font-medium hover:underline">
                        Ver tudo
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentTransactions && recentTransactions.length > 0 ? (
                        recentTransactions.map((t) => (
                            <div key={t.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-zinc-200 transition-all group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${t.type === 'income' ? 'bg-green-100 group-hover:bg-green-200' : 'bg-red-50 group-hover:bg-red-100'
                                        }`}>
                                        {t.type === 'income' ? (
                                            <ArrowUp className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <Wallet className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900">{t.description}</p>
                                        <p className="text-xs text-zinc-500">{t.category}</p>
                                    </div>
                                </div>
                                <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-zinc-900'
                                    }`}>
                                    {t.type === 'expense' && "- "}{formatCurrency(Number(t.amount))}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <div className="max-w-sm mx-auto space-y-4">
                                <Wallet className="h-12 w-12 text-zinc-300 mx-auto" />
                                <p className="text-zinc-900 font-semibold">Nenhuma transação ainda</p>
                                <p className="text-sm text-zinc-400">Comece a registrar suas finanças para ver o resumo aqui.</p>
                                <TransactionDialog spaceId={spaceId || ""} />
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
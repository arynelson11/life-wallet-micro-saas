"use server";

import { createClient } from "@/lib/supabase/server";

export async function getFinancialSummary(spaceId: string) {
    const supabase = await createClient();

    // Date Range: Current Month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // 1. Transactions (Income/Expense)
    const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("space_id", spaceId)
        .gte("date", startOfMonth.toISOString())
        .lte("date", endOfMonth.toISOString());

    let totalIncome = 0;
    let totalExpenses = 0;
    let fixedExpenses = 0;
    let variableExpenses = 0;

    // Mini Chart Data (Grouped by Week for this month)
    const weeklyIncome = [0, 0, 0, 0];

    transactions?.forEach(t => {
        const amount = Number(t.amount);
        const date = new Date(t.date);

        // Weekly grouping (approximate)
        const day = date.getDate();
        const weekIndex = Math.min(Math.floor((day - 1) / 7), 3);

        if (t.type === 'income') {
            totalIncome += amount;
            weeklyIncome[weekIndex] += amount;
        } else {
            totalExpenses += amount;
            // Simple heuristic for Fixed vs Variable if category isn't explicit
            // For now, let's assume 'Moradia', 'Educação', 'Assinaturas' are fixed
            const fixedCategories = ['Moradia', 'Educação', 'Assinaturas', 'Saúde', 'Seguros'];
            if (fixedCategories.includes(t.category) || t.category === 'Fixa') {
                fixedExpenses += amount;
            } else {
                variableExpenses += amount;
            }
        }
    });

    const incomeChartData = weeklyIncome.map((val, i) => ({ name: `S${i + 1}`, value: val }));

    // 2. Debts
    const { data: debts } = await supabase
        .from("debts")
        .select("*")
        .eq("space_id", spaceId);

    let totalDebt = 0;
    let paidDebt = 0;
    debts?.forEach(d => {
        totalDebt += Number(d.total_amount);
        paidDebt += Number(d.paid_amount);
    });

    // 3. Credit Cards
    const { data: cards } = await supabase
        .from("credit_cards")
        .select("*")
        .eq("space_id", spaceId);

    // 4. Goals (Savings / Assets)
    const { data: goals } = await supabase
        .from("goals")
        .select("*")
        .eq("space_id", spaceId);

    let totalAssets = 0;
    let fixedIncomeAssets = 0;
    let variableIncomeAssets = 0;

    goals?.forEach(g => {
        totalAssets += Number(g.current_amount);
        // Heuristic for asset type based on icon or random reference if not stored
        // Ideally we'd have an 'investment_type' column. For now, flat split or based on title logic
        if (g.title.toLowerCase().includes('ação') || g.title.toLowerCase().includes('fii')) {
            variableIncomeAssets += Number(g.current_amount);
        } else {
            fixedIncomeAssets += Number(g.current_amount);
        }
    });

    return {
        income: totalIncome,
        expenses: totalExpenses,
        fixedExpenses,
        variableExpenses,
        incomeChartData,
        debt: {
            total: totalDebt,
            paid: paidDebt,
            count: debts?.length || 0
        },
        cards: cards?.map(c => ({
            id: c.id,
            name: c.name,
            limit: Number(c.limit_amount),
            // Mock usage calculation since we don't have transaction > card link yet
            used: 0,
            color: c.color
        })) || [],
        assets: {
            total: totalAssets,
            fixed: fixedIncomeAssets,
            variable: variableIncomeAssets,
            goalsCount: goals?.length || 0
        }
    };
}

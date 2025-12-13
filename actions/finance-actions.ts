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

export async function getFullFinancialData(spaceId: string) {
    const supabase = await createClient();

    // Fetch Last 6 Months Transactions for detailed analysis
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("space_id", spaceId)
        .gte("date", sixMonthsAgo.toISOString())
        .order('date', { ascending: false });

    // Fetch All Debts
    const { data: debts } = await supabase
        .from("debts")
        .select("*")
        .eq("space_id", spaceId)
        .order('created_at', { ascending: false });

    // Fetch All Cards
    const { data: cards } = await supabase
        .from("credit_cards")
        .select("*")
        .eq("space_id", spaceId);

    // Fetch All Goals
    const { data: goals } = await supabase
        .from("goals")
        .select("*")
        .eq("space_id", spaceId);

    return {
        transactions: transactions || [],
        debts: debts || [],
        cards: cards?.map(c => ({
            ...c,
            limit: Number(c.limit_amount), // Normalize for frontend
            closingDay: c.closing_day,
            dueDay: c.due_day
        })) || [],
        goals: goals?.map(g => ({
            ...g,
            current: Number(g.current_amount),
            target: Number(g.target_amount)
        })) || []
    };
}

// --- TRANSACTIONS CRUD ---
export async function createTransaction(data: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('transactions').insert(data);
    if (error) {
        console.error("Error creating transaction:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function updateTransaction(id: string, data: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('transactions').update(data).eq('id', id);
    if (error) {
        console.error("Error updating transaction:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function deleteTransaction(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
        console.error("Error deleting transaction:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

// --- DEBTS CRUD ---
export async function createDebt(data: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('debts').insert(data);
    if (error) {
        console.error("Error creating debt:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function updateDebt(id: string, data: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('debts').update(data).eq('id', id);
    if (error) {
        console.error("Error updating debt:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function deleteDebt(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('debts').delete().eq('id', id);
    if (error) {
        console.error("Error deleting debt:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

// --- CREDIT CARDS CRUD ---
export async function createCreditCard(data: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('credit_cards').insert(data);
    if (error) {
        console.error("Error creating card:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function updateCreditCard(id: string, data: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('credit_cards').update(data).eq('id', id);
    if (error) {
        console.error("Error updating card:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function deleteCreditCard(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('credit_cards').delete().eq('id', id);
    if (error) {
        console.error("Error deleting card:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

// --- GOALS CRUD ---
export async function createGoal(data: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('goals').insert(data);
    if (error) {
        console.error("Error creating goal:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function updateGoal(id: string, data: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('goals').update(data).eq('id', id);
    if (error) {
        console.error("Error updating goal:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function deleteGoal(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) {
        console.error("Error deleting goal:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

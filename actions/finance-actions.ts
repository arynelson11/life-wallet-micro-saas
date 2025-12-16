"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getFinancialSummary(spaceId: string) {
    const supabase = await createClient();

    // Date Range: Current Month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // 0. Balance (All Time)
    const { data: allTransactions } = await supabase
        .from("transactions")
        .select("amount, type")
        .eq("space_id", spaceId);

    let totalBalance = 0;
    allTransactions?.forEach(t => {
        if (t.type === 'income') totalBalance += Number(t.amount);
        else totalBalance -= Number(t.amount);
    });

    // 1. Transactions (Income/Expense) - MONTHLY for charts
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

    // Calculate usage from card_transactions
    const { data: cardTx } = await supabase
        .from("card_transactions")
        .select("card_id, amount")
        .eq("space_id", spaceId)
        .eq("status", "pending");

    const cardUsage: Record<string, number> = {};
    cardTx?.forEach(t => {
        cardUsage[t.card_id] = (cardUsage[t.card_id] || 0) + Number(t.amount);
    });

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

    // 5. Investments (New Table)
    const { data: investments } = await supabase
        .from("investments")
        .select("*")
        .eq("space_id", spaceId);

    let totalInvested = 0;
    let fixedIncomeInvested = 0;
    let variableIncomeInvested = 0;

    investments?.forEach(i => {
        // Safe access: Use unit_price if available, else amount. Use quantity if available, else 1.
        // Also handle legacy 'amount' which might represent total if quantity is missing.
        const qty = Number(i.quantity) || 1;
        const val = Number(i.unit_price || i.amount) || 0;

        // If we really migrated to unit_price * quantity, strict logic:
        const amount = val * qty;
        totalInvested += amount;

        // Verify if category matches Fixed Income
        const cat = (i.category || i.type || '').toLowerCase(); // Fallback safely

        // Heuristic for Fixed Income
        if (['lci', 'lca', 'cdb', 'tesouro', 'renda fixa', 'fixa'].some(t => cat.includes(t))) {
            fixedIncomeInvested += amount;
        } else {
            variableIncomeInvested += amount;
        }
    });

    return {
        balance: totalBalance,
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
            used: cardUsage?.[c.id] || 0,
            color: c.color
        })) || [],
        assets: {
            total: totalAssets, // Keep this as Goals Total
            fixed: fixedIncomeAssets,
            variable: variableIncomeAssets,
            goalsCount: goals?.length || 0
        },
        investments: {
            total: totalInvested,
            fixed: fixedIncomeInvested,
            variable: variableIncomeInvested,
            count: investments?.length || 0
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

    // Sanitize payload to remove undefined fields if any
    const payload = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined && v !== null && v !== "")
    );

    try {
        const { error } = await supabase.from('transactions').insert(payload);

        if (error) {
            console.error("Error creating transaction:", error);
            // Check for potential schema mismatch
            if (error.code === '42703') { // Undefined column
                return { success: false, error: "Erro de Esquema: Coluna não encontrada. Execute o script SQL de atualização." };
            }
            return { success: false, error: error.message };
        }
        return { success: true };
    } catch (err) {
        console.error("Unexpected error in createTransaction:", err);
        return { success: false, error: "Erro inesperado ao criar transação." };
    }
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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Usuário não autenticado" };

    const payload = {
        ...data,
        user_id: user.id
    };

    const { error } = await supabase.from('credit_cards').insert(payload);
    if (error) {
        console.error("Error creating card:", error);
        return { success: false, error: error.message };
    }
    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateCreditCard(id: string, data: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('credit_cards').update(data).eq('id', id);
    if (error) {
        console.error("Error updating card:", error);
        return { success: false, error: error.message };
    }
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteCreditCard(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('credit_cards').delete().eq('id', id);
    if (error) {
        console.error("Error deleting card:", error);
        return { success: false, error: error.message };
    }
    revalidatePath("/dashboard");
    return { success: true };
}

// --- GOALS CRUD ---
// --- GOALS CRUD ---
export async function createGoal(data: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('goals').insert(data);
    if (error) {
        console.error("Error creating goal:", error);
        return { success: false, error: error.message };
    }
    revalidatePath("/metas");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateGoal(id: string, data: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('goals').update(data).eq('id', id);
    if (error) {
        console.error("Error updating goal:", error);
        return { success: false, error: error.message };
    }
    revalidatePath("/metas");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteGoal(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) {
        console.error("Error deleting goal:", error);
        return { success: false, error: error.message };
    }
    revalidatePath("/metas");
    revalidatePath("/dashboard");
    return { success: true };
}

// --- CARD TRANSACTIONS CRUD ---
export async function createCardTransaction(data: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Usuário não autenticado" };

    // Ensure numeric amount, add user_id, and map date -> transaction_date
    const { date, ...rest } = data;

    const payload = {
        ...rest,
        amount: Number(data.amount),
        user_id: user.id,
        transaction_date: date
    };

    const { error } = await supabase.from('card_transactions').insert(payload);
    if (error) {
        console.error("Error creating card transaction:", error);
        return { success: false, error: error.message };
    }
    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateCardTransaction(id: string, data: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('card_transactions').update(data).eq('id', id);
    if (error) {
        console.error("Error updating card transaction:", error);
        return { success: false, error: error.message };
    }
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteCardTransaction(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('card_transactions').delete().eq('id', id);
    if (error) {
        console.error("Error deleting card transaction:", error);
        return { success: false, error: error.message };
    }
    revalidatePath("/dashboard");
    return { success: true };
}

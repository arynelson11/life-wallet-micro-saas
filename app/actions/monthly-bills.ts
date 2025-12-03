'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function generateMonthlyBillsForFixedBill(fixedBillId: string, spaceId: string) {
    const supabase = await createClient();

    // 1. Get Fixed Bill Details
    const { data: fixedBill } = await supabase
        .from("fixed_bills")
        .select("*")
        .eq("id", fixedBillId)
        .single();

    if (!fixedBill) return;

    // 2. Generate for Current Month + Next 12 Months
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    for (let i = 0; i < 13; i++) {
        const targetDate = new Date(currentYear, currentMonth + i, 1);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth();

        // Calculate Due Date
        // Handle edge cases (e.g. due_day 31 in Feb)
        const maxDaysInMonth = new Date(year, month + 1, 0).getDate();
        const finalDay = Math.min(fixedBill.due_day, maxDaysInMonth);
        const dueDate = new Date(year, month, finalDay);
        const dueDateString = dueDate.toISOString().split('T')[0];

        // Check if already exists
        const { data: existing } = await supabase
            .from("monthly_bills")
            .select("id")
            .eq("fixed_bill_id", fixedBillId)
            .gte("due_date", new Date(year, month, 1).toISOString().split('T')[0])
            .lte("due_date", new Date(year, month + 1, 0).toISOString().split('T')[0])
            .maybeSingle();

        if (!existing) {
            await supabase.from("monthly_bills").insert({
                fixed_bill_id: fixedBillId,
                title: fixedBill.title,
                amount: fixedBill.amount,
                due_date: dueDateString,
                status: 'pending',
                description: fixedBill.description,
                space_id: spaceId
            });
        }
    }
}

export async function getMonthlyBills(start: string, end: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Get Space
    const { data: spaceMember } = await supabase
        .from("space_members")
        .select("space_id")
        .eq("user_id", user.id)
        .single();

    let spaceId = spaceMember?.space_id;
    if (!spaceId) {
        const { data: personalSpace } = await supabase
            .from("spaces")
            .select("id")
            .eq("owner_id", user.id)
            .single();
        spaceId = personalSpace?.id;
    }

    if (!spaceId) return [];

    const { data } = await supabase
        .from("monthly_bills")
        .select(`
            *,
            fixed_bills (
                category
            )
        `)
        .eq("space_id", spaceId)
        .gte("due_date", start)
        .lte("due_date", end)
        .order("due_date", { ascending: true });

    return data || [];
}

export async function updateMonthlyBill(id: string, updates: { status?: 'pending' | 'paid', amount?: number, observation?: string }) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("monthly_bills")
        .update(updates)
        .eq("id", id);

    if (error) throw new Error("Erro ao atualizar conta mensal");

    revalidatePath("/calendario");
    return { success: true };
}

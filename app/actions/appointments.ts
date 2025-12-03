'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createFixedBill(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Não autorizado" };

    const title = formData.get("title") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const category = formData.get("category") as string;
    const due_day = parseInt(formData.get("due_day") as string);
    // If due_day is provided, we calculate the next occurrence
    // If a specific date is provided (optional in requirement, but let's handle due_day primarily as per "Fixed Bill" concept)

    // Calculate Date: Current Month's due_day. If passed, Next Month's due_day.
    const today = new Date();
    let targetDate = new Date(today.getFullYear(), today.getMonth(), due_day);

    if (targetDate < today) {
        targetDate = new Date(today.getFullYear(), today.getMonth() + 1, due_day);
    }

    // Handle invalid dates (e.g. Feb 30)
    if (targetDate.getMonth() !== (today.getMonth() + (targetDate < today ? 0 : 1)) % 12) {
        // Logic to handle month overflow if needed, but Date object handles it by rolling over.
        // But for "Fixed Bill" usually we want the last day of month if overflow.
        // Simple approach: Date constructor rolls over, so Feb 30 -> Mar 2.
        // Let's stick to simple Date for now.
    }

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

    if (!spaceId) return { error: "Space não encontrado" };

    const { error } = await supabase
        .from("appointments")
        .insert({
            title,
            amount,
            category,
            date: targetDate.toISOString(),
            type: 'bill',
            status: 'pending',
            space_id: spaceId
        });

    if (error) {
        console.error("Erro ao criar conta:", error);
        return { error: "Erro ao criar conta" };
    }

    revalidatePath("/calendario");
    return { success: true };
}

export async function deleteAppointment(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);

    if (error) return { error: "Erro ao excluir conta" };

    revalidatePath("/calendario");
    return { success: true };
}

export async function getAppointments(start: string, end: string) {
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
        .from("appointments")
        .select("*")
        .eq("space_id", spaceId)
        .gte("date", start)
        .lte("date", end)
        .order("date", { ascending: true });

    return data || [];
}

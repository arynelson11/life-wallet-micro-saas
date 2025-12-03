'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateMonthlyBillsForFixedBill } from "./monthly-bills";

export async function createFixedBill(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Não autorizado" };

    const title = formData.get("title") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const category = formData.get("category") as string;
    const due_day = parseInt(formData.get("due_day") as string);
    const description = formData.get("description") as string;

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

    // 1. Create Fixed Bill
    const { data: fixedBill, error } = await supabase
        .from("fixed_bills")
        .insert({
            title,
            amount,
            category,
            due_day,
            description,
            space_id: spaceId,
            is_active: true
        })
        .select()
        .single();

    if (error) {
        console.error("Erro ao criar conta fixa:", error);
        return { error: "Erro ao criar conta fixa" };
    }

    // 2. Generate Monthly Bills (Current + Next 12 months)
    await generateMonthlyBillsForFixedBill(fixedBill.id, spaceId);

    revalidatePath("/calendario");
    return { success: true };
}

export async function updateFixedBill(fixedBillId: string, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const category = formData.get("category") as string;
    const due_day = parseInt(formData.get("due_day") as string);
    const description = formData.get("description") as string;

    // 1. Update Fixed Bill
    const { data: fixedBill, error } = await supabase
        .from("fixed_bills")
        .update({
            title,
            amount,
            category,
            due_day,
            description,
            updated_at: new Date().toISOString()
        })
        .eq("id", fixedBillId)
        .select()
        .single();

    if (error) return { error: "Erro ao atualizar conta fixa" };

    // 2. Update FUTURE Monthly Bills (Pending only)
    // We update title, amount, and recalculate due_date based on new due_day
    // But we only touch 'pending' bills to avoid changing history

    // First, find future pending bills
    const today = new Date().toISOString().split('T')[0];

    const { data: futureBills } = await supabase
        .from("monthly_bills")
        .select("*")
        .eq("fixed_bill_id", fixedBillId)
        .eq("status", "pending")
        .gte("due_date", today);

    if (futureBills) {
        for (const bill of futureBills) {
            // Recalculate due date for this month/year
            const billDate = new Date(bill.due_date);
            const newDueDate = new Date(billDate.getFullYear(), billDate.getMonth(), due_day);

            // Adjust if day doesn't exist (e.g. Feb 30 -> Feb 28)
            if (newDueDate.getMonth() !== billDate.getMonth()) {
                newDueDate.setDate(0); // Set to last day of previous month (which is the correct month)
            }

            await supabase
                .from("monthly_bills")
                .update({
                    title,
                    amount,
                    due_date: newDueDate.toISOString().split('T')[0],
                    description
                })
                .eq("id", bill.id);
        }
    }

    revalidatePath("/calendario");
    return { success: true };
}

export async function deleteFixedBill(fixedBillId: string) {
    const supabase = await createClient();

    // Delete fixed bill (cascade will delete monthly bills)
    // OR we can just set is_active = false to keep history?
    // User asked to "delete" usually implies removing, but for financial apps, soft delete is better.
    // However, the prompt implies full control. Let's Soft Delete (Deactivate) by default or Hard Delete if requested?
    // Let's go with Hard Delete for now as per "cascade" in migration, but maybe user wants to keep history?
    // "Editar conta fixa base: atualizar todos os meses FUTUROS, NÃO mudar meses passados"
    // If we delete, we lose past history if we cascade.
    // So we should probably just delete FUTURE monthly bills and mark fixed bill as inactive?

    // Let's implement "Archive" (Deactivate) logic instead of Delete for safety
    const { error } = await supabase
        .from("fixed_bills")
        .update({ is_active: false })
        .eq("id", fixedBillId);

    if (error) return { error: "Erro ao arquivar conta" };

    // Delete FUTURE pending bills
    const today = new Date().toISOString().split('T')[0];
    await supabase
        .from("monthly_bills")
        .delete()
        .eq("fixed_bill_id", fixedBillId)
        .eq("status", "pending")
        .gte("due_date", today);

    revalidatePath("/calendario");
    return { success: true };
}

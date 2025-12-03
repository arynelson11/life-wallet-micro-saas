'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createManualReminder(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "Usuário não autenticado" };
    }

    const title = (formData.get("title") || formData.get("description")) as string;
    const date = formData.get("date") as string; // YYYY-MM-DD
    const amount = formData.get("amount") ? Number(formData.get("amount")) : null;

    if (!title || !date) {
        return { success: false, message: "Descrição e data são obrigatórios" };
    }

    // Get user's space
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

    if (!spaceId) {
        return { success: false, message: "Espaço não encontrado" };
    }

    // Determine type based on amount
    const type = amount && amount > 0 ? 'bill' : 'task';

    const { error } = await supabase.from("appointments").insert({
        title: title,
        date: date,
        type: type,
        amount: amount,
        space_id: spaceId,
        status: 'pending'
    });

    if (error) {
        console.error("Erro ao criar lembrete:", error);
        return { success: false, message: "Erro ao criar lembrete" };
    }

    revalidatePath("/calendario");
    revalidatePath("/dashboard");
    return { success: true, message: "Lembrete criado com sucesso!" };
}

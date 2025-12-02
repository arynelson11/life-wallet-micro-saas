'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createManualReminder(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "Usuário não autenticado" };
    }

    const description = formData.get("description") as string;
    const date = formData.get("date") as string; // YYYY-MM-DD
    const amount = formData.get("amount") ? Number(formData.get("amount")) : 0;

    if (!description || !date) {
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

    const { error } = await supabase.from("transactions").insert({
        description: `Lembrete: ${description}`,
        amount: amount, // Se for despesa, deveria ser negativo? O usuário pediu "valor (opcional)". Vou assumir que é despesa.
        type: 'expense',
        date: date,
        category: 'Outros', // Categoria padrão
        space_id: spaceId,
        user_id: user.id,
        is_paid: false // Lembretes geralmente não estão pagos
    });

    if (error) {
        console.error("Erro ao criar lembrete:", error);
        return { success: false, message: "Erro ao criar lembrete" };
    }

    revalidatePath("/calendario");
    revalidatePath("/dashboard");
    return { success: true, message: "Lembrete criado com sucesso!" };
}

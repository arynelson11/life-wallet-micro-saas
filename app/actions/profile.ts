'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const fullName = formData.get("fullName") as string;

    // Tenta atualizar primeiro (mais seguro com RLS de Update)
    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: fullName,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

    if (error) {
        console.error("Erro ao atualizar perfil:", error);
        throw new Error("Erro ao salvar nome.");
    }

    // Atualiza todas as páginas para mostrar o nome novo
    revalidatePath('/', 'layout');
}
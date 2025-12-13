"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPersonalSpace() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Usuário não autenticado." };
    }

    try {
        // Double check if space already exists to avoid duplicates
        const { data: existingSpace } = await supabase
            .from('spaces')
            .select('id')
            .eq('owner_id', user.id)
            .single();

        if (existingSpace) {
            return { success: true, message: "Espaço já existe." };
        }

        const { data: newSpace, error } = await supabase
            .from('spaces')
            .insert({
                name: 'Minha Carteira',
                type: 'PERSONAL',
                owner_id: user.id
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating space:", error);
            return { success: false, error: "Erro ao criar carteira. Tente novamente." };
        }

        // Add user as admin (redundant if trigger exists, but safe)
        const { error: memberError } = await supabase
            .from('space_members')
            .insert({
                space_id: newSpace.id,
                user_id: user.id,
                role: 'admin'
            });

        if (memberError) {
            console.error("Error adding member:", memberError);
            // Non-critical, trigger usually handles this or RLS allows owner access
        }

        revalidatePath("/dashboard");
        return { success: true };

    } catch (e) {
        console.error("Unexpected error:", e);
        return { success: false, error: "Erro inesperado." };
    }
}

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
        // 0. SELF-HEALING: Ensure Profile Exists
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

        if (!profile) {
            console.log("⚠️ Profile missing. Creating now...");
            const { error: profileError } = await supabase.from('profiles').insert({
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                avatar_url: user.user_metadata?.avatar_url
            });
            if (profileError) {
                console.error("Error creating profile:", profileError);
            }
        }

        // 1. Double check if space already exists
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
            return { success: false, error: error.message || "Erro ao criar carteira." };
        }

        const { error: memberError } = await supabase
            .from('space_members')
            .insert({
                space_id: newSpace.id,
                user_id: user.id,
                role: 'admin'
            });

        if (memberError) {
            console.error("Error adding member:", memberError);
        }

        revalidatePath("/dashboard");
        return { success: true };

    } catch (e) {
        console.error("Unexpected error:", e);
        return { success: false, error: "Erro inesperado." };
    }
}

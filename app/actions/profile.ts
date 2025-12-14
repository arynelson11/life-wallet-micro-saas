"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Usuário não autenticado");
    }

    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    // Avatar logic: We will assume for now we might get a URL string if implemented, 
    // but clearly user asked for fix on "Save Changes".

    const updates: any = {
        updated_at: new Date().toISOString(),
    };

    if (fullName) updates.full_name = fullName;
    if (phone) updates.phone = phone;

    const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

    if (error) {
        console.error("Profile update error:", error);
        throw new Error(`Erro ao atualizar perfil: ${error.message}`);
    }

    revalidatePath("/settings");
}
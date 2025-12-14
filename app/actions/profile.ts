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
    const avatarUrl = formData.get("avatarUrl") as string;

    const updates: any = {
        updated_at: new Date().toISOString(),
    };

    if (fullName) updates.full_name = fullName;
    if (phone) updates.phone = phone;
    if (avatarUrl) updates.avatar_url = avatarUrl; // Save URL if present

    // Use Upsert to handle cases where profile might not exist
    const { error } = await supabase
        .from("profiles")
        .upsert({
            id: user.id,
            email: user.email, // Required for new inserts
            updated_at: new Date().toISOString(),
            ...updates
        });

    if (error) {
        console.error("Profile update error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");

    return { success: true };
}
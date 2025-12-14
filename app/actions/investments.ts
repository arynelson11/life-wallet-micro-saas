"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAsset(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const space_id = formData.get("space_id") as string;

    // New fields
    const ticker = formData.get("ticker") as string;
    const quantity = parseFloat(formData.get("quantity") as string);
    const unit_price = parseFloat(formData.get("unit_price") as string);
    const purchase_date = formData.get("purchase_date") as string;

    const { error } = await supabase
        .from("investments")
        .insert({
            name,
            category,
            amount,
            space_id,
            ticker,
            quantity,
            unit_price,
            purchase_date
        });

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/dashboard");
}

export async function deleteAsset(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("investments")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/dashboard");
}

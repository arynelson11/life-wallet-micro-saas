"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAsset(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const space_id = formData.get("space_id") as string;

    // New fields: Normalize Ticker (Trim + Upper)
    const rawTicker = formData.get("ticker") as string;
    const ticker = rawTicker ? rawTicker.trim().toUpperCase() : null;

    const quantity = parseFloat(formData.get("quantity") as string);
    const unit_price = parseFloat(formData.get("unit_price") as string);
    const purchase_date = formData.get("purchase_date") as string;

    // Calculate total amount for this transaction
    const transactionAmount = quantity * unit_price;

    // 1. Check if asset exists with the same Ticker (if ticker provided)
    if (ticker) {
        const { data: existingAsset } = await supabase
            .from("investments")
            .select("*")
            .eq("space_id", space_id)
            .eq("ticker", ticker)
            .maybeSingle();

        if (existingAsset) {
            // --- CONSOLIDATION LOGIC (Average Price) ---

            const currentQty = Number(existingAsset.quantity) || 0;
            const currentTotalValue = Number(existingAsset.amount) || 0;

            // Calculate New Totals
            const newTotalQty = currentQty + quantity;
            const newTotalValue = currentTotalValue + transactionAmount;

            // Calculate New Average Price
            const newAveragePrice = newTotalQty > 0 ? (newTotalValue / newTotalQty) : 0;

            // Update Existing Asset
            const { error } = await supabase
                .from("investments")
                .update({
                    quantity: newTotalQty,
                    amount: newTotalValue,
                    unit_price: newAveragePrice,
                    name: name || existingAsset.name,
                    category: category || existingAsset.category
                })
                .eq("id", existingAsset.id);

            if (error) throw new Error(error.message);

            revalidatePath("/dashboard");
            return;
        }
    }

    // 2. If not exists or no ticker, Insert New
    const { error } = await supabase
        .from("investments")
        .insert({
            name,
            category,
            amount: transactionAmount, // Store Total Value in 'amount'
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

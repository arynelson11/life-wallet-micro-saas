"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAsset(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const space_id = formData.get("space_id") as string;

    // New fields
    const ticker = (formData.get("ticker") as string)?.toUpperCase();
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
            .eq("space_id", space_id) // Fix: space_id variable name was missing locally
            .eq("ticker", ticker)
            .maybeSingle(); // Use maybeSingle to avoid error if not found

        if (existingAsset) {
            // --- CONSOLIDATION LOGIC (Average Price) ---

            const currentQty = Number(existingAsset.quantity) || 0;
            const currentTotalValue = Number(existingAsset.amount) || 0; // Assuming 'amount' stores total value

            // Calculate New Totals
            const newTotalQty = currentQty + quantity;
            const newTotalValue = currentTotalValue + transactionAmount;

            // Calculate New Average Price
            // Avoid division by zero
            const newAveragePrice = newTotalQty > 0 ? (newTotalValue / newTotalQty) : 0;

            // Update Existing Asset
            const { error } = await supabase
                .from("investments")
                .update({
                    quantity: newTotalQty,
                    amount: newTotalValue,
                    unit_price: newAveragePrice, // Update to new Average Price
                    // We don't update purchase_date to keep the original or maybe last update? 
                    // Usually PM doesn't change date, but let's leave it as is.
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

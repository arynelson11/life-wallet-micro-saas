import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { InvestmentSummary } from "@/components/investments/InvestmentSummary";
import { AssetList } from "@/components/investments/AssetList";
import { AddAssetModal } from "@/components/investments/AddAssetModal";
import { InvestmentTips } from "@/components/investments/InvestmentTips";
import { deleteAsset } from "@/app/actions/investments";

export default async function MetasPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Fetch Space ID
    let spaceId = "";
    const { data: member } = await supabase
        .from("space_members")
        .select("space_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (member) {
        spaceId = member.space_id;
    } else {
        const { data: owner } = await supabase
            .from("spaces")
            .select("id")
            .eq("owner_id", user.id)
            .maybeSingle();
        if (owner) spaceId = owner.id;
    }

    // Fetch Assets (Investments) with Error Handling for missing table
    let assets = [];
    try {
        const { data, error } = await supabase
            .from("investments")
            .select("*")
            .eq("space_id", spaceId)
            .order("amount", { ascending: false });

        if (!error && data) {
            assets = data;
        }
    } catch (e) {
        console.error("Investments table might not exist yet.");
    }

    return (
        <div className="max-w-[1600px] mx-auto">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-8 pt-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span>Economias</span>
                    </div>
                    <h1 className="text-3xl font-bold text-black tracking-tight">
                        Meus Investimentos
                    </h1>
                </div>
                {/* Manual Entry Button */}
                <AddAssetModal spaceId={spaceId} />
            </div>

            {/* Dashboard Content */}
            <div className="space-y-8">
                {/* 1. Summary & Charts */}
                <InvestmentSummary assets={assets} />

                {/* 2. Asset List Table */}
                <AssetList assets={assets} onDelete={deleteAsset} />

                {/* 3. Education/Tips */}
                <InvestmentTips />
            </div>
        </div>
    );
}
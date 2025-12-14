"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { InvestmentSummary } from "@/components/investments/InvestmentSummary";
import { AssetList } from "@/components/investments/AssetList";
import { AddAssetModal } from "@/components/investments/AddAssetModal";
import { InvestmentTips } from "@/components/investments/InvestmentTips";
import { deleteAsset } from "@/app/actions/investments";
import { Loader2 } from "lucide-react";

interface InvestmentsViewProps {
    spaceId: string;
}

export function InvestmentsView({ spaceId }: InvestmentsViewProps) {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchAssets = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("investments")
                .select("*")
                .eq("space_id", spaceId)
                .order("amount", { ascending: false });

            if (data) setAssets(data);
        } catch (e) {
            console.error("Error fetching investments:", e);
        } finally {
            setLoading(false);
        }
    }, [spaceId, supabase]);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    const handleDelete = async (id: string) => {
        try {
            await deleteAsset(id);
            // After server action, refresh local data
            fetchAssets();
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Meus Investimentos</h2>
                <AddAssetModal spaceId={spaceId} onSuccess={fetchAssets} />
            </div>

            <InvestmentSummary assets={assets} />
            <AssetList assets={assets} onDelete={handleDelete} />
            <InvestmentTips assets={assets} />
        </div>
    );
}

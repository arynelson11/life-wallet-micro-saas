import { useState } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssetDetailsModal } from "@/components/investments/AssetDetailsModal";

interface Asset {
    id: string;
    name: string;
    category: string;
    amount: number;
    // Add missing fields for details modal
    quantity: number;
    unit_price: number;
    ticker?: string;
}

interface AssetListProps {
    assets: Asset[];
    onDelete: (id: string) => void;
    // We already passed onSuccess logic via parent re-fetch, but AssetList also triggers onDelete. 
    // The Modal handles its own updates via server action then calls onSuccess.
    // Ideally AssetList should also accept `onUpdate` or similar to bubble up changes from Modal if needed.
    // Parent InvestmentsView listens to changes. We should pass a callback prop `onAssetUpdate`?
    // Actually, `InvestmentsView` passes `onDelete` which calls `deleteAsset` then `fetchAssets`.
    // Let's assume we can pass `onSuccess` callback to AssetList to pass to Modal.
    onAssetUpdate?: () => void;
}

export function AssetList({ assets, onDelete, onAssetUpdate }: AssetListProps) {
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [openDetails, setOpenDetails] = useState(false);

    const handleRowClick = (asset: Asset) => {
        setSelectedAsset(asset);
        setOpenDetails(true);
    };

    const handleModalSuccess = () => {
        if (onAssetUpdate) onAssetUpdate();
    };

    // Wrapper for delete to avoid bubbling click event to row
    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        onDelete(id);
    };

    return (
        <>
            <div className="glass-panel overflow-hidden rounded-[2.5rem]">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white">Meus Ativos</h3>
                </div>

                <div className="w-full text-left">
                    {/* MOBILE LIST VIEW */}
                    <div className="md:hidden space-y-3 px-4 pb-4">
                        {assets.map((asset) => (
                            <div
                                key={asset.id}
                                onClick={() => handleRowClick(asset)}
                                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center active:scale-[0.98] transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-primary font-bold text-xs border border-white/5">
                                        {asset.ticker ? asset.ticker.substring(0, 2) : asset.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm truncate max-w-[120px]">{asset.name}</h4>
                                        <span className="text-[10px] items-center px-2 py-0.5 rounded-full bg-black/20 text-zinc-400 border border-white/5">
                                            {asset.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary text-base">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(asset.amount)}
                                    </p>
                                    {asset.quantity > 0 && <p className="text-xs text-zinc-500">{asset.quantity} un.</p>}
                                </div>
                            </div>
                        ))}
                        {assets.length === 0 && (
                            <div className="text-center text-zinc-500 py-10 border-2 border-dashed border-zinc-800 rounded-2xl">
                                Nenhum ativo encontrado.
                            </div>
                        )}
                    </div>

                    {/* DESKTOP TABLE VIEW */}
                    <table className="hidden md:table w-full">
                        <thead className="bg-white/5 text-xs uppercase text-zinc-500 font-medium">
                            <tr>
                                <th className="px-6 py-4 text-left">Ativo</th>
                                <th className="px-6 py-4 text-left">Categoria</th>
                                <th className="px-6 py-4 text-right">Valor Atual</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {assets.map((asset) => (
                                <tr
                                    key={asset.id}
                                    onClick={() => handleRowClick(asset)}
                                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4 font-medium text-white group-hover:text-primary transition-colors">
                                        {asset.name}
                                        {asset.ticker && <span className="ml-2 text-xs text-zinc-500 font-normal">{asset.ticker}</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300 border border-white/5">
                                            {asset.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-primary">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(asset.amount)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                                                    onClick={(e) => e.stopPropagation()} // Stop propagation
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#111] border-zinc-800">
                                                <DropdownMenuItem
                                                    onClick={(e) => handleDeleteClick(e, asset.id)}
                                                    className="text-red-500 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}

                            {assets.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                        Nenhum investimento cadastrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AssetDetailsModal
                asset={selectedAsset}
                open={openDetails}
                onOpenChange={setOpenDetails}
                onSuccess={handleModalSuccess}
            />
        </>
    );
}

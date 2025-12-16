"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CalendarIcon, Edit2, Trash2, TrendingUp, Wallet, ArrowUpRight, RefreshCw } from "lucide-react";
import { updateAsset, deleteAsset } from "@/app/actions/investments";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Reuse Asset Type
interface Asset {
    id: string;
    name: string;
    category: string;
    amount: number;
    quantity: number;
    unit_price: number;
    ticker?: string;
}

interface AssetDetailsModalProps {
    asset: Asset | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

// Mock Price Fetcher (Duplicated from AddAssetModal for independence)
const mockFetchPrice = async (ticker: string) => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Returns random realistic prices based on ticker pattern
    const t = ticker.toUpperCase();
    if (t.includes("BTC")) return 350000 + Math.random() * 5000;
    if (t.includes("ETH")) return 12000 + Math.random() * 500;
    if (t.includes("11")) return 90 + Math.random() * 20; // FIIs usually around 100
    if (t.length === 5 && t.endsWith("4")) return 30 + Math.random() * 10; // Stocks
    if (t.length === 5 && t.endsWith("3")) return 30 + Math.random() * 10; // Stocks

    return 100 + Math.random() * 50; // Fallback
};

export function AssetDetailsModal({ asset, open, onOpenChange, onSuccess }: AssetDetailsModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("contribution");
    const router = useRouter();

    // Contribution State
    const [addedQuantity, setAddedQuantity] = useState("");
    const [pricePaid, setPricePaid] = useState("");
    const [isFetchingPrice, setIsFetchingPrice] = useState(false);

    // Edit State
    const [editName, setEditName] = useState(asset?.name || "");
    const [editCategory, setEditCategory] = useState(asset?.category || "");

    // Effect to update local state when asset prop changes (if modal re-opens with new asset)
    useEffect(() => {
        if (asset) {
            setEditName(asset.name);
            setEditCategory(asset.category);
        }
    }, [asset]);

    // Auto-Fetch Price when Tab becomes "contribution" OR when modal opens if activeTab is 'contribution'
    useEffect(() => {
        if (open && activeTab === "contribution" && asset?.ticker) {
            handleAutoFetchPrice();
        }
    }, [open, activeTab, asset?.ticker]);

    const handleAutoFetchPrice = async () => {
        if (!asset?.ticker) return;

        setIsFetchingPrice(true);
        try {
            const price = await mockFetchPrice(asset.ticker);
            setPricePaid(price.toFixed(2));
            // Optional: toast.info(`Preço atual carregado: R$ ${price.toFixed(2)}`);
        } catch (e) {
            console.error(e);
        } finally {
            setIsFetchingPrice(false);
        }
    };

    if (!asset) return null;

    const handleContribution = async (formData: FormData) => {
        setIsLoading(true);
        try {
            formData.append("id", asset.id);
            formData.append("type", "contribution");
            await updateAsset(formData);

            toast.success("Aporte registrado com sucesso!");

            // Refresh flow
            router.refresh();
            if (onSuccess) onSuccess();

            onOpenChange(false);

            // Reset fields
            setAddedQuantity("");
            setPricePaid("");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao registrar aporte.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            formData.append("id", asset.id);
            formData.append("type", "edit");
            await updateAsset(formData);
            toast.success("Ativo atualizado!");

            router.refresh();
            if (onSuccess) onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao atualizar.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Tem certeza que deseja excluir este ativo?")) return;
        setIsLoading(true);
        try {
            await deleteAsset(asset.id);
            toast.success("Ativo excluído.");

            router.refresh();
            if (onSuccess) onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao excluir.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-screen h-screen sm:w-full sm:h-auto sm:max-w-2xl rounded-none sm:rounded-[2rem] border-white/10 bg-[#09090b] text-white p-0 overflow-y-auto sm:overflow-hidden">

                {/* Header Section */}
                <div className="bg-zinc-900/50 border-b border-white/5 p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-white/5 uppercase tracking-wider">
                                    {asset.category}
                                </span>
                                {asset.ticker && (
                                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                                        {asset.ticker}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-1">{asset.name}</h2>
                            <p className="text-zinc-400 text-sm flex items-center gap-2">
                                {asset.quantity} cotas • PM: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(asset.unit_price)}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => setActiveTab("edit")} className="rounded-full border-zinc-800 bg-black/50 hover:bg-zinc-800 text-zinc-400 hover:text-white">
                                <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleDelete} className="rounded-full border-zinc-800 bg-black/50 hover:bg-red-500/10 text-zinc-400 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-panel p-4 rounded-xl bg-black/20 border-white/5">
                            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Total Investido</p>
                            <p className="text-2xl font-bold text-white tracking-tight">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(asset.amount)}
                            </p>
                        </div>
                        <div className="glass-panel p-4 rounded-xl bg-black/20 border-white/5 flex flex-col justify-center items-start">
                            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Status</p>
                            <div className="flex items-center gap-1 text-zinc-300 text-sm font-medium">
                                <Wallet className="w-4 h-4 text-zinc-500" />
                                <span>Em Carteira</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Actions */}
                <div className="p-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="bg-zinc-900/50 p-1 h-12 rounded-xl w-full grid grid-cols-2 mb-8">
                            <TabsTrigger value="contribution" className="rounded-lg h-10 data-[state=active]:bg-primary data-[state=active]:text-black font-medium transition-all">
                                <ArrowUpRight className="w-4 h-4 mr-2" />
                                Novo Aporte
                            </TabsTrigger>
                            <TabsTrigger value="edit" className="rounded-lg h-10 data-[state=active]:bg-zinc-800 data-[state=active]:text-white font-medium transition-all">
                                <Edit2 className="w-4 h-4 mr-2" />
                                Editar Detalhes
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="contribution" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <form action={handleContribution} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400">Data do Aporte</Label>
                                        <div className="relative">
                                            <Input
                                                name="date"
                                                type="date"
                                                defaultValue={new Date().toISOString().split('T')[0]}
                                                className="h-12 rounded-xl bg-zinc-900 border-zinc-800 focus:ring-primary pl-10"
                                            />
                                            <CalendarIcon className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400">Qtd. Comprada</Label>
                                        <Input
                                            name="added_quantity"
                                            type="number"
                                            step="any"
                                            placeholder="0"
                                            required
                                            value={addedQuantity}
                                            onChange={(e) => setAddedQuantity(e.target.value)}
                                            className="h-12 rounded-xl bg-zinc-900 border-zinc-800 focus:ring-primary text-right"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400 flex items-center justify-between">
                                        Preço Pago por Unidade (R$)
                                        {isFetchingPrice && <span className="text-[10px] text-zinc-500 animate-pulse">Buscando...</span>}
                                        {!isFetchingPrice && asset.ticker && <span className="text-[10px] text-primary flex items-center gap-1 cursor-pointer" onClick={handleAutoFetchPrice}><RefreshCw className="w-3 h-3" /> Atualizar Cotação</span>}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            name="price_paid"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            required
                                            value={pricePaid}
                                            onChange={(e) => setPricePaid(e.target.value)}
                                            className="h-12 rounded-xl bg-zinc-900 border-zinc-800 focus:ring-primary text-right font-mono text-lg"
                                        />
                                        {isFetchingPrice && (
                                            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-zinc-500" />
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-500 text-right">
                                        Total do Aporte: R$ {((parseFloat(addedQuantity) || 0) * (parseFloat(pricePaid) || 0)).toFixed(2)}
                                    </p>
                                </div>

                                <Button disabled={isLoading} type="submit" className="w-full bg-primary text-black hover:bg-primary/90 font-bold h-14 text-lg rounded-xl shadow-lg shadow-primary/20 mt-4">
                                    {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : "Confirmar Aporte"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="edit" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <form action={handleEdit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Nome do Ativo</Label>
                                    <Input
                                        name="name"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="h-12 rounded-xl bg-zinc-900 border-zinc-800 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Categoria</Label>
                                    <Select name="category" value={editCategory} onValueChange={setEditCategory}>
                                        <SelectTrigger className="h-12 rounded-xl bg-zinc-900 border-zinc-800 focus:ring-primary focus:border-primary">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                            <SelectItem value="Ações">Ações (Stocks)</SelectItem>
                                            <SelectItem value="FIIs">FIIs</SelectItem>
                                            <SelectItem value="Renda Fixa">Renda Fixa</SelectItem>
                                            <SelectItem value="Cripto">Criptomoedas</SelectItem>
                                            <SelectItem value="Fundos">Fundos de Investimento</SelectItem>
                                            <SelectItem value="Outros">Outros</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button disabled={isLoading} type="submit" className="w-full bg-zinc-800 text-white hover:bg-zinc-700 font-bold h-12 rounded-xl mt-4">
                                    {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Salvar Alterações"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>

            </DialogContent>
        </Dialog>
    );
}

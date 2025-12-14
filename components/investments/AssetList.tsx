"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Asset {
    id: string;
    name: string;
    category: string;
    amount: number;
}

interface AssetListProps {
    assets: Asset[];
    onDelete: (id: string) => void;
}

export function AssetList({ assets, onDelete }: AssetListProps) {
    return (
        <div className="glass-panel overflow-hidden rounded-[2.5rem]">
            <div className="p-6 border-b border-white/5">
                <h3 className="text-lg font-bold text-white">Meus Ativos</h3>
            </div>

            <div className="w-full text-left">
                <table className="w-full">
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
                            <tr key={asset.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{asset.name}</td>
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
                                            <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-[#111] border-zinc-800">
                                            <DropdownMenuItem onClick={() => onDelete(asset.id)} className="text-red-500 focus:text-red-400 focus:bg-red-500/10 cursor-pointer">
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
    );
}

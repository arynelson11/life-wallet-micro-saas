"use client";

import { MoreHorizontal, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";

const data = [
    { name: "Seg", value: 4000 },
    { name: "Ter", value: 3000 },
    { name: "Qua", value: 5000 },
    { name: "Qui", value: 2780 },
    { name: "Sex", value: 1890 },
    { name: "Sab", value: 2390 },
    { name: "Dom", value: 3490 },
];

export function SalesPerformance() {
    return (
        <div className="orvion-card p-6 h-full flex flex-col relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-500" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                    <h3 className="text-lg font-semibold mb-1">Versão Pro</h3>
                    <p className="text-sm text-muted-foreground">Mais recursos desbloqueados</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50">
                    <MoreHorizontal className="w-5 h-5" />
                </Button>
            </div>

            <div className="flex-1 min-h-[200px] relative z-10">
                <div className="flex items-end gap-2 mb-4">
                    <span className="text-4xl font-bold">30-45</span>
                    <span className="text-sm text-muted-foreground mb-1">anos</span>
                </div>

                <div className="flex gap-2 mb-8">
                    <div className="bg-primary/20 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        12.5%
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center">vs mês anterior</span>
                </div>

                {/* Abstract 3D-like Elements (CSS only representation) */}
                <div className="absolute right-0 bottom-0 w-1/2 h-full pointer-events-none">
                    {/* This would ideally be an image or 3D canvas, using CSS spheres for now */}
                    <div className="absolute bottom-10 right-10 w-20 h-20 bg-gradient-to-br from-primary to-green-600 rounded-full shadow-lg animate-pulse" />
                    <div className="absolute bottom-24 right-4 w-12 h-12 bg-gradient-to-br from-primary to-green-400 rounded-full shadow-md opacity-80" />
                    <div className="absolute bottom-4 right-24 w-16 h-16 bg-gradient-to-br from-lime-300 to-primary rounded-full shadow-lg opacity-90" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto relative z-10">
                <div className="bg-white/50 p-4 rounded-2xl backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-1">12.233</div>
                    <div className="text-xs text-muted-foreground">Vendas</div>
                </div>
                <div className="bg-primary p-4 rounded-2xl text-black">
                    <div className="text-2xl font-bold mb-1">R$ 33.337</div>
                    <div className="text-xs opacity-80">Receita</div>
                </div>
            </div>
        </div>
    );
}

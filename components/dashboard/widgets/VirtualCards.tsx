"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VirtualCards() {
    return (
        <div className="orvion-card p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Cartões Virtuais</h3>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-white/50 hover:bg-white">
                    <ArrowUpRight className="w-4 h-4" />
                </Button>
            </div>

            <div className="mb-8">
                <div className="text-sm text-muted-foreground mb-1">Saldo Total</div>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">R$ 6.010,27</span>
                    <span className="text-sm text-muted-foreground mb-1">R$ 432,00</span>
                </div>
            </div>

            <div className="space-y-4 mt-auto">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Banco Solar</span>
                        <span className="font-medium">72%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black w-[72%] rounded-full" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Vale Alimentação</span>
                        <span className="font-medium">28%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-300 w-[28%] rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

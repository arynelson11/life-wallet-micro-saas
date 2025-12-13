"use client";

import { SalesPerformance } from "@/components/dashboard/widgets/SalesPerformance";
import { Activity } from "@/components/dashboard/widgets/Activity";
import { RevenueComparison } from "@/components/dashboard/widgets/RevenueComparison";
import { TotalSpend } from "@/components/dashboard/widgets/TotalSpend";
import { VirtualCards } from "@/components/dashboard/widgets/VirtualCards";
import { LayoutGrid, Calendar as CalendarIcon, Plus } from "lucide-react";

export function OverviewView() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in-up">
            {/* Row 1 */}
            <div className="md:col-span-4 h-[400px]">
                <SalesPerformance />
            </div>
            <div className="md:col-span-4 h-[400px]">
                <Activity />
            </div>
            <div className="md:col-span-4 h-[400px]">
                <RevenueComparison />
            </div>

            {/* Row 2 */}
            <div className="md:col-span-3 h-[350px]">
                <div className="orvion-card p-6 h-full flex flex-col justify-center items-center text-center hover:bg-zinc-50 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-black transition-all">
                        <span className="text-2xl font-bold">+</span>
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">Adicionar Novo Widget</h3>
                </div>
            </div>
            <div className="md:col-span-5 h-[350px]">
                <TotalSpend />
            </div>
            <div className="md:col-span-4 h-[350px]">
                <VirtualCards />
            </div>
        </div>
    );
}

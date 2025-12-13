"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { ArrowUpRight, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const data = [
    { name: "Seg", value: 120 },
    { name: "Ter", value: 150 },
    { name: "Qua", value: 180 },
    { name: "Qui", value: 190 },
    { name: "Sex", value: 130 },
    { name: "Sab", value: 90 },
    { name: "Dom", value: 80 },
];

export function Activity() {
    return (
        <div className="orvion-card p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Atividade</h3>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-white/50 hover:bg-white">
                        <Settings2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-white/50 hover:bg-white">
                        <ArrowUpRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-1">Nesta semana</div>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">186</span>
                    <span className="bg-primary text-black text-xs px-2 py-1 rounded-full font-medium mb-1">12:45h</span>
                </div>
            </div>

            <div className="flex-1 min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#a1a1aa' }}
                            dy={10}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.05)', radius: 8 }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar
                            dataKey="value"
                            fill="#e4e4e7"
                            radius={[4, 4, 4, 4]}
                            activeBar={{ fill: '#C7F33C' }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

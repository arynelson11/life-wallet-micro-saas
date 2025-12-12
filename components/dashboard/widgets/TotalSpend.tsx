"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { ArrowUpRight, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const data = [
    { name: "Mon", value: 200 },
    { name: "Tue", value: 400 },
    { name: "Wed", value: 300 },
    { name: "Thu", value: 600 },
    { name: "Fri", value: 500 },
    { name: "Sat", value: 700 },
    { name: "Sun", value: 600 },
];

export function TotalSpend() {
    return (
        <div className="orvion-card p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total Spend</h3>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-white/50 hover:bg-white">
                        <Settings2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-white/50 hover:bg-white">
                        <ArrowUpRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-1">Spend the week</div>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">$278.86</span>
                    <span className="text-sm text-muted-foreground mb-1">$432.00</span>
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-black" />
                    <span className="text-xs text-muted-foreground">Wallets</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <span className="text-xs text-muted-foreground">Assets</span>
                </div>
            </div>

            <div className="flex-1 min-h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#a1a1aa' }}
                            dy={10}
                            interval={0}
                        />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#000000"
                            strokeWidth={2}
                            dot={{ r: 3, fill: "#000000" }}
                            activeDot={{ r: 5, fill: "#C7F33C" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

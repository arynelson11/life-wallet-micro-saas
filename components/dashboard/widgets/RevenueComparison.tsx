"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { ArrowUpRight, MessageSquare, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const data = [
    { name: "Mon", current: 4000, previous: 2400 },
    { name: "Tue", current: 3000, previous: 1398 },
    { name: "Wed", current: 2000, previous: 9800 },
    { name: "Thu", current: 2780, previous: 3908 },
    { name: "Fri", current: 1890, previous: 4800 },
    { name: "Sat", current: 2390, previous: 3800 },
    { name: "Sun", current: 3490, previous: 4300 },
];

export function RevenueComparison() {
    return (
        <div className="orvion-card p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Comparison of Revenue</h3>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-black text-white hover:bg-black/90">
                        <Settings2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-white/50 hover:bg-white">
                        <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-white/50 hover:bg-white">
                        <ArrowUpRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-1">Fior all time</div>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">29,48m</span>
                </div>
            </div>

            <div className="flex-1 min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <pattern id="stripe-pattern" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                                <rect width="2" height="4" transform="translate(0,0)" fill="#000000" opacity="0.1" />
                            </pattern>
                        </defs>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#a1a1aa' }}
                            dy={10}
                        />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="previous"
                            stroke="none"
                            fill="url(#stripe-pattern)"
                        />
                        <Area
                            type="monotone"
                            dataKey="current"
                            stroke="#000000"
                            strokeWidth={2}
                            fill="none"
                        />
                        {/* Custom Dot for the peak or specific point */}
                        <circle cx="70%" cy="40%" r="4" fill="#C7F33C" stroke="none" />
                        <g transform="translate(350, 80)">
                            <rect width="40" height="20" rx="10" fill="#C7F33C" />
                            <text x="20" y="14" textAnchor="middle" fontSize="10" fontWeight="bold">+9%</text>
                        </g>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

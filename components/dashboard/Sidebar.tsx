"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    PieChart,
    Activity,
    Database,
    Settings,
    LogOut,
    LifeBuoy,
    MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: PieChart, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Activity, label: "Pulse", href: "/dashboard/pulse" },
    { icon: Database, label: "Data", href: "/dashboard/data" },
];

const bottomItems = [
    { icon: MessageSquare, label: "Support", href: "/support" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-4 top-4 bottom-4 w-20 flex flex-col items-center py-8 glass-panel rounded-[2.5rem] z-50 hidden md:flex">
            {/* Logo */}
            <div className="mb-10">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-primary">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* Main Menu */}
            <nav className="flex-1 flex flex-col gap-6 w-full px-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 group relative",
                                isActive
                                    ? "bg-black text-primary shadow-lg scale-110"
                                    : "text-muted-foreground hover:bg-white/50 hover:text-black"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {isActive && (
                                <div className="absolute left-14 bg-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Menu */}
            <div className="flex flex-col gap-6 w-full px-4 mt-auto">
                {bottomItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl text-muted-foreground hover:bg-white/50 hover:text-black transition-all duration-300"
                    >
                        <item.icon className="w-5 h-5" />
                    </Link>
                ))}

                <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all duration-300">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </aside>
    );
}

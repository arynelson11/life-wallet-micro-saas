"use client";

import { usePathname } from "next/navigation";
import { BottomTabBar } from "./BottomTabBar";
import { TopNavbar } from "./TopNavbar";

interface NavigationWrapperProps {
    children: React.ReactNode;
}

export function NavigationWrapper({ children }: NavigationWrapperProps) {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";

    if (isLandingPage) {
        return <main>{children}</main>;
    }

    return (
        <div className="min-h-screen">
            {/* Top Navbar - Hidden on Mobile, Visible on Desktop */}
            <TopNavbar />

            {/* Main Content - Add padding-bottom on mobile for bottom bar */}
            <main className="pb-20 md:pb-0">{children}</main>

            {/* Bottom Tab Bar - Visible on Mobile, Hidden on Desktop */}
            <BottomTabBar />
        </div>
    );
}

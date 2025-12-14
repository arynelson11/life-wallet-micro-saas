'use client';

import { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { getFinancialSummary, getFullFinancialData } from "@/actions/finance-actions";
import { OnboardingView } from "@/components/dashboard/OnboardingView";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [summary, setSummary] = useState<any>(null);
    const [fullData, setFullData] = useState<any>({ transactions: [], debts: [], cards: [], goals: [] });
    const [spaceId, setSpaceId] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createClient();

    // 1. MOUNTING GUARD (Critical for fixing Server Render Error)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 2. DATA FETCHING
    useEffect(() => {
        if (!isMounted) return;

        const fetchData = async () => {
            try {
                // Auth Check
                const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
                if (authError || !currentUser) {
                    router.push("/login");
                    return;
                }
                setUser(currentUser);

                // Space Check
                const { data: space, error: spaceError } = await supabase
                    .from('spaces')
                    .select('id')
                    .eq('owner_id', currentUser.id)
                    .limit(1)
                    .single();

                if (space?.id) {
                    setSpaceId(space.id);
                    // Parallel Fetch
                    const [summaryRes, fullDataRes] = await Promise.all([
                        getFinancialSummary(space.id),
                        getFullFinancialData(space.id)
                    ]);
                    setSummary(summaryRes);
                    setFullData(fullDataRes);
                }
            } catch (error) {
                console.error("Critical Dashboard Error:", error);
                toast.error("Erro ao carregar dados do dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isMounted, router, supabase]);

    // 3. RENDER GATES
    if (!isMounted) {
        return null; // Prevent server rendering of broken components
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-black md:pb-8">
            <div className="max-w-[1600px] mx-auto md:px-8">
                {/* Header is always visible if we have a user, even if no space */}
                <Header user={user} />

                {/* Content */}
                {!spaceId ? (
                    <OnboardingView />
                ) : (
                    <DashboardTabs
                        summary={summary}
                        fullData={fullData}
                        spaceId={spaceId}
                        profileId={user?.id}
                    />
                )}
            </div>
        </div>
    );
}
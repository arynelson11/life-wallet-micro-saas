import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { SubscriptionTab } from "@/components/settings/SubscriptionTab";
import { SecurityTab } from "@/components/settings/SecurityTab";
import { FamilyTab } from "@/components/settings/FamilyTab";

interface SettingsPageProps {
    searchParams: { tab?: string };
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Fetch Profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

    // Fetch Invite Code (Space)
    const { data: spaceMember } = await supabase
        .from("space_members")
        .select("space_id, spaces(name, invite_code)")
        .eq("user_id", user.id)
        .maybeSingle();

    // @ts-ignore
    const inviteCode = spaceMember?.spaces?.invite_code || "---";
    const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY;

    // Determine Active Content
    const tab = searchParams?.tab || "profile";

    return (
        <SettingsLayout>
            {tab === "profile" && <ProfileTab user={user} profile={profile} />}
            {tab === "subscription" && <SubscriptionTab profile={profile} isStripeConfigured={isStripeConfigured} />}
            {tab === "security" && <SecurityTab />}
            {tab === "family" && <FamilyTab inviteCode={inviteCode} />}
        </SettingsLayout>
    );
}
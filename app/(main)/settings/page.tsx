import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsLayout } from "@/components/settings/SettingsLayout";

export default async function SettingsPage() {
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

    return (
        <SettingsLayout
            user={user}
            profile={profile}
            inviteCode={inviteCode}
            isStripeConfigured={isStripeConfigured}
        />
    );
}
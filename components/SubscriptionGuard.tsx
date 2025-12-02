import { createClient } from "@/lib/supabase/server";
import { LockScreen } from "./LockScreen";

export async function SubscriptionGuard({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <>{children}</>;

    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, trial_ends_at')
        .eq('id', user.id)
        .single();

    if (!profile) return <>{children}</>;

    const isActive = profile.subscription_status === 'active';
    const trialEndsAt = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
    const now = new Date();

    const isTrialActive = trialEndsAt ? now < trialEndsAt : false;

    if (isActive || isTrialActive) {
        return (
            <>
                {/* Trial Banner */}
                {(!isActive && isTrialActive && trialEndsAt) && (
                    <div className="bg-blue-600 text-white text-xs font-bold text-center py-1 relative z-50">
                        {Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} dias restantes no seu teste gratuito.
                    </div>
                )}
                {children}
            </>
        );
    }

    return <LockScreen />;
}

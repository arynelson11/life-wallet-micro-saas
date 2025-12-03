'use server'

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createCheckoutSession(priceId: string) {
    if (!stripe) {
        throw new Error("Stripe não está configurado. Configure STRIPE_SECRET_KEY no .env.local");
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Usuário não autenticado");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.user_metadata?.full_name,
            metadata: {
                userId: user.id,
            },
        });
        customerId = customer.id;

        await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id);
    }

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/settings`,
        client_reference_id: user.id,
        metadata: {
            userId: user.id,
        },
    });

    if (!session.url) {
        throw new Error("Erro ao criar sessão de checkout");
    }

    redirect(session.url);
}

export async function createCustomerPortal() {
    if (!stripe) {
        throw new Error("Stripe não está configurado. Configure STRIPE_SECRET_KEY no .env.local");
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single();

    if (!profile?.stripe_customer_id) {
        throw new Error("Cliente Stripe não encontrado");
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: `${process.env.NEXT_PUBLIC_URL}/settings`,
    });

    redirect(session.url);
}

export async function createCustomerPortalSession() {
    return createCustomerPortal();
}

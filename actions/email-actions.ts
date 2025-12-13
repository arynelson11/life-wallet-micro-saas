"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReportEmail(email: string, summaryHtml: string) {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.log("⚠️ EMAIL SIMULATION (No API Key):", email);
            await new Promise(resolve => setTimeout(resolve, 1500));
            return { success: true, message: "Relatório gerado e enviado (Simulação - Configure a API Key)." };
        }

        const { data, error } = await resend.emails.send({
            from: 'LifeWallet <onboarding@resend.dev>', // Default testing domain
            to: [email],
            subject: 'Seu Relatório Financeiro LifeWallet',
            html: summaryHtml,
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Email Action Error:", error);
        return { success: false, error: "Falha ao enviar email." };
    }
}

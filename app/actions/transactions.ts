'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTransaction(formData: FormData) {
    const supabase = await createClient()

    // Get authenticated user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Get user's personal space
    const { data: spaces } = await supabase
        .from('spaces')
        .select('id')
        .eq('owner_id', user.id)
        .eq('type', 'PERSONAL')
        .limit(1)

    if (!spaces || spaces.length === 0) {
        return { error: 'No personal space found' }
    }

    const spaceId = spaces[0].id

    // Parse form data
    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const type = formData.get('type') as 'income' | 'expense'
    const date = formData.get('date') as string

    // Validate
    if (!amount || !description || !category || !type || !date) {
        return { error: 'Missing required fields' }
    }

    // Insert transaction
    const { error } = await supabase.from('transactions').insert({
        space_id: spaceId,
        profile_id: user.id,
        amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        description,
        category,
        type,
        date: new Date(date).toISOString(),
    })

    if (error) {
        console.error('Error creating transaction:', error)
        return { error: error.message }
    }

    // Revalidate pages
    revalidatePath('/dashboard')
    revalidatePath('/extrato')
    revalidatePath('/calendario')

    return { success: true }
}

export async function updateTransaction(id: string, updates: { date?: string, amount?: number, description?: string }) {
    const supabase = await createClient();

    // Se a data for atualizada, garantir que seja ISO
    const payload: any = { ...updates };
    if (updates.date) {
        payload.date = new Date(updates.date).toISOString();
    }

    const { error } = await supabase
        .from('transactions')
        .update(payload)
        .eq('id', id);

    if (error) {
        console.error('Erro ao atualizar:', error);
        return { error: 'Falha ao atualizar transação' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/calendario');
    return { success: true };
}

export async function deleteTransaction(transactionId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);

    if (error) {
        console.error('Erro ao deletar:', error);
        throw new Error('Falha ao deletar transação');
    }

    revalidatePath('/dashboard');
    revalidatePath('/calendario');
}

export async function joinSpace(inviteCode: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Usuário não logado" };

    // Chama a função SQL 'join_space_by_code'
    const { data, error } = await supabase.rpc('join_space_by_code', {
        code_input: inviteCode,
        user_uuid: user.id
    });

    if (error) {
        console.error("Erro ao entrar no grupo:", error);
        return { error: "Código inválido ou erro ao entrar." };
    }

    // Verifica se a RPC retornou sucesso
    if (data && data.success === false) {
        return { error: data.message || "Erro ao entrar no grupo." };
    }

    revalidatePath('/dashboard');
    return { success: true };
}
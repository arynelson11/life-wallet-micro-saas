'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createGoal(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não logado.");

    const title = formData.get("title") as string;
    const targetAmount = formData.get("target_amount");
    const icon = formData.get("icon") as string;
    const imageUrl = formData.get("image_url") as string | null;

    // Tenta pegar o Space ID enviado pelo form
    let spaceId = formData.get("space_id") as string;

    // --- REDE DE SEGURANÇA (SELF-HEALING) ---
    // Se o spaceId veio vazio ou inválido, tentamos buscar ou criar um agora.
    if (!spaceId || spaceId === "undefined" || spaceId === "") {
        console.log("⚠️ Space ID inválido. Tentando recuperar/criar...");

        // 1. Tenta buscar um space existente onde o usuário é dono
        const { data: existingSpace } = await supabase
            .from("spaces")
            .select("id")
            .eq("owner_id", user.id)
            .single();

        if (existingSpace) {
            spaceId = existingSpace.id;
        } else {
            // 2. Se não existir, CRIA UM NOVO AGORA (Self-Healing)
            console.log("🛠️ Criando novo Space para o usuário...");
            const { data: newSpace, error: createError } = await supabase
                .from("spaces")
                .insert({ name: "Minha Carteira", owner_id: user.id })
                .select()
                .single();

            if (createError) throw new Error("Erro crítico: Não foi possível criar seu espaço financeiro.");

            spaceId = newSpace.id;

            // Adiciona o usuário como membro desse novo space
            await supabase.from("space_members").insert({
                space_id: spaceId,
                user_id: user.id,
                role: 'admin'
            });
        }
    }

    console.log("✅ Space ID Confirmado:", spaceId);

    // 3. Salvar a Meta finalmente
    const { error } = await supabase.from("goals").insert({
        title,
        target_amount: Number(targetAmount),
        current_amount: 0,
        icon,
        space_id: spaceId,
        status: 'active',
        image_url: imageUrl
    });

    if (error) {
        console.error("❌ ERRO SUPABASE:", error.message);
        throw new Error(`Erro no Banco: ${error.message}`);
    }

    revalidatePath("/metas");
}
# Configuração do Stripe (Monetização)

## Status Atual
O app está funcionando **SEM** o Stripe configurado. As funcionalidades de assinatura ficarão desabilitadas até você configurar.

## Como Configurar

### 1. Criar Conta no Stripe
1. Acesse [stripe.com](https://stripe.com) e crie uma conta
2. Ative o modo de testes (Toggle "Test mode" no canto superior direito)

### 2. Obter as Chaves de API
No Dashboard do Stripe:
1. Vá para **Developers** → **API keys**
2. Copie:
   - **Publishable key** (começa com `pk_test_`)
   - **Secret key** (começa com `sk_test_`) - Clique em "Reveal test key"

### 3. Criar os Produtos
No Dashboard do Stripe:
1. Vá para **Products** → **Add Product**
2. Crie 3 produtos:
   - **Solo**: R$ 19,90/mês
   - **Casal**: R$ 29,90/mês
   - **Família**: R$ 59,90/mês
3. Para cada produto, copie o **Price ID** (começa com `price_`)

### 4. Configurar .env.local
Crie ou edite o arquivo `.env.local` na raiz do projeto:

```env
# Suas chaves atuais do Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Adicione as chaves do Stripe
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica_aqui

# URL do app
NEXT_PUBLIC_URL=http://localhost:3000
```

### 5. Atualizar Price IDs no Código

#### `app/settings/page.tsx` (linha ~51)
```tsx
await createCheckoutSession("price_SEU_PRICE_ID_AQUI");
```

#### `components/LockScreen.tsx` (linhas ~17, 25, 33)
```tsx
const plans = [
    {
        name: "Solo",
        priceId: "price_SEU_PRICE_ID_SOLO",
        // ...
    },
    {
        name: "Casal",
        priceId: "price_SEU_PRICE_ID_CASAL",
        // ...
    },
    {
        name: "Família",
        priceId: "price_SEU_PRICE_ID_FAMILIA",
        // ...
    }
];
```

### 6. Reiniciar o Servidor
```bash
npm run dev
```

## Testando

1. **Criar novo usuário** → Ele terá 7 dias de trial
2. **Verificar trial**: Vá para `/settings` e veja status "trial"
3. **Testar checkout**: Clique em "Assinar Agora"
4. **Cartão de teste**:
   - Número: `4242 4242 4242 4242`
   - Data: Qualquer data futura
   - CVC: Qualquer 3 dígitos

## Arquivos Modificados
- `lib/stripe.ts` - Cliente Stripe (com verificação de chave)
- `app/actions/stripe.ts` - Server Actions
- `components/SubscriptionGuard.tsx` - Guard de acesso
- `components/LockScreen.tsx` - Tela de bloqueio
- `app/settings/page.tsx` - Página de configurações

## Webhooks (Produção)
Para produção, você precisará configurar webhooks do Stripe para atualizar o status da assinatura automaticamente. Isso está fora do escopo atual.

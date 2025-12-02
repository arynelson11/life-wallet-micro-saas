# LifeWallet Database Schema

## Overview

Este diretório contém as migrations SQL para o banco de dados LifeWallet usando PostgreSQL/Supabase.

## Schema Structure

### 1. **profiles** - Perfis de Usuário
Extensão pública da tabela `auth.users` do Supabase.
- `id`: UUID (referência para auth.users)
- `email`: Email do usuário
- `full_name`: Nome completo
- `avatar_url`: URL do avatar
- `created_at`, `updated_at`: Timestamps

### 2. **spaces** - Espaços Compartilhados
Representa onde o dinheiro "vive" (pessoal, casal, família).
- `id`: UUID (PK)
- `name`: Nome do espaço (ex: "Carteira do João", "Família Silva")
- `type`: PERSONAL | COUPLE | FAMILY
- `owner_id`: UUID (referência para auth.users)

### 3. **space_members** - Membros dos Espaços
Controle de acesso - quem pode ver/editar cada espaço.
- `space_id`: UUID (FK -> spaces)
- `user_id`: UUID (FK -> profiles)
- `role`: admin | member
- **Primary Key**: (space_id, user_id)

### 4. **transactions** - Transações Financeiras
Registro de entradas e saídas.
- `id`: UUID (PK)
- `space_id`: UUID (FK -> spaces)
- `profile_id`: UUID (FK -> profiles) - Quem fez a transação
- `amount`: Valor (NUMERIC)
- `description`: Descrição
- `category`: Categoria (ex: Alimentação, Transporte)
- `type`: income | expense
- `date`: Data da transação

### 5. **goals** - Metas Financeiras
Objetivos e sonhos dos usuários.
- `id`: UUID (PK)
- `space_id`: UUID (FK -> spaces)
- `title`: Título da meta (ex: "Viagem Disney")
- `current_amount`: Valor atual
- `target_amount`: Valor alvo
- `icon`: Emoji ou identificador do ícone
- `status`: active | completed

## Row Level Security (RLS)

### Princípios de Segurança

✅ **100% RLS Habilitado**: Todas as tabelas têm RLS ativo.

✅ **Isolamento de Dados**: Usuários só acessam dados dos espaços que pertencem.

✅ **Políticas Implementadas**:

#### **profiles**
- Todos podem visualizar perfis
- Usuários podem editar apenas seu próprio perfil

#### **spaces**
- Usuários veem apenas espaços que criaram ou dos quais são membros
- Apenas o owner pode deletar

#### **space_members**
- Usuários veem membros dos seus espaços
- Apenas admins podem adicionar/remover membros

#### **transactions**
- Usuários veem transações dos espaços que pertencem
- Usuários só podem criar transações em seus espaços
- Usuários só podem editar/deletar suas próprias transações

#### **goals**
- Usuários veem metas dos espaços que pertencem
- Membros podem criar/editar metas
- Apenas admins podem deletar

## Como Aplicar

### Opção 1: Via Supabase Dashboard
1. Acesse o Supabase Dashboard: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Cole o conteúdo de `20241128_initial_schema.sql`
5. Clique em **Run**

### Opção 2: Via Supabase CLI
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref YOUR_PROJECT_REF

# Aplicar migration
supabase db push
```

### Opção 3: Via psql
```bash
psql -h db.YOUR_PROJECT.supabase.co -U postgres -d postgres -f supabase/migrations/20241128_initial_schema.sql
```

## Triggers Automáticos

### ⚡ Onboarding Completo Automatizado

Quando um novo usuário se registra via Supabase Auth, o trigger `handle_new_user()` executa automaticamente 3 ações:

1. **Cria Profile**: Insere dados do usuário na tabela `public.profiles`
2. **Cria Espaço Pessoal**: Cria automaticamente um espaço do tipo 'PERSONAL' chamado "Carteira Pessoal"
3. **Adiciona como Admin**: Insere o usuário como 'admin' na tabela `space_members`

**Resultado**: Ao fazer login pela primeira vez, o usuário já tem um dashboard funcional pronto para uso! ✅

### Auto-update de timestamps
Os campos `updated_at` são atualizados automaticamente em todas as tabelas quando há uma modificação.

## Indexes

Para performance, foram criados indexes em:
- `transactions.space_id`
- `transactions.profile_id`
- `transactions.date`
- `goals.space_id`
- `goals.status`

## Exemplos de Uso

### Criar um Espaço Pessoal
```sql
INSERT INTO spaces (name, type, owner_id)
VALUES ('Minha Carteira', 'PERSONAL', auth.uid());
```

### Adicionar Membro a um Espaço (Casal)
```sql
INSERT INTO space_members (space_id, user_id, role)
VALUES ('space-uuid-aqui', 'user-uuid-aqui', 'member');
```

### Registrar uma Transação
```sql
INSERT INTO transactions (space_id, profile_id, amount, description, category, type, date)
VALUES (
  'space-uuid',
  auth.uid(),
  -50.90,
  'Padaria Estrela',
  'Alimentação',
  'expense',
  NOW()
);
```

### Criar uma Meta
```sql
INSERT INTO goals (space_id, title, current_amount, target_amount, icon, status)
VALUES (
  'space-uuid',
  'Viagem Disney',
  0,
  25000,
  '✈️',
  'active'
);
```

## Próximos Passos

1. ✅ Aplicar migration no Supabase
2. 🔄 Configurar variáveis de ambiente no `.env.local`
3. 🔄 Criar funções de API para CRUD
4. 🔄 Implementar autenticação no frontend
5. 🔄 Criar componentes para gestão de espaços

## Segurança

⚠️ **IMPORTANTE**: Nunca exponha as políticas RLS diretamente no frontend. Todo acesso deve ser através das APIs do Supabase que respeitam as políticas configuradas.

🔒 **Boas Práticas**:
- Use `auth.uid()` nas queries para garantir isolamento
- Sempre teste as políticas RLS
- Monitore os logs de acesso
- Mantenha as migrations versionadas

---

**Desenvolvido para LifeWallet** 🚀

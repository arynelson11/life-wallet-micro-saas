-- LifeWallet Seed Data
-- This script populates your database with sample data for testing

-- Note: This script assumes you are logged in and have a personal space
-- The trigger handle_new_user() already created your profile and personal space

-- Get the user's personal space ID (will be used in all inserts)
DO $$
DECLARE
  user_space_id UUID;
  user_profile_id UUID;
BEGIN
  -- Get the current user's ID
  user_profile_id := auth.uid();
  
  -- Get the user's personal space
  SELECT id INTO user_space_id 
  FROM public.spaces 
  WHERE owner_id = user_profile_id 
  AND type = 'PERSONAL' 
  LIMIT 1;

  -- Insert 5 sample transactions
  INSERT INTO public.transactions (space_id, profile_id, amount, description, category, type, date) VALUES
    -- Expense 1: Uber
    (user_space_id, user_profile_id, -35.50, 'Corrida para o trabalho', 'Transporte', 'expense', NOW() - INTERVAL '2 days'),
    
    -- Expense 2: Supermercado
    (user_space_id, user_profile_id, -287.90, 'Supermercado Carrefour', 'Alimentação', 'expense', NOW() - INTERVAL '5 days'),
    
    -- Income: Salário
    (user_space_id, user_profile_id, 5500.00, 'Salário Mensal', 'Salário', 'income', NOW() - INTERVAL '15 days'),
    
    -- Expense 3: Netflix
    (user_space_id, user_profile_id, -39.90, 'Assinatura Netflix', 'Entretenimento', 'expense', NOW() - INTERVAL '7 days'),
    
    -- Expense 4: Restaurante
    (user_space_id, user_profile_id, -125.00, 'Almoço em família', 'Alimentação', 'expense', NOW() - INTERVAL '1 day');

  -- Insert 2 sample goals
  INSERT INTO public.goals (space_id, title, current_amount, target_amount, icon, status) VALUES
    -- Goal 1: Emergency Fund (80% complete)
    (user_space_id, 'Reserva de Emergência', 12000.00, 15000.00, '🛡️', 'active'),
    
    -- Goal 2: Travel (20% complete)
    (user_space_id, 'Viagem para Paris', 5000.00, 25000.00, '✈️', 'active');

  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Space ID: %', user_space_id;
  RAISE NOTICE '5 transactions and 2 goals created.';
END $$;

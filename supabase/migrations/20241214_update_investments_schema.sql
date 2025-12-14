-- Add new columns to Investments Table
ALTER TABLE public.investments 
ADD COLUMN IF NOT EXISTS ticker TEXT,
ADD COLUMN IF NOT EXISTS quantity NUMERIC(15,8),
ADD COLUMN IF NOT EXISTS unit_price NUMERIC(15,2),
ADD COLUMN IF NOT EXISTS purchase_date DATE DEFAULT CURRENT_DATE;

-- Comment on columns
COMMENT ON COLUMN public.investments.ticker IS 'Stock ticker or asset symbol (e.g. PETR4, BTC)';
COMMENT ON COLUMN public.investments.quantity IS 'Quantity of assets purchased';
COMMENT ON COLUMN public.investments.unit_price IS 'Price per unit at the time of purchase';
COMMENT ON COLUMN public.investments.purchase_date IS 'Date when the asset was purchased';

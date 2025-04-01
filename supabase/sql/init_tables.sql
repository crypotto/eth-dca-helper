
-- Create dca_purchases table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.dca_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  date TEXT NOT NULL,
  amount_usd NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  amount NUMERIC NOT NULL,
  crypto_type TEXT CHECK (crypto_type IN ('ETH', 'BTC')) NOT NULL
);

-- Create user_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  current_eth_price NUMERIC NOT NULL,
  current_btc_price NUMERIC NOT NULL, 
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Add RLS policies (Row Level Security)
ALTER TABLE public.dca_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for dca_purchases
CREATE POLICY "Users can view own dca_purchases" ON public.dca_purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dca_purchases" ON public.dca_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dca_purchases" ON public.dca_purchases
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dca_purchases" ON public.dca_purchases
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for user_settings
CREATE POLICY "Users can view own user_settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own user_settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own user_settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own user_settings" ON public.user_settings
  FOR DELETE USING (auth.uid() = user_id);

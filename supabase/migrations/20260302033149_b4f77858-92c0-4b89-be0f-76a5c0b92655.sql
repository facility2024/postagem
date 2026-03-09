
-- =============================================
-- TABELA: licenses (Controla quem tem acesso)
-- =============================================
CREATE TABLE public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_type VARCHAR(50) NOT NULL DEFAULT 'free',
  max_accounts INT DEFAULT 1,
  max_scheduled_posts INT DEFAULT 10,
  max_stories_per_month INT DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_licenses_user ON public.licenses(user_id);
CREATE INDEX idx_licenses_active ON public.licenses(is_active);

ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own license" ON public.licenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all licenses" ON public.licenses FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- TABELA: social_accounts (Contas conectadas via OAuth)
-- =============================================
CREATE TABLE public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(50) NOT NULL,
  account_username VARCHAR(255),
  account_id VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_social_accounts_user ON public.social_accounts(user_id);
CREATE INDEX idx_social_accounts_type ON public.social_accounts(account_type);

ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own accounts" ON public.social_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own accounts" ON public.social_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own accounts" ON public.social_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own accounts" ON public.social_accounts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all accounts" ON public.social_accounts FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- MODIFICAR scheduled_posts: adicionar post_type e account_ids
-- =============================================
ALTER TABLE public.scheduled_posts 
  ADD COLUMN IF NOT EXISTS post_type VARCHAR(50) DEFAULT 'feed',
  ADD COLUMN IF NOT EXISTS account_ids UUID[] DEFAULT '{}';

-- =============================================
-- MODIFICAR post_logs: adicionar social_account_id
-- =============================================
ALTER TABLE public.post_logs
  ADD COLUMN IF NOT EXISTS social_account_id UUID REFERENCES public.social_accounts(id);

-- Trigger para updated_at em licenses
CREATE TRIGGER update_licenses_updated_at
  BEFORE UPDATE ON public.licenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

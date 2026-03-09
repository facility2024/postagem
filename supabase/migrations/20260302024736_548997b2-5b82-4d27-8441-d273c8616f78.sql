
-- Tabela: scheduled_posts
CREATE TABLE public.scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  video_url TEXT DEFAULT '',
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
  post_to_facebook BOOLEAN DEFAULT false,
  post_to_instagram BOOLEAN DEFAULT false,
  facebook_page_id VARCHAR(255) DEFAULT '',
  instagram_account_id VARCHAR(255) DEFAULT '',
  status VARCHAR(50) DEFAULT 'scheduled',
  posted_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own posts" ON public.scheduled_posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own posts" ON public.scheduled_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.scheduled_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.scheduled_posts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all posts" ON public.scheduled_posts FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE INDEX idx_scheduled_posts_status ON public.scheduled_posts(status);
CREATE INDEX idx_scheduled_posts_scheduled_at ON public.scheduled_posts(scheduled_at);
CREATE INDEX idx_scheduled_posts_user_id ON public.scheduled_posts(user_id);

CREATE TRIGGER update_scheduled_posts_updated_at
  BEFORE UPDATE ON public.scheduled_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela: social_media_tokens
CREATE TABLE public.social_media_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  facebook_page_id VARCHAR(255) DEFAULT '',
  facebook_access_token TEXT DEFAULT '',
  facebook_token_expiry TIMESTAMP WITH TIME ZONE,
  instagram_account_id VARCHAR(255) DEFAULT '',
  instagram_access_token TEXT DEFAULT '',
  instagram_token_expiry TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.social_media_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tokens" ON public.social_media_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tokens" ON public.social_media_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tokens" ON public.social_media_tokens FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all tokens" ON public.social_media_tokens FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_social_media_tokens_updated_at
  BEFORE UPDATE ON public.social_media_tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela: post_logs
CREATE TABLE public.post_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_post_id UUID NOT NULL REFERENCES public.scheduled_posts(id) ON DELETE CASCADE,
  network VARCHAR(50) NOT NULL,
  success BOOLEAN DEFAULT false,
  error_message TEXT DEFAULT '',
  response_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.post_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own post logs" ON public.post_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.scheduled_posts sp WHERE sp.id = post_logs.scheduled_post_id AND sp.user_id = auth.uid()));
CREATE POLICY "Admins can manage all logs" ON public.post_logs FOR ALL USING (has_role(auth.uid(), 'admin'));

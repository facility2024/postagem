export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ad_banners: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          link: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          link?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          link?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      app_users: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          senha: string | null
          status: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          senha?: string | null
          status?: string
          whatsapp: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          senha?: string | null
          status?: string
          whatsapp?: string
        }
        Relationships: []
      }
      automation_settings: {
        Row: {
          analysis_interval_minutes: number
          created_at: string
          gemini_api_key: string | null
          id: string
          is_active: boolean
          max_daily_sends: number
          min_rating_threshold: number
          openai_api_key: string | null
          preferred_ai: string
          service_description: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_interval_minutes?: number
          created_at?: string
          gemini_api_key?: string | null
          id?: string
          is_active?: boolean
          max_daily_sends?: number
          min_rating_threshold?: number
          openai_api_key?: string | null
          preferred_ai?: string
          service_description?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_interval_minutes?: number
          created_at?: string
          gemini_api_key?: string | null
          id?: string
          is_active?: boolean
          max_daily_sends?: number
          min_rating_threshold?: number
          openai_api_key?: string | null
          preferred_ai?: string
          service_description?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      avaliacoes: {
        Row: {
          confidence_level: number
          created_at: string
          empresa_id: string
          ends_at: string | null
          id: string
          invite_code: string | null
          margin_of_error: number
          methodology: string
          sampling_type: string
          started_at: string | null
          status: string
          stratification: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_level?: number
          created_at?: string
          empresa_id: string
          ends_at?: string | null
          id?: string
          invite_code?: string | null
          margin_of_error?: number
          methodology?: string
          sampling_type?: string
          started_at?: string | null
          status?: string
          stratification?: string
          titulo?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_level?: number
          created_at?: string
          empresa_id?: string
          ends_at?: string | null
          id?: string
          invite_code?: string | null
          margin_of_error?: number
          methodology?: string
          sampling_type?: string
          started_at?: string | null
          status?: string
          stratification?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      call_access_log: {
        Row: {
          config_id: string
          created_at: string
          device_fingerprint: string
          id: string
        }
        Insert: {
          config_id: string
          created_at?: string
          device_fingerprint: string
          id?: string
        }
        Update: {
          config_id?: string
          created_at?: string
          device_fingerprint?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_access_log_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "live_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      call_analytics: {
        Row: {
          config_id: string
          created_at: string
          device_type: string
          duration_seconds: number
          ended_at: string | null
          id: string
          region: string | null
          session_id: string | null
          started_at: string
        }
        Insert: {
          config_id: string
          created_at?: string
          device_type?: string
          duration_seconds?: number
          ended_at?: string | null
          id?: string
          region?: string | null
          session_id?: string | null
          started_at?: string
        }
        Update: {
          config_id?: string
          created_at?: string
          device_type?: string
          duration_seconds?: number
          ended_at?: string | null
          id?: string
          region?: string | null
          session_id?: string | null
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_analytics_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "live_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      call_messages: {
        Row: {
          config_id: string
          created_at: string
          id: string
          message: string
          sender_name: string
        }
        Insert: {
          config_id: string
          created_at?: string
          id?: string
          message: string
          sender_name?: string
        }
        Update: {
          config_id?: string
          created_at?: string
          id?: string
          message?: string
          sender_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_messages_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "live_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_templates: {
        Row: {
          campaign_type: string
          caption: string | null
          created_at: string
          expires_at: string
          id: string
          media_url: string | null
          message: string
          message_type: string
          recipients_count: number
          subject: string | null
          use_spintax: boolean
        }
        Insert: {
          campaign_type?: string
          caption?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          media_url?: string | null
          message?: string
          message_type?: string
          recipients_count?: number
          subject?: string | null
          use_spintax?: boolean
        }
        Update: {
          campaign_type?: string
          caption?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          media_url?: string | null
          message?: string
          message_type?: string
          recipients_count?: number
          subject?: string | null
          use_spintax?: boolean
        }
        Relationships: []
      }
      carousel_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          items: Json
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          items?: Json
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          items?: Json
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      colaborador_acessos: {
        Row: {
          avaliacao_id: string
          colaborador_id: string
          created_at: string
          id: string
          token: string
          usado: boolean
          usado_em: string | null
        }
        Insert: {
          avaliacao_id: string
          colaborador_id: string
          created_at?: string
          id?: string
          token?: string
          usado?: boolean
          usado_em?: string | null
        }
        Update: {
          avaliacao_id?: string
          colaborador_id?: string
          created_at?: string
          id?: string
          token?: string
          usado?: boolean
          usado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "colaborador_acessos_avaliacao_id_fkey"
            columns: ["avaliacao_id"]
            isOneToOne: false
            referencedRelation: "avaliacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "colaborador_acessos_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      colaboradores: {
        Row: {
          area: string
          avaliacao_id: string
          cargo: string
          created_at: string
          email: string
          funcao: string
          id: string
          nome: string
          respondido_em: string | null
          selecionado_amostra: boolean
          status: string
          telefone: string
          updated_at: string
        }
        Insert: {
          area?: string
          avaliacao_id: string
          cargo?: string
          created_at?: string
          email?: string
          funcao?: string
          id?: string
          nome?: string
          respondido_em?: string | null
          selecionado_amostra?: boolean
          status?: string
          telefone?: string
          updated_at?: string
        }
        Update: {
          area?: string
          avaliacao_id?: string
          cargo?: string
          created_at?: string
          email?: string
          funcao?: string
          id?: string
          nome?: string
          respondido_em?: string | null
          selecionado_amostra?: boolean
          status?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "colaboradores_avaliacao_id_fkey"
            columns: ["avaliacao_id"]
            isOneToOne: false
            referencedRelation: "avaliacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cnae: string
          cnpj: string
          created_at: string
          id: string
          num_empregados: number
          razao_social: string
          responsavel: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cnae?: string
          cnpj?: string
          created_at?: string
          id?: string
          num_empregados?: number
          razao_social?: string
          responsavel?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cnae?: string
          cnpj?: string
          created_at?: string
          id?: string
          num_empregados?: number
          razao_social?: string
          responsavel?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      in_app_notifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          image_url: string
          is_active: boolean
          message: string
          scheduled_at: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          message?: string
          scheduled_at?: string | null
          title?: string
          type?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          message?: string
          scheduled_at?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      lead_scores: {
        Row: {
          analysis_summary: string | null
          business_hours: Json | null
          created_at: string
          generated_copy: string | null
          id: string
          kanban_stage: string
          prospect_id: string
          recommended_send_day: string | null
          recommended_send_time: string | null
          scheduled_at: string | null
          score: number
          sent_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_summary?: string | null
          business_hours?: Json | null
          created_at?: string
          generated_copy?: string | null
          id?: string
          kanban_stage?: string
          prospect_id: string
          recommended_send_day?: string | null
          recommended_send_time?: string | null
          scheduled_at?: string | null
          score?: number
          sent_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_summary?: string | null
          business_hours?: Json | null
          created_at?: string
          generated_copy?: string | null
          id?: string
          kanban_stage?: string
          prospect_id?: string
          recommended_send_day?: string | null
          recommended_send_time?: string | null
          scheduled_at?: string | null
          score?: number
          sent_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_scores_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospec_prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          activated_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_accounts: number | null
          max_scheduled_posts: number | null
          max_stories_per_month: number | null
          plan_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_accounts?: number | null
          max_scheduled_posts?: number | null
          max_stories_per_month?: number | null
          plan_type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activated_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_accounts?: number | null
          max_scheduled_posts?: number | null
          max_stories_per_month?: number | null
          plan_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      live_configs: {
        Row: {
          access_mode: string
          banner_image_url: string
          chat_messages_arrival: Json
          chat_messages_engagement: Json
          chat_messages_purchase: Json
          created_at: string
          cta_color_solid: string
          cta_delay_minutes: number
          cta_link: string
          cta_text: string
          cta_text_color: string
          end_timer_enabled: boolean
          end_timer_minutes: number
          ends_at: string | null
          id: string
          name: string
          short_code: string | null
          show_banner: boolean
          started_at: string | null
          subtitle: string
          theme: string
          title: string
          updated_at: string
          user_id: string
          video_type: string
          video_url: string
          viewers_increment: number
          viewers_initial: number
          viewers_interval: number
          viewers_max: number
        }
        Insert: {
          access_mode?: string
          banner_image_url?: string
          chat_messages_arrival?: Json
          chat_messages_engagement?: Json
          chat_messages_purchase?: Json
          created_at?: string
          cta_color_solid?: string
          cta_delay_minutes?: number
          cta_link?: string
          cta_text?: string
          cta_text_color?: string
          end_timer_enabled?: boolean
          end_timer_minutes?: number
          ends_at?: string | null
          id?: string
          name?: string
          short_code?: string | null
          show_banner?: boolean
          started_at?: string | null
          subtitle?: string
          theme?: string
          title?: string
          updated_at?: string
          user_id: string
          video_type?: string
          video_url?: string
          viewers_increment?: number
          viewers_initial?: number
          viewers_interval?: number
          viewers_max?: number
        }
        Update: {
          access_mode?: string
          banner_image_url?: string
          chat_messages_arrival?: Json
          chat_messages_engagement?: Json
          chat_messages_purchase?: Json
          created_at?: string
          cta_color_solid?: string
          cta_delay_minutes?: number
          cta_link?: string
          cta_text?: string
          cta_text_color?: string
          end_timer_enabled?: boolean
          end_timer_minutes?: number
          ends_at?: string | null
          id?: string
          name?: string
          short_code?: string | null
          show_banner?: boolean
          started_at?: string | null
          subtitle?: string
          theme?: string
          title?: string
          updated_at?: string
          user_id?: string
          video_type?: string
          video_url?: string
          viewers_increment?: number
          viewers_initial?: number
          viewers_interval?: number
          viewers_max?: number
        }
        Relationships: []
      }
      local_offers: {
        Row: {
          created_at: string
          descricao: string
          endereco_oferta: string
          google_maps_link: string
          id: string
          imagem_url: string
          is_active: boolean
          link_produto: string
          merchant_id: string
          nome_produto: string
          preco: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          descricao?: string
          endereco_oferta?: string
          google_maps_link?: string
          id?: string
          imagem_url?: string
          is_active?: boolean
          link_produto?: string
          merchant_id: string
          nome_produto: string
          preco: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          endereco_oferta?: string
          google_maps_link?: string
          id?: string
          imagem_url?: string
          is_active?: boolean
          link_produto?: string
          merchant_id?: string
          nome_produto?: string
          preco?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "local_offers_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "local_offers_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants_public"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          cnpj: string
          created_at: string
          email: string
          endereco: string
          id: string
          is_active: boolean
          licenca_fim: string | null
          licenca_inicio: string | null
          link_contato: string
          logo_url: string
          max_ofertas: number
          nome: string
          nome_comercio: string
          senha: string
          telefone: string
          updated_at: string
        }
        Insert: {
          cnpj?: string
          created_at?: string
          email: string
          endereco?: string
          id?: string
          is_active?: boolean
          licenca_fim?: string | null
          licenca_inicio?: string | null
          link_contato?: string
          logo_url?: string
          max_ofertas?: number
          nome: string
          nome_comercio?: string
          senha: string
          telefone?: string
          updated_at?: string
        }
        Update: {
          cnpj?: string
          created_at?: string
          email?: string
          endereco?: string
          id?: string
          is_active?: boolean
          licenca_fim?: string | null
          licenca_inicio?: string | null
          link_contato?: string
          logo_url?: string
          max_ofertas?: number
          nome?: string
          nome_comercio?: string
          senha?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          network: string
          response_data: Json | null
          scheduled_post_id: string
          social_account_id: string | null
          success: boolean | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          network: string
          response_data?: Json | null
          scheduled_post_id: string
          social_account_id?: string | null
          success?: boolean | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          network?: string
          response_data?: Json | null
          scheduled_post_id?: string
          social_account_id?: string | null
          success?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "post_logs_scheduled_post_id_fkey"
            columns: ["scheduled_post_id"]
            isOneToOne: false
            referencedRelation: "scheduled_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_logs_social_account_id_fkey"
            columns: ["social_account_id"]
            isOneToOne: false
            referencedRelation: "social_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      prospec_analytics: {
        Row: {
          conversion_rate: number | null
          created_at: string
          date: string
          id: string
          messages_delivered: number | null
          messages_sent: number | null
          prospects_found: number | null
          responses_received: number | null
          searches_count: number | null
          social_posts_count: number | null
          user_id: string
        }
        Insert: {
          conversion_rate?: number | null
          created_at?: string
          date: string
          id?: string
          messages_delivered?: number | null
          messages_sent?: number | null
          prospects_found?: number | null
          responses_received?: number | null
          searches_count?: number | null
          social_posts_count?: number | null
          user_id: string
        }
        Update: {
          conversion_rate?: number | null
          created_at?: string
          date?: string
          id?: string
          messages_delivered?: number | null
          messages_sent?: number | null
          prospects_found?: number | null
          responses_received?: number | null
          searches_count?: number | null
          social_posts_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      prospec_api_keys: {
        Row: {
          api_key: string
          api_secret: string | null
          created_at: string
          id: string
          is_active: boolean | null
          last_used_at: string | null
          service: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key: string
          api_secret?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          service: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string
          api_secret?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          service?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prospec_billing_history: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          due_date: string | null
          id: string
          invoice_date: string | null
          paid_at: string | null
          status: string
          stripe_invoice_id: string | null
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          paid_at?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          paid_at?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prospec_billing_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "prospec_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prospec_grid_cache: {
        Row: {
          center: Json
          created_at: string
          grid_data: Json
          grid_size: number
          id: string
          keyword: string
          place_id: string
          radius_km: number
          summary: Json
          user_id: string
        }
        Insert: {
          center?: Json
          created_at?: string
          grid_data?: Json
          grid_size?: number
          id?: string
          keyword: string
          place_id: string
          radius_km?: number
          summary?: Json
          user_id: string
        }
        Update: {
          center?: Json
          created_at?: string
          grid_data?: Json
          grid_size?: number
          id?: string
          keyword?: string
          place_id?: string
          radius_km?: number
          summary?: Json
          user_id?: string
        }
        Relationships: []
      }
      prospec_messages: {
        Row: {
          created_at: string
          delivered_at: string | null
          error_message: string | null
          id: string
          media_urls: string[] | null
          message_text: string
          message_type: string
          prospect_id: string | null
          read_at: string | null
          recipient_phone: string
          sent_at: string | null
          status: string
          user_id: string
          wapi_message_id: string | null
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          media_urls?: string[] | null
          message_text: string
          message_type?: string
          prospect_id?: string | null
          read_at?: string | null
          recipient_phone: string
          sent_at?: string | null
          status?: string
          user_id: string
          wapi_message_id?: string | null
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          media_urls?: string[] | null
          message_text?: string
          message_type?: string
          prospect_id?: string | null
          read_at?: string | null
          recipient_phone?: string
          sent_at?: string | null
          status?: string
          user_id?: string
          wapi_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prospec_messages_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospec_prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      prospec_prospects: {
        Row: {
          address: string | null
          category: string | null
          copy_generated: string | null
          created_at: string
          email: string | null
          id: string
          message_sent_at: string | null
          name: string
          phone: string | null
          place_id: string | null
          rating: number | null
          response_received_at: string | null
          reviews_count: number | null
          search_id: string
          social_media: Json | null
          status: string
          strategy_generated: string | null
          user_id: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          copy_generated?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message_sent_at?: string | null
          name: string
          phone?: string | null
          place_id?: string | null
          rating?: number | null
          response_received_at?: string | null
          reviews_count?: number | null
          search_id: string
          social_media?: Json | null
          status?: string
          strategy_generated?: string | null
          user_id: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          copy_generated?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message_sent_at?: string | null
          name?: string
          phone?: string | null
          place_id?: string | null
          rating?: number | null
          response_received_at?: string | null
          reviews_count?: number | null
          search_id?: string
          social_media?: Json | null
          status?: string
          strategy_generated?: string | null
          user_id?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prospec_prospects_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "prospec_searches"
            referencedColumns: ["id"]
          },
        ]
      }
      prospec_searches: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          filters: Json | null
          id: string
          location: string
          query: string
          radius: number | null
          results_count: number | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          filters?: Json | null
          id?: string
          location: string
          query: string
          radius?: number | null
          results_count?: number | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          filters?: Json | null
          id?: string
          location?: string
          query?: string
          radius?: number | null
          results_count?: number | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      prospec_seo_reports: {
        Row: {
          analysis_data: Json
          created_at: string
          id: string
          prospect_address: string | null
          prospect_category: string | null
          prospect_id: string | null
          prospect_name: string
          report_data: Json
          score: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_data?: Json
          created_at?: string
          id?: string
          prospect_address?: string | null
          prospect_category?: string | null
          prospect_id?: string | null
          prospect_name: string
          report_data?: Json
          score?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_data?: Json
          created_at?: string
          id?: string
          prospect_address?: string | null
          prospect_category?: string | null
          prospect_id?: string | null
          prospect_name?: string
          report_data?: Json
          score?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prospec_seo_reports_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospec_prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      prospec_social_posts: {
        Row: {
          account_id: string
          account_name: string | null
          created_at: string
          description: string | null
          engagement_count: number | null
          error_message: string | null
          id: string
          image_urls: string[] | null
          platform: string
          post_type: string
          posted_at: string | null
          scheduled_at: string | null
          status: string
          title: string | null
          user_id: string
          video_url: string | null
        }
        Insert: {
          account_id: string
          account_name?: string | null
          created_at?: string
          description?: string | null
          engagement_count?: number | null
          error_message?: string | null
          id?: string
          image_urls?: string[] | null
          platform: string
          post_type?: string
          posted_at?: string | null
          scheduled_at?: string | null
          status?: string
          title?: string | null
          user_id: string
          video_url?: string | null
        }
        Update: {
          account_id?: string
          account_name?: string | null
          created_at?: string
          description?: string | null
          engagement_count?: number | null
          error_message?: string | null
          id?: string
          image_urls?: string[] | null
          platform?: string
          post_type?: string
          posted_at?: string | null
          scheduled_at?: string | null
          status?: string
          title?: string | null
          user_id?: string
          video_url?: string | null
        }
        Relationships: []
      }
      prospec_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_agent: string | null
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_agent?: string | null
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      respostas: {
        Row: {
          avaliacao_id: string
          colaborador_id: string
          created_at: string
          dimensao: string
          id: string
          pergunta_id: string
          valor: number
        }
        Insert: {
          avaliacao_id: string
          colaborador_id: string
          created_at?: string
          dimensao?: string
          id?: string
          pergunta_id?: string
          valor?: number
        }
        Update: {
          avaliacao_id?: string
          colaborador_id?: string
          created_at?: string
          dimensao?: string
          id?: string
          pergunta_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "respostas_avaliacao_id_fkey"
            columns: ["avaliacao_id"]
            isOneToOne: false
            referencedRelation: "avaliacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respostas_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_messages: {
        Row: {
          batch_group: string | null
          campaign_type: string
          caption: string | null
          carousel_items: Json | null
          created_at: string
          error_message: string | null
          id: string
          media_url: string | null
          message: string
          message_type: string
          processed_at: string | null
          recipient_email: string | null
          recipient_name: string
          recipient_phone: string
          scheduled_at: string
          status: string
          subject: string | null
          updated_at: string
          use_spintax: boolean
        }
        Insert: {
          batch_group?: string | null
          campaign_type?: string
          caption?: string | null
          carousel_items?: Json | null
          created_at?: string
          error_message?: string | null
          id?: string
          media_url?: string | null
          message?: string
          message_type?: string
          processed_at?: string | null
          recipient_email?: string | null
          recipient_name?: string
          recipient_phone?: string
          scheduled_at: string
          status?: string
          subject?: string | null
          updated_at?: string
          use_spintax?: boolean
        }
        Update: {
          batch_group?: string | null
          campaign_type?: string
          caption?: string | null
          carousel_items?: Json | null
          created_at?: string
          error_message?: string | null
          id?: string
          media_url?: string | null
          message?: string
          message_type?: string
          processed_at?: string | null
          recipient_email?: string | null
          recipient_name?: string
          recipient_phone?: string
          scheduled_at?: string
          status?: string
          subject?: string | null
          updated_at?: string
          use_spintax?: boolean
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          account_ids: string[] | null
          created_at: string | null
          description: string
          error_message: string | null
          facebook_page_id: string | null
          id: string
          image_url: string | null
          instagram_account_id: string | null
          post_to_facebook: boolean | null
          post_to_instagram: boolean | null
          post_type: string | null
          posted_at: string | null
          scheduled_at: string
          status: string | null
          timezone: string | null
          title: string
          updated_at: string | null
          user_id: string
          video_url: string | null
        }
        Insert: {
          account_ids?: string[] | null
          created_at?: string | null
          description: string
          error_message?: string | null
          facebook_page_id?: string | null
          id?: string
          image_url?: string | null
          instagram_account_id?: string | null
          post_to_facebook?: boolean | null
          post_to_instagram?: boolean | null
          post_type?: string | null
          posted_at?: string | null
          scheduled_at: string
          status?: string | null
          timezone?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          video_url?: string | null
        }
        Update: {
          account_ids?: string[] | null
          created_at?: string | null
          description?: string
          error_message?: string | null
          facebook_page_id?: string | null
          id?: string
          image_url?: string | null
          instagram_account_id?: string | null
          post_to_facebook?: boolean | null
          post_to_instagram?: boolean | null
          post_type?: string | null
          posted_at?: string | null
          scheduled_at?: string
          status?: string | null
          timezone?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          video_url?: string | null
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          access_token: string
          account_id: string
          account_name: string
          account_type: string
          account_username: string | null
          connected_at: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          last_used_at: string | null
          refresh_token: string | null
          token_expiry: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          account_id: string
          account_name: string
          account_type: string
          account_username?: string | null
          connected_at?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_used_at?: string | null
          refresh_token?: string | null
          token_expiry?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          account_id?: string
          account_name?: string
          account_type?: string
          account_username?: string | null
          connected_at?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_used_at?: string | null
          refresh_token?: string | null
          token_expiry?: string | null
          user_id?: string
        }
        Relationships: []
      }
      social_media_tokens: {
        Row: {
          created_at: string | null
          facebook_access_token: string | null
          facebook_page_id: string | null
          facebook_token_expiry: string | null
          id: string
          instagram_access_token: string | null
          instagram_account_id: string | null
          instagram_token_expiry: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          facebook_access_token?: string | null
          facebook_page_id?: string | null
          facebook_token_expiry?: string | null
          id?: string
          instagram_access_token?: string | null
          instagram_account_id?: string | null
          instagram_token_expiry?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          facebook_access_token?: string | null
          facebook_page_id?: string | null
          facebook_token_expiry?: string | null
          id?: string
          instagram_access_token?: string | null
          instagram_account_id?: string | null
          instagram_token_expiry?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tour_visits: {
        Row: {
          created_at: string
          id: string
          ip_address: string
          user_agent: string | null
          user_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address: string
          user_agent?: string | null
          user_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string
          user_agent?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          is_approved: boolean
          license_expires_at: string | null
          license_starts_at: string | null
          max_lives: number
          name: string
          trial_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string
          id?: string
          is_approved?: boolean
          license_expires_at?: string | null
          license_starts_at?: string | null
          max_lives?: number
          name?: string
          trial_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_approved?: boolean
          license_expires_at?: string | null
          license_starts_at?: string | null
          max_lives?: number
          name?: string
          trial_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      wapi_message_logs: {
        Row: {
          campaign_batch_id: string | null
          caption: string | null
          content: string
          created_at: string
          error_message: string | null
          id: string
          media_url: string | null
          message_type: string
          recipient_name: string
          recipient_phone: string
          sent_at: string | null
          status: string
          user_id: string | null
          wapi_message_id: string | null
        }
        Insert: {
          campaign_batch_id?: string | null
          caption?: string | null
          content?: string
          created_at?: string
          error_message?: string | null
          id?: string
          media_url?: string | null
          message_type?: string
          recipient_name?: string
          recipient_phone: string
          sent_at?: string | null
          status?: string
          user_id?: string | null
          wapi_message_id?: string | null
        }
        Update: {
          campaign_batch_id?: string | null
          caption?: string | null
          content?: string
          created_at?: string
          error_message?: string | null
          id?: string
          media_url?: string | null
          message_type?: string
          recipient_name?: string
          recipient_phone?: string
          sent_at?: string | null
          status?: string
          user_id?: string | null
          wapi_message_id?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          source: string
          status: string
        }
        Insert: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          source?: string
          status?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          source?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      app_users_login: {
        Row: {
          id: string | null
          nome: string | null
          whatsapp: string | null
        }
        Insert: {
          id?: string | null
          nome?: string | null
          whatsapp?: string | null
        }
        Update: {
          id?: string | null
          nome?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      merchants_public: {
        Row: {
          cnpj: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          id: string | null
          is_active: boolean | null
          licenca_fim: string | null
          licenca_inicio: string | null
          link_contato: string | null
          logo_url: string | null
          max_ofertas: number | null
          nome: string | null
          nome_comercio: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string | null
          is_active?: boolean | null
          licenca_fim?: string | null
          licenca_inicio?: string | null
          link_contato?: string | null
          logo_url?: string | null
          max_ofertas?: number | null
          nome?: string | null
          nome_comercio?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string | null
          is_active?: boolean | null
          licenca_fim?: string | null
          licenca_inicio?: string | null
          link_contato?: string | null
          logo_url?: string | null
          max_ofertas?: number | null
          nome?: string | null
          nome_comercio?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_campaign_templates: { Args: never; Returns: undefined }
      cleanup_old_chat_messages: { Args: never; Returns: undefined }
      cleanup_old_notifications: { Args: never; Returns: undefined }
      generate_xepa_senha: { Args: never; Returns: string }
      get_today_send_count: { Args: never; Returns: number }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      is_merchant_license_active: {
        Args: { _merchant_id: string }
        Returns: boolean
      }
      process_scheduled_notifications: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

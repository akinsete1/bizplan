// ─────────────────────────────────────────────────────────────────
// lib/database.types.ts
// Full TypeScript types for all Supabase database tables
// ─────────────────────────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PlanName = 'free' | 'starter' | 'pro' | 'business';
export type DocumentStatus = 'draft' | 'completed';
export type PaymentStatus = 'pending' | 'successful' | 'failed';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // references auth.users.id
          created_at: string;
          updated_at: string;
          full_name: string | null;
          phone: string | null;
          state: string | null;
          owner_type: string | null;
          plan: PlanName;
          avatar_url: string | null;
          documents_count: number;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string | null;
          phone?: string | null;
          state?: string | null;
          owner_type?: string | null;
          plan?: PlanName;
          avatar_url?: string | null;
          documents_count?: number;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          state?: string | null;
          owner_type?: string | null;
          plan?: PlanName;
          avatar_url?: string | null;
          documents_count?: number;
          updated_at?: string;
        };
      };

      documents: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          template_id: string;
          template_title: string;
          business_name: string | null;
          status: DocumentStatus;
          content: string | null;
          form_data: Json | null;
          is_paid: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          template_id: string;
          template_title: string;
          business_name?: string | null;
          status?: DocumentStatus;
          content?: string | null;
          form_data?: Json | null;
          is_paid?: boolean;
        };
        Update: {
          template_title?: string;
          business_name?: string | null;
          status?: DocumentStatus;
          content?: string | null;
          form_data?: Json | null;
          is_paid?: boolean;
          updated_at?: string;
        };
      };

      payments: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          paystack_reference: string;
          paystack_transaction_id: string | null;
          amount: number; // in kobo
          currency: string;
          plan: PlanName | null;
          document_id: string | null;
          status: PaymentStatus;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          paystack_reference: string;
          paystack_transaction_id?: string | null;
          amount: number;
          currency?: string;
          plan?: PlanName | null;
          document_id?: string | null;
          status?: PaymentStatus;
          metadata?: Json | null;
        };
        Update: {
          paystack_transaction_id?: string | null;
          status?: PaymentStatus;
          metadata?: Json | null;
        };
      };

      subscriptions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          plan: PlanName;
          status: SubscriptionStatus;
          current_period_start: string;
          current_period_end: string;
          paystack_customer_code: string | null;
          paystack_subscription_code: string | null;
          cancelled_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          plan: PlanName;
          status?: SubscriptionStatus;
          current_period_start?: string;
          current_period_end?: string;
          paystack_customer_code?: string | null;
          paystack_subscription_code?: string | null;
          cancelled_at?: string | null;
        };
        Update: {
          plan?: PlanName;
          status?: SubscriptionStatus;
          current_period_start?: string;
          current_period_end?: string;
          paystack_subscription_code?: string | null;
          cancelled_at?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}

// Convenience row types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Document = Database['public']['Tables']['documents']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];

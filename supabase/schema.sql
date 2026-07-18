-- ═══════════════════════════════════════════════════════════════
-- BizPlan Nigeria — Supabase Database Schema
-- Run this in: https://app.supabase.com → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- ─── EXTENSIONS ──────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES TABLE ───────────────────────────────────────────────
-- Extends Supabase auth.users with business-specific fields
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  full_name       TEXT,
  phone           TEXT,
  state           TEXT,
  owner_type      TEXT,
  plan            TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'business')),
  avatar_url      TEXT,
  documents_count INTEGER DEFAULT 0
);

-- ─── DOCUMENTS TABLE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.documents (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id     TEXT NOT NULL,
  template_title  TEXT NOT NULL,
  business_name   TEXT,
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed')),
  content         TEXT,
  form_data       JSONB,
  is_paid         BOOLEAN DEFAULT FALSE
);

-- ─── PAYMENTS TABLE ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id                        UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at                TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id                   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  paystack_reference        TEXT UNIQUE NOT NULL,
  paystack_transaction_id   TEXT,
  amount                    INTEGER NOT NULL, -- in kobo (NGN × 100)
  currency                  TEXT DEFAULT 'NGN',
  plan                      TEXT CHECK (plan IN ('free', 'starter', 'pro', 'business', NULL)),
  document_id               UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  status                    TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed')),
  metadata                  JSONB
);

-- ─── SUBSCRIPTIONS TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at                  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at                  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id                     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan                        TEXT NOT NULL CHECK (plan IN ('free', 'starter', 'pro', 'business')),
  status                      TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_start        TIMESTAMPTZ DEFAULT NOW(),
  current_period_end          TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  paystack_customer_code      TEXT,
  paystack_subscription_code  TEXT,
  cancelled_at                TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Auto-create profile when a user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Users can only see and modify their own data
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: users manage their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Documents: users manage their own documents
CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON public.documents FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.documents FOR DELETE USING (auth.uid() = user_id);

-- Payments: users view their own payments (no direct insert — done via webhook)
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions: users view their own subscription
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES (for performance)
-- ═══════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments(paystack_reference);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);

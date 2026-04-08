-- V0 Schema Migration: Core entities for Calm Separation Workspace
-- Run this in your Supabase SQL Editor or via Supabase CLI

-- ══════════════════════════════════════════════════════════
-- ENUMS
-- ══════════════════════════════════════════════════════════

create type case_status as enum ('active', 'archived', 'closed');
create type participant_role as enum ('applicant', 'respondent', 'mediator', 'adviser');
create type invite_status as enum ('pending', 'accepted', 'declined');
create type proposal_status as enum ('draft', 'shared', 'accepted', 'disputed', 'superseded', 'withdrawn');
create type financial_category as enum ('asset', 'liability', 'income', 'pension', 'property', 'obligation', 'other');
create type confidence_state as enum ('known', 'estimated', 'unsure', 'unknown');
create type follow_up_state as enum ('fine_for_now', 'confirm_later', 'priority_to_confirm', 'resolved');
create type visibility_state as enum ('private', 'shared', 'requested', 'disputed', 'accepted', 'archived');
create type document_processing_status as enum ('pending', 'processing', 'completed', 'failed');
create type extraction_review_status as enum ('pending', 'accepted', 'corrected', 'rejected');
create type question_status as enum ('open', 'in_progress', 'answered', 'resolved', 'deferred');
create type question_priority as enum ('low', 'medium', 'high');
create type output_type as enum ('plan_summary', 'disclosure_pack', 'adviser_bundle', 'consent_order_draft', 'd81_data', 'form_a_data', 'mediation_agenda', 'unresolved_summary');
create type output_format as enum ('json', 'pdf', 'html');
create type timeline_actor_type as enum ('user', 'system', 'ai');
create type permission_level as enum ('none', 'view', 'comment', 'edit', 'admin');
create type workspace_phase as enum ('build_your_picture', 'share_and_disclose', 'work_through_it', 'reach_agreement', 'make_it_official');
create type readiness_tier as enum ('full', 'partial', 'thin', 'not_ready');
create type chapter_status as enum ('not_started', 'in_progress', 'completed', 'skipped', 'not_applicable');

-- ══════════════════════════════════════════════════════════
-- TABLES
-- ══════════════════════════════════════════════════════════

-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  supabase_auth_id uuid unique not null references auth.users(id) on delete cascade,
  display_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Cases (Workspaces)
create table cases (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  title text,
  status case_status not null default 'active',
  current_phase workspace_phase not null default 'build_your_picture',
  safeguarding jsonb not null default '{"risk_signals_detected": false, "flags": [], "route_adjustments": [], "resources_surfaced": false, "assessed_at": null}'::jsonb,
  chapter_progress jsonb not null default '{"situation": "not_started", "route": "not_started", "children": "not_started", "home": "not_started", "finances": "not_started", "confidence": "not_started"}'::jsonb,
  readiness_tier readiness_tier,
  plan_generated boolean not null default false,
  pdf_generated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Participants
create table participants (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  role participant_role not null,
  invite_status invite_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- Proposals
create table proposals (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  author_id uuid not null references participants(id) on delete cascade,
  version integer not null default 1,
  parent_proposal_id uuid references proposals(id) on delete set null,
  status proposal_status not null default 'draft',
  children_arrangements jsonb,
  housing_arrangements jsonb,
  financial_arrangements jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Financial Items
create table financial_items (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  participant_id uuid not null references participants(id) on delete cascade,
  category financial_category not null,
  subcategory text,
  description text not null,
  value_amount decimal,
  value_currency text not null default 'GBP',
  confidence_state confidence_state not null default 'unknown',
  follow_up_state follow_up_state not null default 'fine_for_now',
  visibility visibility_state not null default 'private',
  source_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Documents (Evidence Items)
create table documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  uploaded_by uuid not null references participants(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  storage_path text not null,
  file_size bigint not null,
  classification text,
  classification_confidence decimal,
  processing_status document_processing_status not null default 'pending',
  visibility visibility_state not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Extracted Fields
create table extracted_fields (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  financial_item_id uuid references financial_items(id) on delete set null,
  field_name text not null,
  extracted_value text not null,
  confidence decimal not null,
  review_status extraction_review_status not null default 'pending',
  corrected_value text,
  reviewed_by uuid references participants(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Questions (Clarification Items)
create table questions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  raised_by uuid not null references participants(id) on delete cascade,
  assigned_to uuid references participants(id) on delete set null,
  category text not null,
  question_text text not null,
  context text,
  status question_status not null default 'open',
  priority question_priority not null default 'medium',
  answer_text text,
  answered_by uuid references participants(id) on delete set null,
  answered_at timestamptz,
  linked_financial_item_id uuid references financial_items(id) on delete set null,
  linked_document_id uuid references documents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Outputs (Packs)
create table outputs (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  generated_by uuid not null references participants(id) on delete cascade,
  output_type output_type not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  format output_format not null default 'json',
  storage_path text,
  version integer not null default 1,
  created_at timestamptz not null default now()
);

-- Timeline Events (Audit Log)
create table timeline_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  actor_id uuid references participants(id) on delete set null,
  actor_type timeline_actor_type not null default 'system',
  event_type text not null,
  event_data jsonb not null default '{}'::jsonb,
  related_entity_type text,
  related_entity_id uuid,
  created_at timestamptz not null default now()
);

-- Permissions
create table permissions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  participant_id uuid not null references participants(id) on delete cascade,
  resource_type text not null,
  resource_id uuid not null,
  permission_level permission_level not null default 'none',
  granted_by uuid not null references participants(id) on delete cascade,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

-- ══════════════════════════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════════════════════════

create index idx_users_auth_id on users(supabase_auth_id);
create index idx_cases_owner on cases(owner_id);
create index idx_participants_case on participants(case_id);
create index idx_participants_user on participants(user_id);
create index idx_proposals_case on proposals(case_id);
create index idx_financial_items_case on financial_items(case_id);
create index idx_documents_case on documents(case_id);
create index idx_extracted_fields_document on extracted_fields(document_id);
create index idx_questions_case on questions(case_id);
create index idx_outputs_case on outputs(case_id);
create index idx_timeline_events_case on timeline_events(case_id);
create index idx_timeline_events_created on timeline_events(case_id, created_at desc);
create index idx_permissions_case on permissions(case_id);
create index idx_permissions_resource on permissions(resource_type, resource_id);

-- ══════════════════════════════════════════════════════════
-- UPDATED_AT TRIGGERS
-- ══════════════════════════════════════════════════════════

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on users for each row execute function update_updated_at();
create trigger set_updated_at before update on cases for each row execute function update_updated_at();
create trigger set_updated_at before update on proposals for each row execute function update_updated_at();
create trigger set_updated_at before update on financial_items for each row execute function update_updated_at();
create trigger set_updated_at before update on documents for each row execute function update_updated_at();
create trigger set_updated_at before update on questions for each row execute function update_updated_at();

-- ══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════

-- Enable RLS on all tables
alter table users enable row level security;
alter table cases enable row level security;
alter table participants enable row level security;
alter table proposals enable row level security;
alter table financial_items enable row level security;
alter table documents enable row level security;
alter table extracted_fields enable row level security;
alter table questions enable row level security;
alter table outputs enable row level security;
alter table timeline_events enable row level security;
alter table permissions enable row level security;

-- ── Users ──
-- Users can read and update their own record
create policy "users_select_own" on users for select using (supabase_auth_id = auth.uid());
create policy "users_update_own" on users for update using (supabase_auth_id = auth.uid());
create policy "users_insert_own" on users for insert with check (supabase_auth_id = auth.uid());

-- ── Cases ──
-- Users can access cases they own or participate in
create policy "cases_select" on cases for select using (
  owner_id in (select id from users where supabase_auth_id = auth.uid())
  or id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);
create policy "cases_insert" on cases for insert with check (
  owner_id in (select id from users where supabase_auth_id = auth.uid())
);
create policy "cases_update" on cases for update using (
  owner_id in (select id from users where supabase_auth_id = auth.uid())
);

-- ── Participants ──
-- Users can see participants in their cases
create policy "participants_select" on participants for select using (
  case_id in (select id from cases where owner_id in (select id from users where supabase_auth_id = auth.uid()))
  or user_id in (select id from users where supabase_auth_id = auth.uid())
);
create policy "participants_insert" on participants for insert with check (
  case_id in (select id from cases where owner_id in (select id from users where supabase_auth_id = auth.uid()))
);

-- ── Financial Items, Proposals, Documents, Questions, Outputs, Timeline Events, Extracted Fields, Permissions ──
-- All scoped to case participation
create policy "financial_items_select" on financial_items for select using (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);
create policy "financial_items_insert" on financial_items for insert with check (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);
create policy "financial_items_update" on financial_items for update using (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);

create policy "proposals_select" on proposals for select using (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);
create policy "proposals_insert" on proposals for insert with check (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);
create policy "proposals_update" on proposals for update using (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);

create policy "documents_select" on documents for select using (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);
create policy "documents_insert" on documents for insert with check (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);

create policy "extracted_fields_select" on extracted_fields for select using (
  document_id in (select id from documents where case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid())))
);
create policy "extracted_fields_update" on extracted_fields for update using (
  document_id in (select id from documents where case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid())))
);

create policy "questions_select" on questions for select using (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);
create policy "questions_insert" on questions for insert with check (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);
create policy "questions_update" on questions for update using (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);

create policy "outputs_select" on outputs for select using (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);
create policy "outputs_insert" on outputs for insert with check (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);

create policy "timeline_events_select" on timeline_events for select using (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);
create policy "timeline_events_insert" on timeline_events for insert with check (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);

create policy "permissions_select" on permissions for select using (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);
create policy "permissions_insert" on permissions for insert with check (
  case_id in (select case_id from participants where user_id in (select id from users where supabase_auth_id = auth.uid()))
);

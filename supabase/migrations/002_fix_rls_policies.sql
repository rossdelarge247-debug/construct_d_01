-- V0 Schema Fix: Replace recursive RLS policies with direct auth.uid() checks
-- Run this in Supabase SQL Editor AFTER the initial migration

-- Drop all existing policies
drop policy if exists "users_select_own" on users;
drop policy if exists "users_update_own" on users;
drop policy if exists "users_insert_own" on users;
drop policy if exists "cases_select" on cases;
drop policy if exists "cases_insert" on cases;
drop policy if exists "cases_update" on cases;
drop policy if exists "participants_select" on participants;
drop policy if exists "participants_insert" on participants;
drop policy if exists "financial_items_select" on financial_items;
drop policy if exists "financial_items_insert" on financial_items;
drop policy if exists "financial_items_update" on financial_items;
drop policy if exists "proposals_select" on proposals;
drop policy if exists "proposals_insert" on proposals;
drop policy if exists "proposals_update" on proposals;
drop policy if exists "documents_select" on documents;
drop policy if exists "documents_insert" on documents;
drop policy if exists "extracted_fields_select" on extracted_fields;
drop policy if exists "extracted_fields_update" on extracted_fields;
drop policy if exists "questions_select" on questions;
drop policy if exists "questions_insert" on questions;
drop policy if exists "questions_update" on questions;
drop policy if exists "outputs_select" on outputs;
drop policy if exists "outputs_insert" on outputs;
drop policy if exists "timeline_events_select" on timeline_events;
drop policy if exists "timeline_events_insert" on timeline_events;
drop policy if exists "permissions_select" on permissions;
drop policy if exists "permissions_insert" on permissions;

-- ══════════════════════════════════════════════════════════
-- FIXED RLS POLICIES — no cross-table recursion
-- Uses auth.uid() directly against supabase_auth_id
-- ══════════════════════════════════════════════════════════

-- Users: direct check against auth.uid()
create policy "users_select_own" on users for select using (supabase_auth_id = auth.uid());
create policy "users_update_own" on users for update using (supabase_auth_id = auth.uid());
create policy "users_insert_own" on users for insert with check (supabase_auth_id = auth.uid());

-- Cases: owner check via direct join
create policy "cases_select" on cases for select using (
  exists (select 1 from users where users.id = cases.owner_id and users.supabase_auth_id = auth.uid())
  or exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = cases.id and users.supabase_auth_id = auth.uid())
);
create policy "cases_insert" on cases for insert with check (
  exists (select 1 from users where users.id = cases.owner_id and users.supabase_auth_id = auth.uid())
);
create policy "cases_update" on cases for update using (
  exists (select 1 from users where users.id = cases.owner_id and users.supabase_auth_id = auth.uid())
);

-- Participants: check via case ownership or own participation
create policy "participants_select" on participants for select using (
  exists (select 1 from cases join users on users.id = cases.owner_id where cases.id = participants.case_id and users.supabase_auth_id = auth.uid())
  or exists (select 1 from users where users.id = participants.user_id and users.supabase_auth_id = auth.uid())
);
create policy "participants_insert" on participants for insert with check (
  exists (select 1 from cases join users on users.id = cases.owner_id where cases.id = participants.case_id and users.supabase_auth_id = auth.uid())
);

-- Helper: all case-scoped tables use this pattern
-- "user participates in this case" = exists participant row with matching auth.uid()

-- Financial Items
create policy "financial_items_select" on financial_items for select using (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = financial_items.case_id and users.supabase_auth_id = auth.uid())
);
create policy "financial_items_insert" on financial_items for insert with check (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = financial_items.case_id and users.supabase_auth_id = auth.uid())
);
create policy "financial_items_update" on financial_items for update using (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = financial_items.case_id and users.supabase_auth_id = auth.uid())
);

-- Proposals
create policy "proposals_select" on proposals for select using (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = proposals.case_id and users.supabase_auth_id = auth.uid())
);
create policy "proposals_insert" on proposals for insert with check (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = proposals.case_id and users.supabase_auth_id = auth.uid())
);
create policy "proposals_update" on proposals for update using (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = proposals.case_id and users.supabase_auth_id = auth.uid())
);

-- Documents
create policy "documents_select" on documents for select using (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = documents.case_id and users.supabase_auth_id = auth.uid())
);
create policy "documents_insert" on documents for insert with check (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = documents.case_id and users.supabase_auth_id = auth.uid())
);

-- Extracted Fields
create policy "extracted_fields_select" on extracted_fields for select using (
  exists (
    select 1 from documents
    join participants on participants.case_id = documents.case_id
    join users on users.id = participants.user_id
    where documents.id = extracted_fields.document_id and users.supabase_auth_id = auth.uid()
  )
);
create policy "extracted_fields_update" on extracted_fields for update using (
  exists (
    select 1 from documents
    join participants on participants.case_id = documents.case_id
    join users on users.id = participants.user_id
    where documents.id = extracted_fields.document_id and users.supabase_auth_id = auth.uid()
  )
);

-- Questions
create policy "questions_select" on questions for select using (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = questions.case_id and users.supabase_auth_id = auth.uid())
);
create policy "questions_insert" on questions for insert with check (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = questions.case_id and users.supabase_auth_id = auth.uid())
);
create policy "questions_update" on questions for update using (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = questions.case_id and users.supabase_auth_id = auth.uid())
);

-- Outputs
create policy "outputs_select" on outputs for select using (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = outputs.case_id and users.supabase_auth_id = auth.uid())
);
create policy "outputs_insert" on outputs for insert with check (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = outputs.case_id and users.supabase_auth_id = auth.uid())
);

-- Timeline Events
create policy "timeline_events_select" on timeline_events for select using (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = timeline_events.case_id and users.supabase_auth_id = auth.uid())
);
create policy "timeline_events_insert" on timeline_events for insert with check (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = timeline_events.case_id and users.supabase_auth_id = auth.uid())
);

-- Permissions
create policy "permissions_select" on permissions for select using (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = permissions.case_id and users.supabase_auth_id = auth.uid())
);
create policy "permissions_insert" on permissions for insert with check (
  exists (select 1 from participants join users on users.id = participants.user_id where participants.case_id = permissions.case_id and users.supabase_auth_id = auth.uid())
);

// Workspace state persistence via Supabase
// Handles saving and loading the financial picture from the database

import { createClient } from '@/lib/supabase/client'
import type { FinancialPictureItem, SpendingCategory, DocumentUpload } from '@/types/workspace'

interface WorkspaceData {
  items: FinancialPictureItem[]
  spending: SpendingCategory[]
  documents: DocumentUpload[]
}

const STORAGE_KEY = 'decouple_workspace'

// For now: localStorage persistence with Supabase as future upgrade
// This ensures state survives refresh without requiring auth

export function saveWorkspace(data: WorkspaceData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('[Workspace] Failed to save to localStorage:', e)
  }
}

export function loadWorkspace(): WorkspaceData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as WorkspaceData
  } catch {
    return null
  }
}

export function clearWorkspace(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

// Future: Supabase persistence for authenticated users
export async function saveWorkspaceToSupabase(caseId: string, data: WorkspaceData): Promise<boolean> {
  try {
    const supabase = createClient()

    // Save each item as a financial_item row
    // This will be implemented when we wire up the full auth flow in V1.5
    console.log('[Workspace] Supabase save not yet implemented for case:', caseId)
    return false
  } catch {
    return false
  }
}

export async function loadWorkspaceFromSupabase(caseId: string): Promise<WorkspaceData | null> {
  try {
    const supabase = createClient()

    // Load from financial_items table
    // This will be implemented when we wire up the full auth flow in V1.5
    console.log('[Workspace] Supabase load not yet implemented for case:', caseId)
    return null
  } catch {
    return null
  }
}

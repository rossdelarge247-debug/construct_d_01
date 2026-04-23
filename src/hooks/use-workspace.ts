'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { saveWorkspace, loadWorkspace } from '@/lib/supabase/workspace-store'
import type { FinancialPictureItem, DocumentUpload, FinancialSummary, ReadinessState, SpendingCategory } from '@/types/workspace'

export function useWorkspace() {
  const [items, setItems] = useState<FinancialPictureItem[]>([])
  const [documents, setDocuments] = useState<DocumentUpload[]>([])
  const [spending, setSpending] = useState<SpendingCategory[]>([])
  const [loaded, setLoaded] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load on mount
  useEffect(() => {
    const stored = loadWorkspace()
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(stored.items)
      setSpending(stored.spending)
      setDocuments(stored.documents)
    }
    setLoaded(true)
  }, [])

  // Auto-save on change (debounced)
  useEffect(() => {
    if (!loaded) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveWorkspace({ items, spending, documents })
    }, 500)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [items, spending, documents, loaded])

  const addItem = useCallback((item: FinancialPictureItem) => {
    setItems(prev => [...prev, item])
  }, [])

  const updateItem = useCallback((id: string, updates: Partial<FinancialPictureItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item))
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const addDocument = useCallback((doc: DocumentUpload) => {
    setDocuments(prev => [...prev, doc])
  }, [])

  const updateDocument = useCallback((id: string, updates: Partial<DocumentUpload>) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc))
  }, [])

  // Calculate live financial summary
  const summary: FinancialSummary = (() => {
    const assets = items
      .filter(i => ['asset', 'property', 'pension'].includes(i.category) || i.subcategory === 'savings' || i.subcategory === 'investment')
      .filter(i => i.value !== null && i.period === 'total')
      .reduce((sum, i) => sum + (i.value! * (i.split / 100)), 0)

    const propertyItems = items
      .filter(i => i.category === 'property' && i.value !== null && i.period === 'total')
      .reduce((sum, i) => sum + (i.value! * (i.split / 100)), 0)

    const pensionItems = items
      .filter(i => i.category === 'pension' && i.value !== null && i.period === 'total')
      .reduce((sum, i) => sum + (i.value! * (i.split / 100)), 0)

    const liabilities = items
      .filter(i => i.category === 'liability' || i.subcategory === 'mortgage' || i.subcategory === 'debt')
      .filter(i => i.value !== null)
      .reduce((sum, i) => sum + (i.value! * (i.split / 100)), 0)

    const monthlyIncome = items
      .filter(i => i.category === 'income' && i.value !== null && i.period === 'monthly')
      .reduce((sum, i) => sum + i.value!, 0)

    const monthlyOutgoings = spending.reduce((sum, s) => sum + s.monthly_average, 0)

    const confirmed = items.filter(i => i.status === 'confirmed').length
    const toReview = items.filter(i => i.status === 'to_review').length
    const estimated = items.filter(i => i.status === 'estimated').length
    const missing = items.filter(i => i.status === 'placeholder' || i.status === 'awaiting').length

    const categoriesWithItems = new Set(items.map(i => i.category)).size

    return {
      total_assets: assets + propertyItems + pensionItems,
      total_liabilities: liabilities,
      net_position: assets + propertyItems + pensionItems - liabilities,
      monthly_income: monthlyIncome,
      monthly_outgoings: monthlyOutgoings,
      items_confirmed: confirmed,
      items_to_review: toReview,
      items_estimated: estimated,
      items_missing: missing,
      categories_started: categoriesWithItems,
      categories_total: 9,
    }
  })()

  // Calculate readiness
  const readiness: ReadinessState = (() => {
    const hasIncome = items.some(i => i.category === 'income' && (i.status === 'confirmed' || i.status === 'estimated'))
    const hasProperty = items.some(i => i.category === 'property')
    const hasPensions = items.some(i => i.category === 'pension')
    const hasDebts = items.some(i => i.category === 'liability' || i.subcategory === 'mortgage' || i.subcategory === 'debt')
    const hasSavings = items.some(i => i.subcategory === 'savings' || i.subcategory === 'bank_account' || i.subcategory === 'current_account')
    const hasSpending = spending.length > 0

    const majorCategories = [hasIncome, hasProperty, hasPensions, hasDebts, hasSavings, hasSpending]
    const coveredCount = majorCategories.filter(Boolean).length
    const confirmedRatio = items.length > 0 ? summary.items_confirmed / items.length : 0

    const blockers: string[] = []
    if (!hasIncome) blockers.push('Income not yet captured')
    if (!hasPensions) blockers.push('Pension information needed')
    if (!hasSpending) blockers.push('Spending not yet categorised')
    if (summary.items_to_review > 0) blockers.push(`${summary.items_to_review} item${summary.items_to_review > 1 ? 's' : ''} to review`)

    // Awaiting items (e.g. CETV)
    const awaitingItems = items.filter(i => i.status === 'awaiting')
    awaitingItems.forEach(i => blockers.push(`Awaiting: ${i.label}`))

    if (items.length === 0) {
      return { level: 'not_started', label: 'Not started yet', description: 'Upload documents or enter details to begin building your picture', progress: 0, blockers }
    }

    if (coveredCount >= 5 && confirmedRatio > 0.9 && blockers.length === 0) {
      return { level: 'disclosure', label: 'Ready for formal disclosure', description: 'Your picture is comprehensive enough for formal financial exchange', progress: 85, blockers }
    }

    if (coveredCount >= 4 && confirmedRatio > 0.5) {
      return { level: 'first_draft', label: 'Ready to share with a mediator', description: 'Enough for an initial conversation about your finances', progress: 55, blockers }
    }

    if (coveredCount >= 2) {
      return { level: 'not_started', label: 'Taking shape', description: `${coveredCount} areas covered. Keep adding to strengthen your picture.`, progress: coveredCount * 8, blockers }
    }

    return { level: 'not_started', label: 'Getting started', description: 'Each document you add builds the picture', progress: Math.min(15, items.length * 5), blockers }
  })()

  return {
    items,
    documents,
    spending,
    summary,
    readiness,
    loaded,
    addItem,
    updateItem,
    removeItem,
    addDocument,
    updateDocument,
    setSpending,
  }
}

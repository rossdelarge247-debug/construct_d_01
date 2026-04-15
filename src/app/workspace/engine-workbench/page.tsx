'use client'

// Engine Workbench — dev-only page for testing the decisioning engine.
// Load scenarios or CSVs, see every classification, mark corrections,
// run regression against golden test data.

import React, { useState, useMemo, useCallback } from 'react'
import { parseCSVToExtraction, type ParsedTransaction } from '@/lib/bank/csv-parser'
import { transformExtractionResult } from '@/lib/ai/result-transformer'
import { generateSectionSteps, CONFIRMATION_SECTIONS } from '@/lib/bank/confirmation-questions'
import { getAllTestScenarios, type TestScenario, type ExpectedPayment, type ExpectedIncome } from '@/lib/bank/test-scenarios'
import { toNtropyInput, type NtropyEnrichedTransaction } from '@/lib/bank/ntropy-client'
import { runSignalDetection, type SignalDetectionResult } from '@/lib/bank/signal-rules'
import { addCorrection } from '@/lib/bank/user-corrections'
import { normaliseDescription } from '@/lib/bank/csv-parser'
import type { BankStatementExtraction, DetectedPayment, ExtractedIncome } from '@/lib/ai/extraction-schemas'

// ═══ Scenario runner ═══

interface ClassificationResult {
  payee: string
  amount: number               // Average per occurrence
  frequency: string
  autoCategory: string
  confidence: number
  expectedCategory?: string
  isCorrect: boolean | null
  dates: string[]              // Raw transaction dates for this payee
  txCount: number              // Number of raw transactions
  rawTotal: number             // Sum of all raw transaction amounts (not the average)
}

interface IncomeResult {
  source: string
  amount: number
  type: string
  confidence: number
  expectedType?: string
  isCorrect: boolean | null
}

interface QuestionResult {
  sectionKey: string
  id: string
  text: string
  fired: boolean
}

interface RunResult {
  scenarioName: string
  extractions: BankStatementExtraction[]
  classifications: ClassificationResult[]
  incomes: IncomeResult[]
  questions: QuestionResult[]
  stats: {
    totalPayments: number
    classified: number
    unknown: number
    classifiedRate: number
    correctCount: number
    incorrectCount: number
    uncheckableCount: number
    accuracy: number
  }
}

// Find raw transactions for a classified payee — returns dates, count, and total
function findRawTxnData(payee: string, rawTxns: ParsedTransaction[]): { dates: string[]; txCount: number; rawTotal: number } {
  const key = normaliseDescription(payee)
  const matching = rawTxns.filter(t => normaliseDescription(t.description) === key)
  return {
    dates: matching.map(t => t.date).sort(),
    txCount: matching.length,
    rawTotal: Math.round(matching.reduce((sum, t) => sum + Math.abs(t.amount), 0)),
  }
}

function runScenario(scenario: TestScenario): RunResult {
  // Build CSV text from scenario transactions
  const csvLines = ['Date,Description,Amount']
  for (const tx of scenario.transactions) {
    const escaped = tx.description.includes(',') ? `"${tx.description}"` : tx.description
    csvLines.push(`${tx.date},${escaped},${tx.amount}`)
  }
  const csvText = csvLines.join('\n')

  // Parse through the CSV parser
  const { extraction, rawTransactions } = parseCSVToExtraction(csvText, `${scenario.provider}.csv`)
  extraction.provider = scenario.provider
  extraction.account_type = scenario.accountType
  extraction.is_joint = scenario.isJoint

  const extractions = [extraction]

  // Run through result-transformer (validates it doesn't crash; we inspect the extraction directly)
  transformExtractionResult(
    { document_type: 'bank_statement', confidence: 0.95, provider: scenario.provider, description: 'Test scenario' },
    extraction,
  )

  // Run through confirmation-questions for each section
  const allQuestions: QuestionResult[] = []
  for (const sectionKey of CONFIRMATION_SECTIONS) {
    const steps = generateSectionSteps(sectionKey, extractions)
    for (const step of steps) {
      allQuestions.push({
        sectionKey,
        id: step.id,
        text: step.text,
        fired: !step.showWhen, // Top-level questions always fire; conditional ones depend on answers
      })
    }
  }

  // Match classifications against expectations
  const classifications: ClassificationResult[] = extraction.regular_payments.map((p: DetectedPayment) => {
    const expected = scenario.expectedPayments.find(
      (ep: ExpectedPayment) => p.payee.toLowerCase().includes(ep.payeeSubstring.toLowerCase())
    )
    const isCorrect = expected
      ? p.likely_category === expected.expectedCategory
      : null
    const txnData = findRawTxnData(p.payee, rawTransactions)
    return {
      payee: p.payee,
      amount: p.amount,
      frequency: p.frequency,
      autoCategory: p.likely_category,
      confidence: p.confidence,
      expectedCategory: expected?.expectedCategory,
      isCorrect,
      ...txnData,
    }
  })

  // Match income against expectations
  const incomes: IncomeResult[] = extraction.income_deposits.map((i: ExtractedIncome) => {
    const expected = scenario.expectedIncomes.find(
      (ei: ExpectedIncome) => i.source.toLowerCase().includes(ei.sourceSubstring.toLowerCase())
    )
    const isCorrect = expected ? i.type === expected.expectedType : null
    return {
      source: i.source,
      amount: i.amount,
      type: i.type,
      confidence: i.confidence,
      expectedType: expected?.expectedType,
      isCorrect,
    }
  })

  // Calculate stats
  const totalPayments = classifications.length
  const classified = classifications.filter((c) => c.autoCategory !== 'unknown').length
  const unknown = totalPayments - classified
  const classifiedRate = totalPayments > 0 ? classified / totalPayments : 0
  const withExpectation = classifications.filter((c) => c.isCorrect !== null)
  const correctCount = withExpectation.filter((c) => c.isCorrect === true).length
  const incorrectCount = withExpectation.filter((c) => c.isCorrect === false).length
  const uncheckableCount = classifications.filter((c) => c.isCorrect === null).length
  const accuracy = withExpectation.length > 0 ? correctCount / withExpectation.length : 0

  return {
    scenarioName: scenario.name,
    extractions,
    classifications,
    incomes,
    questions: allQuestions,
    stats: { totalPayments, classified, unknown, classifiedRate, correctCount, incorrectCount, uncheckableCount, accuracy },
  }
}

// ═══ Ntropy comparison ═══

interface NtropyComparison {
  payee: string
  amount: number
  ourCategory: string
  ntropyMerchant: string | null
  ntropyLabels: string[]
  agree: boolean | null  // null = can't determine
}

interface NtropyComparisonResult {
  comparisons: NtropyComparison[]
  latencyMs: number
  creditsUsed: number
  error: string | null
}

// ═══ UI ═══

type TabId = 'classifications' | 'incomes' | 'questions' | 'ntropy' | 'rules'

export default function EngineWorkbenchPage() {
  const scenarios = useMemo(() => getAllTestScenarios(), [])
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0]?.id ?? '')
  const [result, setResult] = useState<RunResult | null>(null)
  const [csvResult, setCsvResult] = useState<RunResult | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('classifications')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterBucket, setFilterBucket] = useState<string>('all')
  const [groupByPayee, setGroupByPayee] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const [ntropyResult, setNtropyResult] = useState<NtropyComparisonResult | null>(null)
  const [ntropyLoading, setNtropyLoading] = useState(false)

  const activeResult = csvResult || result

  // Run signal detection whenever results change
  const signalResult = useMemo<SignalDetectionResult | null>(() => {
    if (!activeResult) return null
    const allPayments = activeResult.extractions.flatMap(e => e.regular_payments)
    const allIncomes = activeResult.extractions.flatMap(e => e.income_deposits)
    const allTransactions = activeResult.classifications.map(c => ({
      date: '2025-06-01',
      description: c.payee,
      amount: c.autoCategory === 'unknown' ? -c.amount : -c.amount,
    }))
    // Also add income as positive transactions
    for (const inc of allIncomes) {
      allTransactions.push({ date: '2025-06-01', description: inc.source, amount: inc.amount })
    }
    return runSignalDetection({
      incomes: allIncomes,
      payments: allPayments,
      transactions: allTransactions,
      accountMeta: {
        provider: activeResult.extractions[0]?.provider ?? 'Unknown',
        isJoint: activeResult.extractions[0]?.is_joint ?? false,
        type: activeResult.extractions[0]?.account_type ?? 'current',
      },
    })
  }, [activeResult])

  const handleRunScenario = useCallback(() => {
    const scenario = scenarios.find((s) => s.id === selectedScenarioId)
    if (!scenario) return
    setCsvResult(null)
    setResult(runScenario(scenario))
    setFilterCategory('all')
  }, [selectedScenarioId, scenarios])

  const handleRunAll = useCallback(() => {
    // Run all scenarios and show combined results
    const allResults: RunResult[] = scenarios.map((s: TestScenario) => runScenario(s))
    const combined: RunResult = {
      scenarioName: `All ${allResults.length} scenarios`,
      extractions: allResults.flatMap((r) => r.extractions),
      classifications: allResults.flatMap((r) => r.classifications),
      incomes: allResults.flatMap((r) => r.incomes),
      questions: allResults.flatMap((r) => r.questions),
      stats: {
        totalPayments: allResults.reduce((s, r) => s + r.stats.totalPayments, 0),
        classified: allResults.reduce((s, r) => s + r.stats.classified, 0),
        unknown: allResults.reduce((s, r) => s + r.stats.unknown, 0),
        classifiedRate: 0,
        correctCount: allResults.reduce((s, r) => s + r.stats.correctCount, 0),
        incorrectCount: allResults.reduce((s, r) => s + r.stats.incorrectCount, 0),
        uncheckableCount: allResults.reduce((s, r) => s + r.stats.uncheckableCount, 0),
        accuracy: 0,
      },
    }
    combined.stats.classifiedRate = combined.stats.totalPayments > 0
      ? combined.stats.classified / combined.stats.totalPayments
      : 0
    const withExp = combined.stats.correctCount + combined.stats.incorrectCount
    combined.stats.accuracy = withExp > 0 ? combined.stats.correctCount / withExp : 0
    setCsvResult(null)
    setResult(combined)
    setFilterCategory('all')
  }, [scenarios])

  const handleCSVUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      if (!text) return
      try {
        const { extraction, rawTransactions } = parseCSVToExtraction(text, file.name)
        const extractions = [extraction]
        transformExtractionResult(
          { document_type: 'bank_statement', confidence: 0.95, provider: extraction.provider, description: 'CSV import' },
          extraction,
        )
        const allQuestions: QuestionResult[] = []
        for (const sectionKey of CONFIRMATION_SECTIONS) {
          const steps = generateSectionSteps(sectionKey, extractions)
          for (const step of steps) {
            allQuestions.push({
              sectionKey,
              id: step.id,
              text: step.text,
              fired: !step.showWhen,
            })
          }
        }
        const classifications: ClassificationResult[] = extraction.regular_payments.map((p: DetectedPayment) => {
          const txnData = findRawTxnData(p.payee, rawTransactions)
          return {
            payee: p.payee,
            amount: p.amount,
            frequency: p.frequency,
            autoCategory: p.likely_category,
            confidence: p.confidence,
            isCorrect: null,
            ...txnData,
          }
        })
        const incomes: IncomeResult[] = extraction.income_deposits.map((i: ExtractedIncome) => ({
          source: i.source,
          amount: i.amount,
          type: i.type,
          confidence: i.confidence,
          isCorrect: null,
        }))
        const totalPayments = classifications.length
        const classified = classifications.filter((c) => c.autoCategory !== 'unknown').length
        setCsvResult({
          scenarioName: `CSV: ${file.name}`,
          extractions,
          classifications,
          incomes,
          questions: allQuestions,
          stats: {
            totalPayments,
            classified,
            unknown: totalPayments - classified,
            classifiedRate: totalPayments > 0 ? classified / totalPayments : 0,
            correctCount: 0,
            incorrectCount: 0,
            uncheckableCount: totalPayments,
            accuracy: 0,
          },
        })
        setFilterCategory('all')
      } catch (err) {
        alert(`CSV parse error: ${(err as Error).message}`)
      }
    }
    reader.readAsText(file)
  }, [])

  const handleNtropyCompare = useCallback(async () => {
    if (!activeResult) return
    setNtropyLoading(true)
    setNtropyResult(null)
    try {
      const payments = activeResult.classifications.map((c) => ({
        payee: c.payee,
        amount: c.amount,
      }))
      const ntropyInput = toNtropyInput(payments)

      // Chunk into batches of 100 (API limit per request)
      const BATCH_SIZE = 100
      const batches: typeof ntropyInput[] = []
      for (let i = 0; i < ntropyInput.length; i += BATCH_SIZE) {
        batches.push(ntropyInput.slice(i, i + BATCH_SIZE))
      }

      // Send all batches and combine results
      let totalLatency = 0
      let totalCredits = 0
      const allEnriched: NtropyEnrichedTransaction[] = []

      for (const batch of batches) {
        const res = await fetch('/api/ntropy/enrich', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batch),
        })
        const data = await res.json()
        if (data.error) {
          setNtropyResult({ comparisons: [], latencyMs: totalLatency, creditsUsed: totalCredits, error: `Batch error: ${data.error}` })
          return
        }
        allEnriched.push(...(data.enriched ?? []))
        totalLatency += data.latencyMs ?? 0
        totalCredits += data.creditsUsed ?? 0
      }

      const enrichedMap = new Map<string, NtropyEnrichedTransaction>()
      for (const e of allEnriched) {
        enrichedMap.set(e.transaction_id, e)
      }
      const comparisons: NtropyComparison[] = activeResult.classifications.map((c, i) => {
        const txId = `tx-${i}-${c.payee.slice(0, 20).replace(/\s/g, '-')}`
        const enriched = enrichedMap.get(txId)
        return {
          payee: c.payee,
          amount: c.amount,
          ourCategory: c.autoCategory,
          ntropyMerchant: enriched?.merchant ?? null,
          ntropyLabels: enriched?.labels ?? [],
          agree: null,
        }
      })
      setNtropyResult({
        comparisons,
        latencyMs: totalLatency,
        creditsUsed: totalCredits,
        error: null,
      })
      setActiveTab('ntropy')
    } catch (err) {
      setNtropyResult({ comparisons: [], latencyMs: 0, creditsUsed: 0, error: (err as Error).message })
    } finally {
      setNtropyLoading(false)
    }
  }, [activeResult])

  // Category filter options
  const categories = useMemo(() => {
    if (!activeResult) return []
    const cats = new Set(activeResult.classifications.map((c) => c.autoCategory))
    return ['all', ...Array.from(cats).sort()]
  }, [activeResult])

  // Ntropy lookup: match by payee + amount for inline display on classifications tab
  const ntropyLookup = useMemo(() => {
    if (!ntropyResult?.comparisons) return new Map<string, NtropyComparison>()
    const map = new Map<string, NtropyComparison>()
    for (const c of ntropyResult.comparisons) {
      map.set(`${c.payee}:${c.amount}`, c)
    }
    return map
  }, [ntropyResult])

  // Amount distribution analysis — bucketed ranges with category breakdown
  const AMOUNT_BUCKETS = [
    { id: '0-500', label: '< £500', min: 0, max: 500 },
    { id: '500-1000', label: '£500-1k', min: 500, max: 1000 },
    { id: '1000-2000', label: '£1-2k', min: 1000, max: 2000 },
    { id: '2000-3000', label: '£2-3k', min: 2000, max: 3000 },
    { id: '3000-5000', label: '£3-5k', min: 3000, max: 5000 },
    { id: '5000-10000', label: '£5-10k', min: 5000, max: 10000 },
    { id: '10000+', label: '£10k+', min: 10000, max: Infinity },
  ]

  const amountAnalysis = useMemo(() => {
    if (!activeResult) return []
    return AMOUNT_BUCKETS.map(bucket => {
      const items = activeResult.classifications.filter(c =>
        c.amount >= bucket.min && c.amount < bucket.max
      )
      const catCounts = new Map<string, number>()
      for (const c of items) {
        catCounts.set(c.autoCategory, (catCounts.get(c.autoCategory) ?? 0) + 1)
      }
      const ntLabels = new Map<string, number>()
      if (ntropyResult) {
        for (const c of items) {
          const ntr = ntropyLookup.get(`${c.payee}:${c.amount}`)
          if (ntr) {
            for (const l of ntr.ntropyLabels) {
              ntLabels.set(l, (ntLabels.get(l) ?? 0) + 1)
            }
          }
        }
      }
      return {
        ...bucket,
        count: items.length,
        unknownCount: items.filter(c => c.autoCategory === 'unknown').length,
        categories: Array.from(catCounts.entries()).sort((a, b) => b[1] - a[1]) as [string, number][],
        ntropyLabels: Array.from(ntLabels.entries()).sort((a, b) => b[1] - a[1]) as [string, number][],
      }
    })
  }, [activeResult, ntropyResult, ntropyLookup])

  const filteredClassifications = useMemo(() => {
    if (!activeResult) return []
    let items = activeResult.classifications
    if (filterCategory !== 'all') {
      items = items.filter((c) => c.autoCategory === filterCategory)
    }
    if (filterBucket !== 'all') {
      const bucket = AMOUNT_BUCKETS.find(b => b.id === filterBucket)
      if (bucket) {
        items = items.filter(c => c.amount >= bucket.min && c.amount < bucket.max)
      }
    }
    return items
  }, [activeResult, filterCategory, filterBucket])

  // Payee grouping — more aggressive than normaliseDescription to merge date variants
  // e.g. "Klarna*Halfords Au ON 21 DEC" + "Klarna*Halfords Au ON 21 NOV" → same group
  function payeeGroupKey(payee: string): string {
    return normaliseDescription(payee)
      .replace(/\b(on|at|in|to|for|the|of|and|ft|bcc|scc)\b/gi, '')
      .replace(/\b\d+\b/g, '')       // strip isolated numbers (dates, refs)
      .replace(/\b\w{1,2}\b/g, '')   // strip 1-2 char tokens
      .replace(/\s+/g, ' ')
      .trim()
  }

  interface PayeeGroup {
    key: string
    items: ClassificationResult[]
    rawTotal: number              // True total from raw transactions
    rawTxCount: number            // True count of raw transactions
    avgAmount: number             // Average per transaction
    categories: string[]
    ntropyMerchant: string | null
  }

  const groupedClassifications = useMemo<PayeeGroup[]>(() => {
    if (!groupByPayee) return []
    const groups = new Map<string, ClassificationResult[]>()
    for (const c of filteredClassifications) {
      const key = payeeGroupKey(c.payee)
      if (!key) continue
      const group = groups.get(key) ?? []
      group.push(c)
      groups.set(key, group)
    }
    return Array.from(groups.entries())
      .map(([key, items]: [string, ClassificationResult[]]) => {
        // Use rawTotal from each classification (sum of all raw transaction amounts)
        const rawTotal = items.reduce((sum, c) => sum + c.rawTotal, 0)
        const rawTxCount = items.reduce((sum, c) => sum + c.txCount, 0)
        const avgAmount = rawTxCount > 0 ? Math.round(rawTotal / rawTxCount) : 0
        const cats = [...new Set(items.map(c => c.autoCategory))]
        let ntropyMerchant: string | null = null
        for (const c of items) {
          const ntr = ntropyLookup.get(`${c.payee}:${c.amount}`)
          if (ntr?.ntropyMerchant) { ntropyMerchant = ntr.ntropyMerchant; break }
        }
        return { key, items, rawTotal, rawTxCount, avgAmount, categories: cats, ntropyMerchant }
      })
      .sort((a, b) => b.rawTotal - a.rawTotal) // Highest total first
  }, [groupByPayee, filteredClassifications, ntropyLookup])

  const toggleGroup = useCallback((key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  // Question → trigger mapping: which classification/signal caused each question to fire
  const questionTriggers = useMemo(() => {
    if (!activeResult) return new Map<string, { type: 'classification' | 'signal' | 'absence'; label: string; ruleId?: string }>()
    const map = new Map<string, { type: 'classification' | 'signal' | 'absence'; label: string; ruleId?: string }>()

    // Map question ID prefixes to the data that triggers them
    const payments = activeResult.extractions.flatMap(e => e.regular_payments)
    const incomes = activeResult.extractions.flatMap(e => e.income_deposits)
    const signals = signalResult?.signals ?? []

    // Income section
    const employment = incomes.filter(i => i.type === 'employment')
    if (employment.length > 0) {
      const p = employment[0]
      map.set('income-salary', { type: 'classification', label: `${p.source}: £${p.amount}/mo (employment)` })
      map.set('income-salary-confirmed', { type: 'classification', label: `${p.source}: £${p.amount}/mo` })
      map.set('income-not-salary', { type: 'classification', label: `${p.source}: £${p.amount}/mo` })
    }
    const benefits = incomes.filter(i => i.type === 'benefits')
    for (const b of benefits) {
      const key = b.source.toLowerCase().includes('hmrc') ? 'income-benefits-hmrc' : 'income-benefits-dwp'
      map.set(key, { type: 'classification', label: `${b.source}: £${b.amount}/mo (benefits)` })
    }
    const selfEmp = incomes.filter(i => i.type === 'self_employment')
    if (selfEmp.length > 0) {
      map.set('income-self-employment', { type: 'classification', label: `${selfEmp[0].source} (self-employment)` })
    }
    if (incomes.length === 0) {
      map.set('income-no-income', { type: 'absence', label: 'No income detected', ruleId: 'income.none-visible' })
    }

    // Property section
    const mortgage = payments.find(p => p.likely_category === 'mortgage')
    if (mortgage) {
      map.set('property-mortgage-confirm', { type: 'classification', label: `${mortgage.payee}: £${mortgage.amount}/mo (mortgage)`, ruleId: 'property.mortgage-detected' })
      map.set('property-mortgage-ownership', { type: 'classification', label: `${mortgage.payee} (mortgage)` })
      map.set('property-mortgage-value', { type: 'classification', label: `${mortgage.payee} (mortgage)` })
    }
    const rent = payments.find(p => p.likely_category === 'rent')
    if (rent) {
      map.set('property-rent-confirm', { type: 'classification', label: `${rent.payee}: £${rent.amount}/mo (rent)`, ruleId: 'property.rent-detected' })
    }
    const ct = payments.find(p => p.likely_category === 'council_tax')
    if (ct) {
      map.set('property-council-tax', { type: 'classification', label: `${ct.payee}: £${ct.amount}/mo (council tax)`, ruleId: 'property.council-tax' })
    }

    // Accounts section
    const investments = payments.filter(p => p.likely_category === 'investment')
    for (const inv of investments) {
      map.set(`accounts-investment-${inv.payee.slice(0, 15).replace(/\s/g, '-').toLowerCase()}`, { type: 'classification', label: `${inv.payee}: £${inv.amount}/mo`, ruleId: 'accounts.investment-platform' })
    }

    // Pensions
    const pensions = payments.filter(p => p.likely_category === 'pension_contribution')
    for (const pen of pensions) {
      map.set(`pensions-contribution-${pen.payee.slice(0, 15).replace(/\s/g, '-').toLowerCase()}`, { type: 'classification', label: `${pen.payee}: £${pen.amount}/mo`, ruleId: 'pension.contribution-detected' })
    }

    // Debts
    const cards = payments.filter(p => p.likely_category === 'credit_card')
    for (const c of cards) {
      map.set(`debts-credit-card-${c.payee.slice(0, 15).replace(/\s/g, '-').toLowerCase()}`, { type: 'classification', label: `${c.payee}: £${c.amount}/mo`, ruleId: 'debt.credit-card' })
    }
    const loans = payments.filter(p => p.likely_category === 'loan_repayment')
    for (const l of loans) {
      map.set(`debts-loan-${l.payee.slice(0, 15).replace(/\s/g, '-').toLowerCase()}`, { type: 'classification', label: `${l.payee}: £${l.amount}/mo`, ruleId: 'debt.loan' })
    }

    // Also map signals directly: any signal's ruleId can be looked up
    for (const s of signals) {
      // Use signal ruleId for questions that don't have a direct classification mapping
      const existing = Array.from(map.entries()).find(([, v]) => v.ruleId === s.ruleId)
      if (!existing) {
        map.set(s.ruleId, { type: 'signal', label: s.determination, ruleId: s.ruleId })
      }
    }

    return map
  }, [activeResult, signalResult])

  // Fuzzy lookup for question triggers — match by prefix since question IDs may not exactly match
  const getQuestionTrigger = useCallback((questionId: string) => {
    // Exact match first
    const exact = questionTriggers.get(questionId)
    if (exact) return exact
    // Prefix match: question IDs like "property-mortgage-confirm" should match "property-mortgage"
    for (const [key, value] of questionTriggers) {
      if (questionId.startsWith(key) || key.startsWith(questionId)) return value
    }
    // Section match: link to any signal in the same section
    const section = questionId.split('-')[0]
    if (signalResult) {
      const sectionSignal = signalResult.signals.find(s => s.section === section)
      if (sectionSignal) return { type: 'signal' as const, label: sectionSignal.determination, ruleId: sectionSignal.ruleId }
    }
    return null
  }, [questionTriggers, signalResult])

  const ALL_CATEGORIES: DetectedPayment['likely_category'][] = [
    'mortgage', 'rent', 'insurance', 'pension_contribution', 'childcare',
    'loan_repayment', 'child_maintenance', 'utilities', 'council_tax', 'subscription',
    'credit_card', 'investment', 'gambling', 'groceries', 'dining', 'fuel',
    'transport', 'education', 'healthcare', 'unknown',
  ]

  // Ntropy label → our category mapping (best-effort, not 1:1)
  const NTROPY_TO_CATEGORY: Record<string, DetectedPayment['likely_category']> = {
    'vehicle_maintenance': 'transport',
    'home maintenance': 'utilities',
    'entertainment': 'subscription',
    'e-commerce purchase': 'unknown',
    'self care': 'healthcare',
    'groceries': 'groceries',
    'dining': 'dining',
    'fuel': 'fuel',
    'education': 'education',
    'insurance': 'insurance',
    'loan': 'loan_repayment',
    'rent': 'rent',
    'mortgage': 'mortgage',
    'investment': 'investment',
    'gambling': 'gambling',
    'childcare': 'childcare',
  }

  // Apply a category to all items in a payee group
  const handleGroupCategoryOverride = useCallback((group: PayeeGroup, newCategory: DetectedPayment['likely_category']) => {
    if (!activeResult) return
    for (const c of group.items) {
      const globalIdx = activeResult.classifications.indexOf(c)
      if (globalIdx >= 0) {
        addCorrection({
          normalisedPayee: normaliseDescription(c.payee),
          rawDescription: c.payee,
          autoCategory: c.autoCategory as DetectedPayment['likely_category'],
          correctedCategory: newCategory,
          amount: c.amount,
          timestamp: new Date().toISOString(),
        })
        c.autoCategory = newCategory
        c.confidence = 1.0
      }
    }
    if (csvResult) setCsvResult({ ...csvResult })
    else if (result) setResult({ ...result })
  }, [activeResult, csvResult, result])

  const handleCategoryOverride = useCallback((index: number, newCategory: DetectedPayment['likely_category']) => {
    if (!activeResult) return
    const classification = activeResult.classifications[index]
    if (!classification || classification.autoCategory === newCategory) return

    // Save correction to persistent store
    addCorrection({
      normalisedPayee: normaliseDescription(classification.payee),
      rawDescription: classification.payee,
      autoCategory: classification.autoCategory as DetectedPayment['likely_category'],
      correctedCategory: newCategory,
      amount: classification.amount,
      timestamp: new Date().toISOString(),
    })

    // Update in-place for immediate visual feedback
    classification.autoCategory = newCategory
    classification.confidence = 1.0
    // Force re-render
    if (csvResult) {
      setCsvResult({ ...csvResult })
    } else if (result) {
      setResult({ ...result })
    }
  }, [activeResult, csvResult, result])

  return (
    <div className="min-h-screen bg-white p-6 max-w-7xl mx-auto font-mono text-sm">
      <h1 className="text-2xl font-bold mb-1">Engine Workbench</h1>
      <p className="text-gray-500 mb-6">Test the decisioning engine against synthetic scenarios or real CSV data.</p>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
        <select
          value={selectedScenarioId}
          onChange={(e) => setSelectedScenarioId(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          {scenarios.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <button onClick={handleRunScenario} className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-sm font-medium hover:bg-[#2a2a4e] transition-colors">
          Run scenario
        </button>
        <button onClick={handleRunAll} className="px-4 py-2 bg-[#E5484D] text-white rounded-lg text-sm font-medium hover:bg-[#d13438] transition-colors">
          Run all scenarios
        </button>
        <div className="border-l border-gray-300 h-8 mx-1" />
        <label className="px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-100 transition-colors">
          Load CSV
          <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
        </label>
        {activeResult && (
          <>
            <div className="border-l border-gray-300 h-8 mx-1" />
            <button
              onClick={handleNtropyCompare}
              disabled={ntropyLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {ntropyLoading ? 'Enriching...' : `Compare with Ntropy (${activeResult.classifications.length} txns${activeResult.classifications.length > 100 ? `, ${Math.ceil(activeResult.classifications.length / 100)} batches` : ''})`}
            </button>
          </>
        )}
      </div>

      {/* Results */}
      {activeResult && (
        <>
          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            <StatCard label="Scenario" value={activeResult.scenarioName} />
            <StatCard label="Payments" value={String(activeResult.stats.totalPayments)} />
            <StatCard
              label="Classified"
              value={`${activeResult.stats.classified} (${Math.round(activeResult.stats.classifiedRate * 100)}%)`}
              color={activeResult.stats.classifiedRate >= 0.8 ? 'green' : activeResult.stats.classifiedRate >= 0.6 ? 'amber' : 'red'}
            />
            <StatCard label="Unknown" value={String(activeResult.stats.unknown)} color={activeResult.stats.unknown > 5 ? 'amber' : 'green'} />
            <StatCard
              label="Correct"
              value={String(activeResult.stats.correctCount)}
              color="green"
            />
            <StatCard
              label="Incorrect"
              value={String(activeResult.stats.incorrectCount)}
              color={activeResult.stats.incorrectCount > 0 ? 'red' : 'green'}
            />
            <StatCard
              label="Accuracy"
              value={activeResult.stats.correctCount + activeResult.stats.incorrectCount > 0
                ? `${Math.round(activeResult.stats.accuracy * 100)}%`
                : 'N/A'}
              color={activeResult.stats.accuracy >= 0.9 ? 'green' : activeResult.stats.accuracy >= 0.7 ? 'amber' : 'red'}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 border-b border-gray-200">
            {([
              ['classifications', `Classifications (${activeResult.classifications.length})`],
              ['incomes', `Income (${activeResult.incomes.length})`],
              ['questions', `Questions (${activeResult.questions.filter((q) => q.fired).length})`],
              ['ntropy', `Ntropy${ntropyResult ? ` (${ntropyResult.comparisons.length})` : ''}`],
              ['rules', `Rules${signalResult ? ` (${signalResult.stats.fired}/${signalResult.stats.totalRules})` : ''}`],
            ] as [TabId, string][]).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-[#1a1a2e] text-[#1a1a2e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Classification table */}
          {activeTab === 'classifications' && (
            <>
              {/* Amount distribution analysis */}
              <div className="mb-4 rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">Amount distribution</span>
                  {filterBucket !== 'all' && (
                    <button onClick={() => setFilterBucket('all')} className="text-xs text-blue-600 hover:underline">Clear filter</button>
                  )}
                </div>
                <div className="grid grid-cols-7 divide-x divide-gray-100">
                  {amountAnalysis.map(bucket => {
                    const maxCount = Math.max(...amountAnalysis.map(b => b.count), 1)
                    const barHeight = bucket.count > 0 ? Math.max(8, (bucket.count / maxCount) * 60) : 0
                    const isActive = filterBucket === bucket.id
                    return (
                      <button
                        key={bucket.id}
                        onClick={() => setFilterBucket(isActive ? 'all' : bucket.id)}
                        className={`flex flex-col items-center px-2 py-3 transition-colors ${
                          isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        {/* Bar */}
                        <div className="w-full flex justify-center mb-1" style={{ height: 60 }}>
                          <div className="flex flex-col justify-end items-center w-full gap-px">
                            {bucket.count > 0 && (
                              <div className="flex w-full justify-center" style={{ height: barHeight }}>
                                <div className="flex w-10 rounded-t overflow-hidden">
                                  {bucket.unknownCount > 0 && (
                                    <div
                                      className="bg-amber-400"
                                      style={{ width: `${(bucket.unknownCount / bucket.count) * 100}%` }}
                                    />
                                  )}
                                  <div
                                    className="bg-blue-400"
                                    style={{ width: `${((bucket.count - bucket.unknownCount) / bucket.count) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Label */}
                        <span className="text-xs font-medium text-gray-700">{bucket.label}</span>
                        <span className="text-xs text-gray-500">{bucket.count} txn{bucket.count !== 1 ? 's' : ''}</span>
                        {bucket.unknownCount > 0 && (
                          <span className="text-xs text-amber-600">{bucket.unknownCount} unknown</span>
                        )}
                        {/* Top categories */}
                        <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                          {bucket.categories.slice(0, 3).map(([cat, n]: [string, number]) => (
                            <span key={cat} className={`px-1 py-px rounded text-[10px] ${
                              cat === 'unknown' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {cat.slice(0, 8)}{cat.length > 8 ? '.' : ''} {n}
                            </span>
                          ))}
                        </div>
                        {/* Ntropy labels if available */}
                        {bucket.ntropyLabels.length > 0 && (
                          <div className="mt-0.5 flex flex-wrap justify-center gap-0.5">
                            {bucket.ntropyLabels.slice(0, 2).map(([label, n]: [string, number]) => (
                              <span key={label} className="px-1 py-px rounded text-[10px] bg-purple-100 text-purple-700">
                                {label.slice(0, 10)} {n}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Category + bucket filters + group toggle */}
              <div className="flex gap-2 mb-3 flex-wrap items-center">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filterCategory === cat
                        ? 'bg-[#1a1a2e] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <div className="border-l border-gray-300 h-5 mx-1" />
                <button
                  onClick={() => { setGroupByPayee(!groupByPayee); setExpandedGroups(new Set()) }}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    groupByPayee
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {groupByPayee ? 'Grouped by payee' : 'Group by payee'}
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-600">{groupByPayee ? 'Payee group' : 'Payee'}</th>
                      <th className="px-4 py-3 font-medium text-gray-600 text-right">{groupByPayee ? 'Total' : 'Amount'}</th>
                      {groupByPayee && <th className="px-4 py-3 font-medium text-gray-600 text-center">Count</th>}
                      {!groupByPayee && <th className="px-4 py-3 font-medium text-gray-600">Freq</th>}
                      <th className="px-4 py-3 font-medium text-gray-600">Dates</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Category</th>
                      {ntropyResult && <th className="px-4 py-3 font-medium text-purple-600">Ntropy merchant</th>}
                      {ntropyResult && <th className="px-4 py-3 font-medium text-purple-600">Ntropy labels</th>}
                      {!groupByPayee && <th className="px-4 py-3 font-medium text-gray-600">Expected</th>}
                      <th className="px-4 py-3 font-medium text-gray-600">Conf</th>
                      {!groupByPayee && <th className="px-4 py-3 font-medium text-gray-600 text-center">Match</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* Grouped view */}
                    {groupByPayee && groupedClassifications.map((group) => {
                      const isExpanded = expandedGroups.has(group.key)
                      const allUnknown = group.categories.length === 1 && group.categories[0] === 'unknown'
                      return (
                        <React.Fragment key={group.key}>
                          {/* Group header row */}
                          <tr
                            onClick={() => toggleGroup(group.key)}
                            className={`cursor-pointer hover:bg-gray-50 ${allUnknown ? 'bg-amber-50/40' : 'bg-gray-50/50'}`}
                          >
                            <td className="px-4 py-2.5 font-medium text-sm">
                              <span className="mr-1.5 text-gray-400 text-xs">{isExpanded ? '▼' : '▶'}</span>
                              {group.ntropyMerchant ?? group.key}
                            </td>
                            <td className="px-4 py-2.5 text-right tabular-nums font-medium">£{group.rawTotal.toLocaleString()}</td>
                            <td className="px-4 py-2.5 text-center">
                              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-700">{group.rawTxCount}x</span>
                            </td>
                            <td className="px-4 py-2.5 text-xs text-gray-400">
                              {(() => {
                                const allDates = group.items.flatMap(c => c.dates).sort()
                                if (allDates.length === 0) return '—'
                                if (allDates.length <= 2) return allDates.join(', ')
                                return `${allDates[0]} — ${allDates[allDates.length - 1]}`
                              })()}
                            </td>
                            <td className="px-4 py-2.5">
                              {group.categories.map((cat) => (
                                <span key={cat} className={`px-2 py-0.5 rounded-full text-xs mr-1 ${
                                  cat === 'unknown' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                                }`}>{cat}</span>
                              ))}
                            </td>
                            {ntropyResult && (
                              <>
                                <td className="px-4 py-2.5 text-sm">{group.ntropyMerchant ?? <span className="text-gray-300">—</span>}</td>
                                <td className="px-4 py-2.5">
                                  {(() => {
                                    const labels = new Set<string>()
                                    for (const c of group.items) {
                                      const ntr = ntropyLookup.get(`${c.payee}:${c.amount}`)
                                      ntr?.ntropyLabels.forEach(l => labels.add(l))
                                    }
                                    return labels.size > 0
                                      ? Array.from(labels).map(l => <span key={l} className="px-1.5 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800 mr-1">{l}</span>)
                                      : <span className="text-gray-300">—</span>
                                  })()}
                                </td>
                              </>
                            )}
                            <td className="px-4 py-2.5 text-xs">
                              <div className="flex items-center gap-1.5">
                                {group.rawTxCount > 1 && <span className="text-gray-400">£{group.avgAmount.toLocaleString()} avg</span>}
                                {/* Ntropy reconciliation: apply Ntropy's label to all items */}
                                {ntropyResult && (() => {
                                  const labels = new Set<string>()
                                  for (const c of group.items) {
                                    const ntr = ntropyLookup.get(`${c.payee}:${c.amount}`)
                                    ntr?.ntropyLabels.forEach(l => labels.add(l))
                                  }
                                  const topLabel = Array.from(labels)[0]
                                  const mapped = topLabel ? NTROPY_TO_CATEGORY[topLabel.toLowerCase()] : undefined
                                  const allAlreadyOverridden = group.items.every(c => c.confidence >= 1.0)
                                  if (!topLabel || allAlreadyOverridden) return null
                                  return (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        if (mapped && mapped !== 'unknown') {
                                          handleGroupCategoryOverride(group, mapped)
                                        }
                                      }}
                                      disabled={!mapped || mapped === 'unknown'}
                                      className="px-2 py-0.5 rounded text-[10px] bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors disabled:opacity-40 disabled:cursor-default"
                                      title={`Apply Ntropy label "${topLabel}" → ${mapped ?? '?'} to all ${group.count} items`}
                                    >
                                      Use: {topLabel}
                                    </button>
                                  )
                                })()}
                                {/* Group override dropdown */}
                                <select
                                  value=""
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    if (e.target.value) handleGroupCategoryOverride(group, e.target.value as DetectedPayment['likely_category'])
                                    e.target.value = ''
                                  }}
                                  className="px-1 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500 border-0 cursor-pointer"
                                >
                                  <option value="">Set all...</option>
                                  {ALL_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                              </div>
                            </td>
                          </tr>
                          {/* Expanded individual rows */}
                          {isExpanded && group.items.map((c, j) => {
                            const globalIdx = activeResult!.classifications.indexOf(c)
                            return (
                              <tr key={`${group.key}-${j}`} className="bg-white border-l-2 border-l-indigo-200">
                                <td className="pl-10 pr-4 py-1.5 text-xs text-gray-500 max-w-[260px] truncate" title={c.payee}>{c.payee}</td>
                                <td className="px-4 py-1.5 text-right tabular-nums text-xs">
                                  £{c.rawTotal.toLocaleString()}
                                  {c.txCount > 1 && <span className="text-gray-400 ml-1">(£{c.amount.toLocaleString()} avg)</span>}
                                </td>
                                <td className="px-4 py-1.5 text-center text-xs text-gray-400">
                                  {c.frequency === 'one_off' ? 'one-off' : c.frequency}
                                  {c.txCount > 1 && <span className="ml-1">({c.txCount}x)</span>}
                                </td>
                                <td className="px-4 py-1.5 text-[10px] text-gray-400">
                                  {c.dates.length > 0 ? c.dates.join(', ') : '—'}
                                </td>
                                <td className="px-4 py-1.5">
                                  <select
                                    value={c.autoCategory}
                                    onChange={(e) => handleCategoryOverride(globalIdx, e.target.value as DetectedPayment['likely_category'])}
                                    className={`px-2 py-0.5 rounded-full text-xs border-0 cursor-pointer ${
                                      c.confidence >= 1.0 ? 'bg-green-100 text-green-800'
                                      : c.autoCategory === 'unknown' ? 'bg-amber-100 text-amber-800'
                                      : 'bg-blue-100 text-blue-800'
                                    }`}
                                  >
                                    {ALL_CATEGORIES.map((cat) => (
                                      <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                  </select>
                                </td>
                                {ntropyResult && (() => {
                                  const ntr = ntropyLookup.get(`${c.payee}:${c.amount}`)
                                  return (
                                    <>
                                      <td className="px-4 py-1.5 text-xs">{ntr?.ntropyMerchant ?? <span className="text-gray-300">—</span>}</td>
                                      <td className="px-4 py-1.5">
                                        {ntr && ntr.ntropyLabels.length > 0
                                          ? ntr.ntropyLabels.map((l, k) => (
                                              <span key={k} className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-800 mr-1">{l}</span>
                                            ))
                                          : <span className="text-gray-300">—</span>
                                        }
                                      </td>
                                    </>
                                  )
                                })()}
                                <td className="px-4 py-1.5 tabular-nums text-xs text-gray-400">
                                  {c.confidence >= 1.0 ? <span className="text-green-600">user</span> : `${(c.confidence * 100).toFixed(0)}%`}
                                </td>
                              </tr>
                            )
                          })}
                        </React.Fragment>
                      )
                    })}
                    {/* Flat view (default) */}
                    {!groupByPayee && filteredClassifications.map((c, i) => {
                      const globalIdx = activeResult!.classifications.indexOf(c)
                      return (
                        <tr key={i} className={c.isCorrect === false ? 'bg-red-50' : c.isCorrect === true ? '' : c.autoCategory === 'unknown' ? 'bg-amber-50/30' : 'bg-gray-50/50'}>
                          <td className="px-4 py-2 max-w-[280px] truncate" title={c.payee}>{c.payee}</td>
                          <td className="px-4 py-2 text-right tabular-nums">
                            {c.txCount > 1
                              ? <span>£{c.rawTotal.toLocaleString()} <span className="text-gray-400 text-xs">(£{c.amount.toLocaleString()} avg)</span></span>
                              : <span>£{c.amount.toLocaleString()}</span>
                            }
                          </td>
                          <td className="px-4 py-2 text-gray-500">
                            <span className={c.frequency === 'one_off' ? 'text-amber-600 font-medium' : ''}>
                              {c.frequency === 'one_off' ? 'one-off' : c.frequency}
                            </span>
                            {c.txCount > 1 && <span className="text-gray-400 text-xs ml-1">({c.txCount}x)</span>}
                          </td>
                          <td className="px-4 py-2 text-xs text-gray-400">
                            {c.dates.length > 0
                              ? c.dates.length <= 3
                                ? c.dates.join(', ')
                                : `${c.dates[0]} ... ${c.dates[c.dates.length - 1]}`
                              : '—'
                            }
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={c.autoCategory}
                              onChange={(e) => handleCategoryOverride(globalIdx, e.target.value as DetectedPayment['likely_category'])}
                              className={`px-2 py-0.5 rounded-full text-xs border-0 cursor-pointer ${
                                c.confidence >= 1.0 ? 'bg-green-100 text-green-800'
                                : c.autoCategory === 'unknown' ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {ALL_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </td>
                          {ntropyResult && (() => {
                            const ntr = ntropyLookup.get(`${c.payee}:${c.amount}`)
                            return (
                              <>
                                <td className="px-4 py-2 text-sm">
                                  {ntr?.ntropyMerchant ?? <span className="text-gray-300">—</span>}
                                </td>
                                <td className="px-4 py-2">
                                  {ntr && ntr.ntropyLabels.length > 0
                                    ? ntr.ntropyLabels.map((l, j) => (
                                        <span key={j} className="px-1.5 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800 mr-1">{l}</span>
                                      ))
                                    : <span className="text-gray-300">—</span>
                                  }
                                </td>
                              </>
                            )
                          })()}
                          <td className="px-4 py-2 text-gray-500">{c.expectedCategory ?? '—'}</td>
                          <td className="px-4 py-2 tabular-nums text-gray-500">
                            {c.confidence >= 1.0
                              ? <span className="text-green-600 font-medium">user</span>
                              : `${(c.confidence * 100).toFixed(0)}%`
                            }
                          </td>
                          <td className="px-4 py-2 text-center">
                            {c.isCorrect === true && <span className="text-green-600 font-bold">✓</span>}
                            {c.isCorrect === false && <span className="text-red-600 font-bold">✗</span>}
                            {c.isCorrect === null && <span className="text-gray-300">—</span>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Income table */}
          {activeTab === 'incomes' && (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">Source</th>
                    <th className="px-4 py-3 font-medium text-gray-600 text-right">Amount</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Auto type</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Expected</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Conf</th>
                    <th className="px-4 py-3 font-medium text-gray-600 text-center">Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeResult.incomes.map((inc, i) => (
                    <tr key={i} className={inc.isCorrect === false ? 'bg-red-50' : ''}>
                      <td className="px-4 py-2 max-w-[300px] truncate" title={inc.source}>{inc.source}</td>
                      <td className="px-4 py-2 text-right tabular-nums">£{inc.amount.toLocaleString()}/mo</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">{inc.type}</span>
                      </td>
                      <td className="px-4 py-2 text-gray-500">{inc.expectedType ?? '—'}</td>
                      <td className="px-4 py-2 tabular-nums text-gray-500">{(inc.confidence * 100).toFixed(0)}%</td>
                      <td className="px-4 py-2 text-center">
                        {inc.isCorrect === true && <span className="text-green-600 font-bold">✓</span>}
                        {inc.isCorrect === false && <span className="text-red-600 font-bold">✗</span>}
                        {inc.isCorrect === null && <span className="text-gray-300">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Questions table */}
          {activeTab === 'questions' && (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">Section</th>
                    <th className="px-4 py-3 font-medium text-gray-600">ID</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Question text</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Triggered by</th>
                    <th className="px-4 py-3 font-medium text-gray-600 text-center">Fires?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeResult.questions.map((q, i) => {
                    const trigger = getQuestionTrigger(q.id)
                    return (
                      <tr key={i} className={q.fired ? '' : 'opacity-40'}>
                        <td className="px-4 py-2">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">{q.sectionKey}</span>
                        </td>
                        <td className="px-4 py-2 text-gray-500 text-xs">{q.id}</td>
                        <td className="px-4 py-2 max-w-[350px] truncate" title={q.text}>{q.text}</td>
                        <td className="px-4 py-2 max-w-[250px]">
                          {trigger ? (
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                trigger.type === 'classification' ? 'bg-blue-500'
                                : trigger.type === 'signal' ? 'bg-green-500'
                                : 'bg-gray-400'
                              }`} />
                              <span className="text-xs text-gray-600 truncate" title={trigger.label}>{trigger.label}</span>
                              {trigger.ruleId && (
                                <button
                                  onClick={() => setActiveTab('rules')}
                                  className="flex-shrink-0 px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                                  title={`View rule: ${trigger.ruleId}`}
                                >
                                  {trigger.ruleId.split('.').pop()}
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {q.fired ? <span className="text-green-600 font-bold">●</span> : <span className="text-gray-300">○</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Ntropy comparison table */}
          {activeTab === 'ntropy' && (
            <div>
              {ntropyResult?.error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {ntropyResult.error}
                </div>
              )}
              {ntropyResult && !ntropyResult.error && (
                <>
                  <div className="flex gap-3 mb-4 text-sm text-gray-500">
                    <span>Latency: {ntropyResult.latencyMs}ms</span>
                    <span>Credits used: {ntropyResult.creditsUsed}</span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 font-medium text-gray-600">Raw description</th>
                          <th className="px-4 py-3 font-medium text-gray-600 text-right">Amount</th>
                          <th className="px-4 py-3 font-medium text-gray-600">Our category</th>
                          <th className="px-4 py-3 font-medium text-gray-600">Ntropy merchant</th>
                          <th className="px-4 py-3 font-medium text-gray-600">Ntropy labels</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {ntropyResult.comparisons.map((c, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2 max-w-[250px] truncate text-xs" title={c.payee}>{c.payee}</td>
                            <td className="px-4 py-2 text-right tabular-nums">£{c.amount.toLocaleString()}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                c.ourCategory === 'unknown' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {c.ourCategory}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm">{c.ntropyMerchant ?? <span className="text-gray-300">—</span>}</td>
                            <td className="px-4 py-2">
                              {c.ntropyLabels.length > 0
                                ? c.ntropyLabels.map((l, j) => (
                                    <span key={j} className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800 mr-1">{l}</span>
                                  ))
                                : <span className="text-gray-300">—</span>
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {!ntropyResult && (
                <div className="text-center py-12 text-gray-400">
                  <p>Click &quot;Compare with Ntropy&quot; to enrich the current results.</p>
                  <p className="text-xs mt-2">Requires NTROPY_API_KEY env var. Uses 1 credit per payment.</p>
                </div>
              )}
            </div>
          )}

          {/* Rules diagnostic tab */}
          {activeTab === 'rules' && signalResult && (
            <div>
              {/* Stats bar */}
              <div className="flex gap-3 mb-4">
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  {signalResult.stats.highConfidence} high confidence
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                  {signalResult.stats.mediumConfidence} medium
                </span>
                {signalResult.stats.flags > 0 && (
                  <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800">
                    {signalResult.stats.flags} flag{signalResult.stats.flags > 1 ? 's' : ''}
                  </span>
                )}
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  {signalResult.stats.notFired} not triggered
                </span>
              </div>

              {/* Rules table */}
              <div className="space-y-3">
                {signalResult.ruleResults.map((rr) => (
                  <div
                    key={rr.rule.id}
                    className={`rounded-xl border p-4 ${
                      rr.fired
                        ? rr.signal!.confidence >= 0.85
                          ? 'border-green-200 bg-green-50/50'
                          : rr.signal!.section === 'flags'
                          ? 'border-red-200 bg-red-50/50'
                          : 'border-amber-200 bg-amber-50/50'
                        : 'border-gray-200 bg-gray-50/30 opacity-60'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            rr.fired
                              ? rr.signal!.confidence >= 0.85 ? 'bg-green-500'
                              : rr.signal!.section === 'flags' ? 'bg-red-500'
                              : 'bg-amber-500'
                              : 'bg-gray-300'
                          }`} />
                          <span className="font-medium text-sm">
                            {rr.fired ? rr.signal!.name : rr.rule.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">{rr.rule.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            rr.rule.tier === 'must_nail' ? 'bg-blue-100 text-blue-700'
                            : rr.rule.tier === 'good_enough' ? 'bg-gray-100 text-gray-600'
                            : 'bg-purple-100 text-purple-700'
                          }`}>
                            {rr.rule.tier.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{rr.rule.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">Form E {rr.rule.formEField}</span>
                        {rr.fired && (
                          <div className="text-xs font-medium mt-1">
                            {Math.round(rr.signal!.confidence * 100)}% confidence
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Fired: show determination + reasoning */}
                    {rr.fired && rr.signal && (
                      <div className="mt-3 border-t border-gray-200/50 pt-3">
                        <div className="text-sm font-medium mb-2">{rr.signal.determination}</div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {rr.signal.reasoning.map((r, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-gray-400">•</span>
                              {r}
                            </li>
                          ))}
                        </ul>

                        {/* Evidence */}
                        {rr.signal.evidence.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            {rr.signal.evidence.map((e, i) => (
                              <div key={i} className="flex gap-2 items-center">
                                <span className="text-gray-300">↳</span>
                                <span>{e.label}</span>
                                {e.metrics?.map((m, j) => (
                                  <span key={j} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{m.name}: {m.value}</span>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Cross-section impacts */}
                        {rr.signal.crossSectionImpacts.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {rr.signal.crossSectionImpacts.map((impact, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">
                                {impact}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Not fired */}
                    {!rr.fired && (
                      <div className="mt-2 text-xs text-gray-400 italic">
                        Rule did not trigger — no matching pattern found in data
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!activeResult && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">Select a scenario or load a CSV to begin.</p>
          <p className="text-sm">The workbench runs your data through the full decisioning pipeline and shows every classification, question, and gap detection.</p>
        </div>
      )}
    </div>
  )
}

// ═══ Stat card component ═══

function StatCard({ label, value, color }: { label: string; value: string; color?: 'green' | 'amber' | 'red' }) {
  const colorClasses = color === 'green' ? 'text-green-700 bg-green-50 border-green-200'
    : color === 'amber' ? 'text-amber-700 bg-amber-50 border-amber-200'
    : color === 'red' ? 'text-red-700 bg-red-50 border-red-200'
    : 'text-gray-700 bg-white border-gray-200'

  return (
    <div className={`rounded-xl border px-4 py-3 ${colorClasses}`}>
      <div className="text-xs font-medium opacity-70 mb-1">{label}</div>
      <div className="text-sm font-bold truncate">{value}</div>
    </div>
  )
}

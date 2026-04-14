'use client'

// Engine Workbench — dev-only page for testing the decisioning engine.
// Load scenarios or CSVs, see every classification, mark corrections,
// run regression against golden test data.

import { useState, useMemo, useCallback } from 'react'
import { parseCSVToExtraction } from '@/lib/bank/csv-parser'
import { transformExtractionResult } from '@/lib/ai/result-transformer'
import { generateSectionSteps, CONFIRMATION_SECTIONS } from '@/lib/bank/confirmation-questions'
import { getAllTestScenarios, type TestScenario, type ExpectedPayment, type ExpectedIncome } from '@/lib/bank/test-scenarios'
import { toNtropyInput, type NtropyEnrichedTransaction } from '@/lib/bank/ntropy-client'
import { runSignalDetection, type SignalDetectionResult } from '@/lib/bank/signal-rules'
import type { BankStatementExtraction, DetectedPayment, ExtractedIncome } from '@/lib/ai/extraction-schemas'

// ═══ Scenario runner ═══

interface ClassificationResult {
  payee: string
  amount: number
  frequency: string
  autoCategory: string
  confidence: number
  expectedCategory?: string
  isCorrect: boolean | null  // null = no expectation
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

function runScenario(scenario: TestScenario): RunResult {
  // Build CSV text from scenario transactions
  const csvLines = ['Date,Description,Amount']
  for (const tx of scenario.transactions) {
    const escaped = tx.description.includes(',') ? `"${tx.description}"` : tx.description
    csvLines.push(`${tx.date},${escaped},${tx.amount}`)
  }
  const csvText = csvLines.join('\n')

  // Parse through the CSV parser
  const { extraction } = parseCSVToExtraction(csvText, `${scenario.provider}.csv`)
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
    return {
      payee: p.payee,
      amount: p.amount,
      frequency: p.frequency,
      autoCategory: p.likely_category,
      confidence: p.confidence,
      expectedCategory: expected?.expectedCategory,
      isCorrect,
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
        const { extraction } = parseCSVToExtraction(text, file.name)
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
        const classifications: ClassificationResult[] = extraction.regular_payments.map((p: DetectedPayment) => ({
          payee: p.payee,
          amount: p.amount,
          frequency: p.frequency,
          autoCategory: p.likely_category,
          confidence: p.confidence,
          isCorrect: null,
        }))
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
      const res = await fetch('/api/ntropy/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ntropyInput),
      })
      const data = await res.json()
      if (data.error) {
        setNtropyResult({ comparisons: [], latencyMs: 0, creditsUsed: 0, error: data.error })
        return
      }
      const enrichedMap = new Map<string, NtropyEnrichedTransaction>()
      for (const e of data.enriched) {
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
          agree: null,  // Manual comparison — categories don't map 1:1
        }
      })
      setNtropyResult({
        comparisons,
        latencyMs: data.latencyMs,
        creditsUsed: data.creditsUsed,
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

  const filteredClassifications = useMemo(() => {
    if (!activeResult) return []
    if (filterCategory === 'all') return activeResult.classifications
    return activeResult.classifications.filter((c) => c.autoCategory === filterCategory)
  }, [activeResult, filterCategory])

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
              {ntropyLoading ? 'Enriching...' : `Compare with Ntropy (${activeResult.classifications.length} txns)`}
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
              <div className="flex gap-2 mb-3">
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
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-600">Payee</th>
                      <th className="px-4 py-3 font-medium text-gray-600 text-right">Amount</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Freq</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Auto category</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Expected</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Conf</th>
                      <th className="px-4 py-3 font-medium text-gray-600 text-center">Match</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredClassifications.map((c, i) => (
                      <tr key={i} className={c.isCorrect === false ? 'bg-red-50' : c.isCorrect === true ? '' : 'bg-gray-50/50'}>
                        <td className="px-4 py-2 max-w-[280px] truncate" title={c.payee}>{c.payee}</td>
                        <td className="px-4 py-2 text-right tabular-nums">£{c.amount.toLocaleString()}</td>
                        <td className="px-4 py-2 text-gray-500">{c.frequency}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            c.autoCategory === 'unknown' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {c.autoCategory}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-500">{c.expectedCategory ?? '—'}</td>
                        <td className="px-4 py-2 tabular-nums text-gray-500">{(c.confidence * 100).toFixed(0)}%</td>
                        <td className="px-4 py-2 text-center">
                          {c.isCorrect === true && <span className="text-green-600 font-bold">✓</span>}
                          {c.isCorrect === false && <span className="text-red-600 font-bold">✗</span>}
                          {c.isCorrect === null && <span className="text-gray-300">—</span>}
                        </td>
                      </tr>
                    ))}
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
                    <th className="px-4 py-3 font-medium text-gray-600 text-center">Fires?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeResult.questions.map((q, i) => (
                    <tr key={i} className={q.fired ? '' : 'opacity-40'}>
                      <td className="px-4 py-2">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">{q.sectionKey}</span>
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">{q.id}</td>
                      <td className="px-4 py-2 max-w-[400px] truncate" title={q.text}>{q.text}</td>
                      <td className="px-4 py-2 text-center">
                        {q.fired ? <span className="text-green-600 font-bold">●</span> : <span className="text-gray-300">○</span>}
                      </td>
                    </tr>
                  ))}
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

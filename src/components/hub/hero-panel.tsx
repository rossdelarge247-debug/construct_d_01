'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { EvidenceLozenge } from './evidence-lozenge'
import { CategorySelector } from './category-selector'
import type {
  HeroPanelState,
  EvidenceLozenge as LozengeType,
  ClarificationQuestion,
  AutoConfirmItem,
} from '@/types/hub'
import type { UploadContext } from '@/hooks/use-hub'

// Progressive disclosure options for "Something else" on income questions
const PROGRESSIVE_INCOME_OPTIONS = [
  { label: 'Pension income', value: 'pension_income' },
  { label: 'Maintenance received', value: 'maintenance_received' },
  { label: 'Investment return', value: 'investment_return' },
  { label: 'Other income', value: 'other' },
]

interface HeroPanelProps {
  state: HeroPanelState
  lozenges: LozengeType[]
  questions: ClarificationQuestion[]
  autoConfirmItems: AutoConfirmItem[]
  currentQuestionIndex: number
  uploadContext?: UploadContext
  onFilesDropped: (files: File[]) => void
  onReviewStart: () => void
  onAutoConfirmAccept: (acceptedIds: string[]) => void
  onQuestionAnswer: (questionId: string, answer: string) => void
  onQuestionSkip: (questionId: string) => void
  onSummaryFinish: () => void
  onUploadMore: () => void
  onCancelReview: () => void
  summaryAchievements: string[]
  summaryTodoItems: { text: string; helpLink?: string }[]
}

export function HeroPanel({
  state,
  lozenges,
  questions,
  autoConfirmItems,
  currentQuestionIndex,
  uploadContext,
  onFilesDropped,
  onReviewStart,
  onAutoConfirmAccept,
  onQuestionAnswer,
  onQuestionSkip,
  onSummaryFinish,
  onUploadMore,
  onCancelReview,
  summaryAchievements,
  summaryTodoItems,
}: HeroPanelProps) {
  const prevStateRef = useRef(state)
  const [visible, setVisible] = useState(true)
  const [renderState, setRenderState] = useState(state)

  // Cross-fade transition: fade out → swap content → fade in (spec 18 line 249)
  useEffect(() => {
    if (state !== prevStateRef.current) {
      setVisible(false)
      const timer = setTimeout(() => {
        setRenderState(state)
        prevStateRef.current = state
        setVisible(true)
      }, 200) // 200ms fade-out before swap
      return () => clearTimeout(timer)
    }
  }, [state])

  return (
    <div
      className="bg-white rounded-lg p-8"
      style={{ boxShadow: 'var(--shadow-hero)' }}
      aria-live="polite"
      aria-atomic="false"
    >
      {/* Heading — spec 18: hero-heading 24px/700 */}
      <h2 className="text-2xl font-bold text-ink tracking-tight mb-4" style={{ letterSpacing: '-0.01em' }}>
        {getHeading(renderState)}
      </h2>

      {/* Lozenges — always visible */}
      <div className="flex flex-wrap gap-2 mb-6">
        {lozenges.map((lozenge) => (
          <EvidenceLozenge key={lozenge.type} lozenge={lozenge} />
        ))}
      </div>

      {/* Progress bar — visible during Q&A */}
      {(renderState === 'auto_confirm' || renderState === 'clarification') && (
        <ProgressBar
          current={currentQuestionIndex}
          total={questions.length + 1}
        />
      )}

      {/* Error display */}
      {uploadContext?.error && renderState === 'ready' && (
        <div className="mb-4 p-4 bg-red-50 border border-red-600/20 rounded-md">
          <p className="text-sm text-red-600">{uploadContext.error}</p>
        </div>
      )}

      {/* State-specific content with cross-fade */}
      <div
        className="transition-opacity"
        style={{
          opacity: visible ? 1 : 0,
          transitionDuration: 'var(--transition-content)',
        }}
      >
        {renderState === 'ready' && <ReadyState onFilesDropped={onFilesDropped} />}
        {renderState === 'uploading' && <UploadingState context={uploadContext} />}
        {renderState === 'uploading_context' && <UploadingContextState context={uploadContext} />}
        {renderState === 'analysing' && <AnalysingState context={uploadContext} />}
        {renderState === 'review_ready' && <ReviewReadyState onReview={onReviewStart} onUploadMore={onUploadMore} />}
        {renderState === 'auto_confirm' && (
          <AutoConfirmState
            items={autoConfirmItems}
            onAccept={onAutoConfirmAccept}
            onCancel={onCancelReview}
          />
        )}
        {renderState === 'clarification' && questions[currentQuestionIndex] && (
          <ClarificationState
            question={questions[currentQuestionIndex]}
            onAnswer={onQuestionAnswer}
            onSkip={onQuestionSkip}
          />
        )}
        {renderState === 'summary' && (
          <SummaryState
            onFinish={onSummaryFinish}
            onUploadMore={onUploadMore}
            achievements={summaryAchievements}
            todoItems={summaryTodoItems}
          />
        )}
      </div>
    </div>
  )
}

function getHeading(state: HeroPanelState): string {
  switch (state) {
    case 'ready':
      return 'Upload evidence to complete your preparation'
    case 'uploading':
    case 'uploading_context':
    case 'analysing':
      return 'Upload evidence to complete your preparation'
    case 'review_ready':
      return 'Upload evidence to complete your preparation'
    case 'auto_confirm':
    case 'clarification':
      return "Let's go through what you just shared with us"
    case 'summary':
      return 'Summary time'
    default:
      return 'Upload evidence to complete your preparation'
  }
}

// ═══ Progress bar ═══

function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = Math.min(((current + 1) / total) * 100, 100)
  return (
    <div
      className="w-full h-1 bg-grey-100 rounded-full mb-6 overflow-hidden"
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Question ${current + 1} of ${total}`}
    >
      <div
        className="h-full bg-ink rounded-full"
        style={{
          width: `${progress}%`,
          transition: 'width var(--transition-progress)',
        }}
      />
    </div>
  )
}

// ═══ State 1: Ready ═══

function ReadyState({ onFilesDropped }: { onFilesDropped: (files: File[]) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) onFilesDropped(files)
    },
    [onFilesDropped]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) onFilesDropped(files)
    },
    [onFilesDropped]
  )

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 cursor-pointer ${
        isDragOver
          ? 'border-blue-600 bg-blue-50 scale-[1.01]'
          : 'border-grey-200 hover:border-blue-600 hover:bg-blue-50'
      }`}
      onClick={() => fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload files"
    >
      <Upload size={24} className="mx-auto mb-3 text-ink-tertiary" />
      <p className="text-sm text-ink-secondary italic">
        Drag and drop your files in any order and we&apos;ll do the rest..
      </p>
      <p className="text-sm text-ink-secondary">
        (or{' '}
        <span className="text-blue-600 underline">upload</span>
        )
      </p>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  )
}

// ═══ State 2a: Uploading ═══

function UploadingState({ context }: { context?: UploadContext }) {
  const fileCount = context?.fileCount || 0
  const fileWord = fileCount === 1 ? 'file' : 'files'

  // Cycle through encouraging messages while waiting for API
  const [messageIndex, setMessageIndex] = useState(0)
  const messages = [
    fileCount > 0 ? `Reading your ${fileCount} ${fileWord}...` : 'Reading your document...',
    'Identifying document type...',
    'Extracting financial details...',
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [messages.length])

  return (
    <div className="py-8 text-center">
      <ProcessingAnimation />
      <p className="mt-6 text-sm text-ink-secondary transition-opacity duration-300">
        {messages[messageIndex]}
      </p>
    </div>
  )
}

// ═══ State 2b: Uploading with context ═══

function UploadingContextState({ context }: { context?: UploadContext }) {
  const docType = context?.documentType
  const provider = context?.providerName
  const description = docType
    ? formatDocumentDescription(docType, provider ?? null)
    : 'Identifying document type...'

  return (
    <div className="py-8 text-center">
      <ProcessingAnimation />
      <div className="mt-6 space-y-2">
        <p className="text-sm font-medium text-ink animate-value-enter">
          {description}
        </p>
        <p className="text-sm text-ink-secondary">
          Analysing the contents...
        </p>
      </div>
    </div>
  )
}

// ═══ State 2c: Analysing ═══

function AnalysingState({ context }: { context?: UploadContext }) {
  const messages = context?.processingMessages || []
  const docType = context?.documentType

  const analysingText = docType === 'bank_statement'
    ? 'Categorising transactions, detecting income patterns...'
    : docType === 'payslip'
      ? 'Extracting pay details, tax, and deductions...'
      : docType === 'mortgage_statement'
        ? 'Reading mortgage balance, rates, and terms...'
        : docType === 'pension_cetv'
          ? 'Extracting pension valuation details...'
          : 'Processing the financial details...'

  return (
    <div className="py-8 text-center">
      <ProcessingAnimation />
      <div className="mt-6 space-y-2">
        <p className="text-sm font-medium text-ink animate-value-enter">
          {analysingText}
        </p>
        {messages.length > 0 && (
          <div className="space-y-1">
            {messages.slice(0, 3).map((msg, i) => (
              <p key={i} className="text-xs text-ink-tertiary animate-value-enter" style={{ animationDelay: `${i * 150}ms` }}>
                {msg}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function formatDocumentDescription(docType: string, provider: string | null): string {
  const typeLabels: Record<string, string> = {
    bank_statement: 'bank statement',
    payslip: 'payslip',
    mortgage_statement: 'mortgage statement',
    pension_cetv: 'pension CETV letter',
    savings_statement: 'savings statement',
    credit_card_statement: 'credit card statement',
    tax_return: 'tax return',
    p60: 'P60',
    business_accounts: 'business accounts',
    property_valuation: 'property valuation',
  }
  const label = typeLabels[docType] || 'document'
  return provider
    ? `Identified: ${provider} ${label}`
    : `Identified: ${label}`
}

// ═══ State 2d: Review ready ═══

function ReviewReadyState({ onReview, onUploadMore }: { onReview: () => void; onUploadMore: () => void }) {
  return (
    <div className="py-12 text-center">
      <p className="text-lg font-semibold text-ink">100% complete</p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          onClick={onReview}
          className="px-6 py-3 bg-ink text-white text-[15px] font-semibold rounded-md hover:opacity-90 transition-opacity"
        >
          Review uploads now
        </button>
        <button
          onClick={onUploadMore}
          className="text-sm text-blue-600 hover:underline"
        >
          Upload more documents
        </button>
      </div>
    </div>
  )
}

// ═══ State 3a: Auto-confirm ═══

function AutoConfirmState({
  items,
  onAccept,
  onCancel,
}: {
  items: AutoConfirmItem[]
  onAccept: (ids: string[]) => void
  onCancel: () => void
}) {
  const [localItems, setLocalItems] = useState(items.map((i) => ({ ...i })))

  const toggleItem = useCallback((id: string) => {
    setLocalItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, accepted: !item.accepted } : item)
    )
  }, [])

  const acceptedIds = localItems.filter((i) => i.accepted).map((i) => i.id)

  return (
    <div>
      <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
        Processed : Please confirm
      </p>
      <p className="mt-2 text-base text-ink-secondary">
        We automatically found these easy ones..
      </p>
      <div className="mt-4 space-y-3">
        {localItems.map((item) => (
          <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={item.accepted}
              onChange={() => toggleItem(item.id)}
              className="mt-0.5 w-4 h-4 rounded border-grey-200 text-ink focus:ring-blue-600"
            />
            <div>
              <p className="text-sm text-ink">{item.label}</p>
              <p className="text-xs text-ink-tertiary">{item.detail}</p>
            </div>
          </label>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={() => onAccept(acceptedIds)}
          disabled={acceptedIds.length === 0}
          className="px-6 py-3 bg-ink text-white text-[15px] font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Accept{acceptedIds.length > 0 ? ` (${acceptedIds.length})` : ''}
        </button>
        <button
          onClick={onCancel}
          className="text-sm text-blue-600 hover:underline"
        >
          Cancel and start again
        </button>
      </div>
    </div>
  )
}

// ═══ State 3b–3n: Clarification ═══

function ClarificationState({
  question,
  onAnswer,
  onSkip,
}: {
  question: ClarificationQuestion
  onAnswer: (questionId: string, answer: string) => void
  onSkip: (questionId: string) => void
}) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [showCategorySelector, setShowCategorySelector] = useState(false)

  // Reset selection when question changes
  useEffect(() => {
    setSelectedValue(null)
    setShowMoreOptions(false)
    setShowCategorySelector(false)
  }, [question.id])

  const isBinary = question.options.length <= 2

  // Spec 19: Use category selector for unknown payments instead of generic radio buttons
  // Detected by: payment question where the question asks "What is this?" with the generic options
  const usesCategoryDropdown = question.id.startsWith('payment-') &&
    question.questionText.includes('What is this?') &&
    question.options.some((o) => o.value === 'other')

  // Progressive disclosure: "Something else" on income questions reveals more Form E income types
  const hasProgressiveOther = question.options.some((o) => o.value === 'other_income')

  // Any question with an "Other" / "Something else" option gets the Form E category fallback
  const hasGenericOther = !hasProgressiveOther && !usesCategoryDropdown &&
    question.options.some((o) => o.value === 'other' || o.label === 'Something else')

  if (usesCategoryDropdown) {
    return (
      <CategorySelector
        questionText={question.questionText}
        onSelect={(category) => onAnswer(question.id, category)}
        onSkip={() => onSkip(question.id)}
      />
    )
  }

  return (
    <div>
      <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
        Processed : Please confirm
      </p>
      <p className="mt-3 text-xl font-semibold text-ink leading-snug">
        {question.questionText}
      </p>
      {question.reasoning && (
        <p className="mt-2 text-sm text-ink-secondary leading-relaxed">
          {question.reasoning}
        </p>
      )}

      {isBinary ? (
        // Binary: primary button + secondary link
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => onAnswer(question.id, question.options[0].value)}
            className="px-6 py-3 bg-ink text-white text-[15px] font-semibold rounded-md hover:opacity-90 transition-opacity"
          >
            {question.options[0].label}
          </button>
          {question.options[1] && (
            <button
              onClick={() => onAnswer(question.id, question.options[1].value)}
              className="text-sm text-blue-600 hover:underline"
            >
              {question.options[1].label}
            </button>
          )}
        </div>
      ) : (
        // Radio options with tracked selection
        <div className="mt-4 space-y-2.5">
          {question.options
            .filter((o) => o.value !== 'other_income' && !(hasGenericOther && (o.value === 'other' || o.label === 'Something else')))
            .map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                selectedValue === option.value
                  ? 'bg-blue-50 border border-blue-600/20'
                  : 'hover:bg-grey-50'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => { setSelectedValue(option.value); setShowMoreOptions(false); setShowCategorySelector(false) }}
                className="w-4 h-4 border-grey-200 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-sm text-ink">{option.label}</span>
            </label>
          ))}

          {/* Progressive disclosure: "Something else" on income questions reveals more Form E income types */}
          {hasProgressiveOther && (
            <>
              <button
                onClick={() => { setShowMoreOptions(!showMoreOptions); setSelectedValue(null); setShowCategorySelector(false) }}
                className={`w-full flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors text-left ${
                  showMoreOptions ? 'bg-blue-50 border border-blue-600/20' : 'hover:bg-grey-50'
                }`}
              >
                <span className="w-4 h-4 flex items-center justify-center text-xs text-ink-secondary">
                  {showMoreOptions ? '▾' : '▸'}
                </span>
                <span className="text-sm text-ink">Something else</span>
              </button>
              {showMoreOptions && (
                <div className="ml-7 space-y-2 border-l-2 border-grey-100 pl-4">
                  {PROGRESSIVE_INCOME_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-colors ${
                        selectedValue === option.value
                          ? 'bg-blue-50 border border-blue-600/20'
                          : 'hover:bg-grey-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.value}
                        checked={selectedValue === option.value}
                        onChange={() => setSelectedValue(option.value)}
                        className="w-4 h-4 border-grey-200 text-blue-600 focus:ring-blue-600"
                      />
                      <span className="text-sm text-ink">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Generic "Other" on any question → expands to Form E category selector */}
          {hasGenericOther && (
            <>
              <button
                onClick={() => { setShowCategorySelector(!showCategorySelector); setSelectedValue(null); setShowMoreOptions(false) }}
                className={`w-full flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors text-left ${
                  showCategorySelector ? 'bg-blue-50 border border-blue-600/20' : 'hover:bg-grey-50'
                }`}
              >
                <span className="w-4 h-4 flex items-center justify-center text-xs text-ink-secondary">
                  {showCategorySelector ? '▾' : '▸'}
                </span>
                <span className="text-sm text-ink">Something else</span>
              </button>
              {showCategorySelector && (
                <div className="ml-4 mt-1">
                  <CategorySelector
                    questionText={question.questionText}
                    onSelect={(category) => onAnswer(question.id, category)}
                    onSkip={() => onSkip(question.id)}
                  />
                </div>
              )}
            </>
          )}

          {!showCategorySelector && (
          <div className="mt-5 flex items-center gap-4">
            <button
              onClick={() => {
                if (selectedValue) {
                  onAnswer(question.id, selectedValue)
                }
              }}
              disabled={!selectedValue}
              className="px-6 py-3 bg-ink text-white text-[15px] font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {selectedValue
                ? [...question.options, ...PROGRESSIVE_INCOME_OPTIONS].find((o) => o.value === selectedValue)?.label || 'Confirm'
                : 'Select an option'}
            </button>
            <button
              onClick={() => onSkip(question.id)}
              className="text-sm text-blue-600 hover:underline"
            >
              I&apos;ll answer this later
            </button>
          </div>
          )}
        </div>
      )}
    </div>
  )
}

// ═══ State 4: Summary ═══

interface SummaryProps {
  onFinish: () => void
  onUploadMore: () => void
  achievements: string[]
  todoItems: { text: string; helpLink?: string }[]
}

function SummaryState({ onFinish, onUploadMore, achievements, todoItems }: SummaryProps) {
  return (
    <div>
      {achievements.length > 0 && (
        <>
          <p className="text-base font-medium text-ink">
            What&apos;s been achieved
          </p>
          <div className="mt-3 space-y-2">
            {achievements.map((text, i) => (
              <SummaryItem key={i} type="done" text={text} />
            ))}
          </div>
        </>
      )}

      {todoItems.length > 0 && (
        <>
          <p className={`text-sm font-semibold text-ink ${achievements.length > 0 ? 'mt-6' : ''}`}>
            On the todo list for next time...
          </p>
          <div className="mt-2 space-y-2">
            {todoItems.map((item, i) => (
              <SummaryItem key={i} type="todo" text={item.text} linkText={item.helpLink} />
            ))}
          </div>
        </>
      )}

      {achievements.length === 0 && todoItems.length === 0 && (
        <p className="text-sm text-ink-secondary">Your financial picture has been updated.</p>
      )}

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={onFinish}
          className="px-6 py-3 bg-ink text-white text-[15px] font-semibold rounded-md hover:opacity-90 transition-opacity"
        >
          Finished for now
        </button>
        <button
          onClick={onUploadMore}
          className="text-sm text-blue-600 hover:underline"
        >
          Upload more documents now, I&apos;m on a roll
        </button>
      </div>
    </div>
  )
}

function SummaryItem({ type, text, linkText }: { type: 'done' | 'todo'; text: string; linkText?: string }) {
  return (
    <div className="flex items-start gap-3">
      {type === 'done' ? (
        <span className="mt-0.5 text-green-600 text-lg leading-none">✓</span>
      ) : (
        <span className="mt-0.5 text-amber-600 text-lg leading-none font-bold">!</span>
      )}
      <p className="text-sm text-ink-secondary">
        {text}
        {linkText && (
          <>
            {' '}
            <button className="text-blue-600 underline font-medium">{linkText}</button>
          </>
        )}
      </p>
    </div>
  )
}

// ═══ Processing animation ═══
// Spec 18 Option C: thin horizontal indeterminate progress line.
// Competent and measured, not magical or whimsical. The product is working, not performing.

function ProcessingAnimation() {
  return (
    <div className="w-full py-6">
      <div className="w-full h-1 bg-grey-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-ink rounded-full"
          style={{
            width: '30%',
            animation: 'shimmer 1.8s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  )
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { EvidenceLozenge } from './evidence-lozenge'
import type {
  HeroPanelState,
  EvidenceLozenge as LozengeType,
  ClarificationQuestion,
  AutoConfirmItem,
} from '@/types/hub'
import type { UploadContext } from '@/hooks/use-hub'

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
  return (
    <div className="bg-white rounded-lg p-8" style={{ boxShadow: 'var(--shadow-hero)' }}>
      {/* Heading */}
      <h2 className="text-lg font-bold text-ink tracking-tight mb-4">
        {getHeading(state)}
      </h2>

      {/* Lozenges — always visible */}
      <div className="flex flex-wrap gap-2 mb-6">
        {lozenges.map((lozenge) => (
          <EvidenceLozenge key={lozenge.type} lozenge={lozenge} />
        ))}
      </div>

      {/* Progress bar — visible during Q&A */}
      {(state === 'auto_confirm' || state === 'clarification') && (
        <ProgressBar
          current={currentQuestionIndex}
          total={questions.length + 1}
        />
      )}

      {/* Error display */}
      {uploadContext?.error && state === 'ready' && (
        <div className="mb-4 p-4 bg-red-50 border border-red-600/20 rounded-md">
          <p className="text-sm text-red-600">{uploadContext.error}</p>
        </div>
      )}

      {/* State-specific content */}
      {state === 'ready' && <ReadyState onFilesDropped={onFilesDropped} />}
      {state === 'uploading' && <UploadingState context={uploadContext} />}
      {state === 'uploading_context' && <UploadingContextState context={uploadContext} />}
      {state === 'analysing' && <AnalysingState context={uploadContext} />}
      {state === 'review_ready' && <ReviewReadyState onReview={onReviewStart} onUploadMore={onUploadMore} />}
      {state === 'auto_confirm' && (
        <AutoConfirmState
          items={autoConfirmItems}
          onAccept={onAutoConfirmAccept}
          onCancel={onCancelReview}
        />
      )}
      {state === 'clarification' && questions[currentQuestionIndex] && (
        <ClarificationState
          question={questions[currentQuestionIndex]}
          onAnswer={onQuestionAnswer}
          onSkip={onQuestionSkip}
        />
      )}
      {state === 'summary' && (
        <SummaryState
          onFinish={onSummaryFinish}
          onUploadMore={onUploadMore}
          achievements={summaryAchievements}
          todoItems={summaryTodoItems}
        />
      )}
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
    <div className="w-full h-1 bg-grey-100 rounded-full mb-6 overflow-hidden">
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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) onFilesDropped(files)
    },
    [onFilesDropped]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
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
      className="border-2 border-dashed border-grey-200 rounded-lg p-12 text-center hover:border-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
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
  return (
    <div className="py-12 text-center">
      <ProcessingAnimation />
      <p className="mt-4 text-sm text-ink-secondary">
        {fileCount > 0
          ? `Reading your ${fileCount} ${fileWord}...`
          : 'Generating suggestions...'
        }
      </p>
    </div>
  )
}

// ═══ State 2b: Uploading with context ═══

function UploadingContextState({ context }: { context?: UploadContext }) {
  const docType = context?.documentType
  const provider = context?.providerName

  // Build contextual description from classification
  const description = docType
    ? formatDocumentDescription(docType, provider ?? null)
    : 'Identifying document types...'

  return (
    <div className="py-12 text-center">
      <ProcessingAnimation />
      <p className="mt-4 text-sm text-ink-secondary">
        {context?.fileCount
          ? `You are uploading ${context.fileCount} ${context.fileCount === 1 ? 'file' : 'files'}....`
          : 'Processing your upload...'
        }
      </p>
      <p className="mt-1 text-sm font-medium text-ink">{description}</p>
    </div>
  )
}

// ═══ State 2c: Analysing ═══

function AnalysingState({ context }: { context?: UploadContext }) {
  const messages = context?.processingMessages || []
  return (
    <div className="py-12 text-center">
      <ProcessingAnimation />
      <p className="mt-4 text-sm text-ink-secondary">Files uploaded, processing the transactions...</p>
      {messages.length > 0 && (
        <div className="mt-2 space-y-1">
          {messages.slice(0, 3).map((msg, i) => (
            <p key={i} className="text-xs text-ink-tertiary">{msg}</p>
          ))}
        </div>
      )}
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
          className="px-6 py-2.5 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity"
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
          className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
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

  // Reset selection when question changes
  useEffect(() => {
    setSelectedValue(null)
  }, [question.id])

  const isBinary = question.options.length <= 2

  return (
    <div>
      <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
        Processed : Please confirm
      </p>
      <p className="mt-3 text-lg font-medium text-ink leading-snug">
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
            className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity"
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
          {question.options.map((option) => (
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
                onChange={() => setSelectedValue(option.value)}
                className="w-4 h-4 border-grey-200 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-sm text-ink">{option.label}</span>
            </label>
          ))}
          <div className="mt-5 flex items-center gap-4">
            <button
              onClick={() => {
                if (selectedValue) {
                  onAnswer(question.id, selectedValue)
                }
              }}
              disabled={!selectedValue}
              className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {selectedValue
                ? question.options.find((o) => o.value === selectedValue)?.label || 'Confirm'
                : 'Select an option'}
            </button>
            <button
              onClick={() => onSkip(question.id)}
              className="text-sm text-blue-600 hover:underline"
            >
              I&apos;ll answer this later
            </button>
          </div>
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
          className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity"
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

function ProcessingAnimation() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <div className="w-2 h-2 bg-ink-tertiary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-ink-tertiary rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
      <div className="w-2 h-2 bg-ink-tertiary rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
    </div>
  )
}

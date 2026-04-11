'use client'

import { TitleBar } from '@/components/hub/title-bar'
import { HeroPanel } from '@/components/hub/hero-panel'
import { SectionCards } from '@/components/hub/section-cards'
import { DiscoveryFlow } from '@/components/hub/discovery-flow'
import { FidelityLabel } from '@/components/hub/fidelity-label'
import { useHub } from '@/hooks/use-hub'
import type { HeroPanelState } from '@/types/hub'

const ACTIVE_HERO_STATES: HeroPanelState[] = [
  'uploading', 'uploading_context', 'analysing', 'review_ready',
  'auto_confirm', 'clarification', 'summary',
]

export default function WorkspacePage() {
  const hub = useHub()
  const isHeroActive = ACTIVE_HERO_STATES.includes(hub.heroPanelState)
  const showConfig = !hub.config.configCompleted

  if (showConfig) {
    return (
      <div className="min-h-screen bg-off-white">
        <TitleBar
          title="Overview"
          subtitle="Configuring the service"
          showShareButton={false}
        />
        <main className="mx-auto max-w-[var(--content-max-width)] px-6 py-10">
          <DiscoveryFlow
            config={hub.config}
            onConfigUpdate={hub.updateConfig}
            onConfigComplete={hub.completeConfig}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-off-white">
      <TitleBar
        title="Overview"
        subtitle={isHeroActive ? 'Preparation' : undefined}
        showShareButton={hub.fidelity !== 'sketch'}
      />
      <main className="mx-auto max-w-[var(--content-max-width)] px-6 py-10">
        <HeroPanel
          state={hub.heroPanelState}
          lozenges={hub.lozenges}
          questions={hub.questions}
          autoConfirmItems={hub.autoConfirmItems}
          currentQuestionIndex={hub.currentQuestionIndex}
          uploadContext={hub.uploadContext}
          onFilesDropped={hub.handleFilesDropped}
          onReviewStart={hub.startReview}
          onAutoConfirmAccept={hub.acceptAutoConfirm}
          onQuestionAnswer={hub.answerQuestion}
          onSummaryFinish={hub.finishSession}
          onUploadMore={hub.resetToReady}
        />

        <div
          className="mt-10 transition-opacity"
          style={{
            opacity: isHeroActive ? 0.3 : 1,
            transitionDuration: 'var(--transition-fade)',
          }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-ink tracking-tight">
              Financial picture summary
            </h2>
            <FidelityLabel level={hub.fidelity} />
          </div>

          <SectionCards
            sections={hub.sections}
            onManualInput={hub.openManualInput}
            onReviewSection={hub.openSectionReview}
          />

          <button
            onClick={hub.addSection}
            className="mt-8 w-full py-4 text-center text-sm font-medium text-ink-secondary border border-grey-100 rounded-md hover:bg-grey-50 transition-colors"
          >
            + More to disclose
          </button>

          {hub.config.hasChildren && (
            <div className="mt-8 bg-white border border-grey-100 rounded-md p-6">
              <h3 className="text-base font-semibold text-ink">Your children</h3>
              <p className="mt-1 text-sm text-ink-secondary">
                Nothing to show yet, start building your financial picture now..
              </p>
              <button className="mt-4 px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity">
                Begin plan
              </button>
            </div>
          )}

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-ink tracking-tight">
                Life after separation
              </h2>
              <FidelityLabel level="sketch" />
            </div>
            <div className="bg-white border border-grey-100 rounded-md p-6">
              <p className="text-sm text-ink-tertiary">….</p>
              <p className="text-sm text-ink-tertiary">….</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

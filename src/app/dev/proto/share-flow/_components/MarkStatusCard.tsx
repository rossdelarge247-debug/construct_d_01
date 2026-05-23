import { tokens } from '@/styles/tokens';

type Props = {
  onShareClick: () => void;
};

export function MarkStatusCard({ onShareClick }: Props) {
  return (
    <div
      data-testid="mark-status-card"
      style={{
        border: `1px solid ${tokens.color.border}`,
        borderRadius: 12,
        padding: 16,
        background: tokens.color.surface.panel,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          aria-hidden="true"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: `2px dashed ${tokens.color.text.muted}`,
            color: tokens.color.text.muted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontFamily: tokens.font.sans,
          }}
        >
          ?
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: tokens.font.sans,
              fontSize: tokens.type['15-5'],
              fontWeight: 500,
              color: tokens.color.ink,
            }}
          >
            Mark
          </span>
          <span
            style={{
              fontFamily: tokens.font.sans,
              fontSize: 13,
              color: tokens.color.text.muted,
            }}
          >
            Not invited
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onShareClick}
        style={{
          background: tokens.color.phase.reconcile.accent,
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 999,
          padding: '12px 20px',
          fontFamily: tokens.font.sans,
          fontSize: tokens.type['15-5'],
          fontWeight: 500,
          cursor: 'pointer',
          width: '100%',
        }}
      >
        Share with Mark
      </button>
    </div>
  );
}

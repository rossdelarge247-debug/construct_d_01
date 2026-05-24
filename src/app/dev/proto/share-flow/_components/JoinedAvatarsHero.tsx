import { tokens } from '@/styles/tokens';

const RING = 64;
const OVERLAP = 18;

const SARAH_FILL = tokens.color.phase.reconcile.accent;
const SARAH_FG = '#FFFFFF';
const MARK_BORDER = tokens.color.text.muted;
const MARK_FG = tokens.color.text.muted;

export function JoinedAvatarsHero() {
  return (
    <div
      data-testid="joined-avatars-hero"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0,
        padding: '24px 0 12px',
      }}
    >
      <div
        aria-label="Sarah"
        style={{
          width: RING,
          height: RING,
          borderRadius: '50%',
          background: SARAH_FILL,
          color: SARAH_FG,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: tokens.font.sans,
          fontSize: 24,
          fontWeight: 600,
          boxShadow: `0 0 0 3px ${tokens.color.surface.panel}`,
          zIndex: 2,
        }}
      >
        S
      </div>
      <div
        aria-label="Mark (placeholder)"
        data-testid="mark-avatar-placeholder"
        style={{
          width: RING,
          height: RING,
          borderRadius: '50%',
          border: `2px dashed ${MARK_BORDER}`,
          color: MARK_FG,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: tokens.font.sans,
          fontSize: 22,
          marginLeft: -OVERLAP,
          background: tokens.color.surface.panel,
          zIndex: 1,
        }}
      >
        ?
      </div>
    </div>
  );
}

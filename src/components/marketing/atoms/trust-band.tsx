import { Shield, Lock, Check } from './icons'

const MUTE = 'var(--ds-color-text-muted)'
const INK = 'var(--ds-color-ink)'
const SUB = 'var(--ds-color-text-sub)'

export function TrustBand() {
  return (
    <div
      className="flex items-center justify-center gap-x-5 gap-y-2 flex-wrap text-[12.5px]"
      style={{ color: SUB }}
    >
      <span className="flex items-center gap-2">
        <Shield size={13} sw={1.8} style={{ color: MUTE }} />
        FCA-regulated bank connection via TrueLayer
      </span>
      <span
        style={{
          width: 3,
          height: 3,
          borderRadius: 99,
          background: '#D6D3CC',
        }}
        aria-hidden
      />
      <span className="flex items-center gap-2">
        <Lock size={13} sw={1.8} style={{ color: MUTE }} />
        Read-only · we can&apos;t move money
      </span>
      <span
        style={{
          width: 3,
          height: 3,
          borderRadius: 99,
          background: '#D6D3CC',
        }}
        aria-hidden
      />
      <span
        className="flex items-center gap-2"
        style={{ color: INK, fontWeight: 500 }}
      >
        <Check size={13} sw={2.1} style={{ color: '#166534' }} />
        Free until you choose to sign up
      </span>
    </div>
  )
}

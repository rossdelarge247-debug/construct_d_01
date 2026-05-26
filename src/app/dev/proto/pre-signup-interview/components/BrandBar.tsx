import { tokens } from '@/styles/tokens';
import { WORDMARK } from '@/constants';

export function BrandBar() {
  return (
    <div className="flex items-center justify-center pt-1 pb-2">
      <span
        style={{
          fontFamily: tokens.font.sans,
          fontSize: 14,
          fontWeight: 700,
          color: tokens.color.ink,
          letterSpacing: '-0.02em',
        }}
      >
        {WORDMARK}
      </span>
    </div>
  );
}

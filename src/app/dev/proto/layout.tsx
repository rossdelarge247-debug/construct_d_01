import { BankDataProvider } from './_context/bank-data-context';
import { ProfilingProvider } from './_context/profiling-context';
import { tokens } from '@/styles/tokens';

export default function ProtoLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfilingProvider>
      <BankDataProvider>
        <div style={{
          minHeight: '100dvh',
          background: tokens.color.surface.gradient.expressive,
          fontFamily: tokens.font.sans,
          color: tokens.color.ink,
        }}>
          {children}
        </div>
      </BankDataProvider>
    </ProfilingProvider>
  );
}

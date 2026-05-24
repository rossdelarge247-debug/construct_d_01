import { BankDataProvider } from './_context/bank-data-context';
import { ProfilingProvider } from './_context/profiling-context';

export default function ProtoLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfilingProvider>
      <BankDataProvider>{children}</BankDataProvider>
    </ProfilingProvider>
  );
}

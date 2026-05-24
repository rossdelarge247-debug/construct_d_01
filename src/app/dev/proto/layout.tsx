import { BankDataProvider } from './_context/bank-data-context';

export default function ProtoLayout({ children }: { children: React.ReactNode }) {
  return <BankDataProvider>{children}</BankDataProvider>;
}

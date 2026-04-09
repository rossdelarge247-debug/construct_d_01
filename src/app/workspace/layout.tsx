import { ToastProvider } from '@/components/workspace/toast'

export default function WorkspaceRootLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}

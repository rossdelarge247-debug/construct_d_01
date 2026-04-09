'use client'

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev.slice(-2), { id, message, type }]) // Max 3

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 space-y-2 md:bottom-8">
        {toasts.map(toast => (
          <div
            key={toast.id}
            onClick={() => dismissToast(toast.id)}
            className={cn(
              'flex items-center gap-3 rounded-[var(--radius-md)] px-5 py-3.5 shadow-[var(--shadow-lg)] cursor-pointer transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in',
              toast.type === 'success' && 'bg-ink text-cream',
              toast.type === 'error' && 'bg-warmth-dark text-white',
              toast.type === 'info' && 'bg-teal text-white',
            )}
          >
            <span className="text-sm">
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '✕'}
              {toast.type === 'info' && 'ℹ'}
            </span>
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, Bell, Settings, X, HelpCircle, User, FileText, LogOut } from 'lucide-react'

interface TitleBarProps {
  title: string
  subtitle?: string
  showShareButton: boolean
}

export function TitleBar({}: TitleBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-30 bg-white" style={{ boxShadow: '0 1px 0 var(--color-grey-100)' }}>
      <div
        style={{ height: 'var(--title-bar-height)' }}
        className="flex items-center justify-between px-6"
      >
        {/* Left — hamburger menu (always present) */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 -ml-2 text-ink hover:bg-grey-50 rounded-[var(--radius-md)] transition-colors"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Flyout menu — Airbnb-style */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
                onClick={() => setMenuOpen(false)}
              />
              <div
                className="absolute top-full left-0 mt-2 w-72 bg-white z-50 overflow-hidden animate-fade-in"
                style={{
                  borderRadius: 'var(--radius-card)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                }}
              >
                <NavMenuItem icon={<HelpCircle size={18} />} label="Help Centre" />
                <div style={{ borderBottom: '1px solid var(--color-grey-100)' }} />
                <NavMenuItem icon={<User size={18} />} label="My profile" />
                <NavMenuItem icon={<FileText size={18} />} label="My cases" />
                <div style={{ borderBottom: '1px solid var(--color-grey-100)' }} />
                <NavMenuItem icon={<LogOut size={18} />} label="Sign out" />
              </div>
            </>
          )}
        </div>

        {/* Centre — Decouple logo */}
        <span className="text-[18px] font-bold text-ink tracking-tight select-none">
          Decouple
        </span>

        {/* Right — bell + cog placeholders */}
        <div className="flex items-center gap-1">
          <button
            className="p-2 text-ink-tertiary hover:text-ink hover:bg-grey-50 rounded-[var(--radius-md)] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          <button
            className="p-2 text-ink-tertiary hover:text-ink hover:bg-grey-50 rounded-[var(--radius-md)] transition-colors"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}

function NavMenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-5 py-3.5 text-[15px] text-ink hover:bg-grey-50 transition-colors text-left">
      <span className="text-ink-tertiary">{icon}</span>
      {label}
    </button>
  )
}

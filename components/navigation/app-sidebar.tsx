'use client'

import { Fragment, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  House,
  SquaresFour,
  MagnifyingGlass,
  Lightning,
  CalendarBlank,
  TrendUp,
  Bird,
  Bell,
  GraduationCap,
  ChatCircle,
  GearSix,
  CaretLeft,
  CaretRight,
  ArrowSquareOut,
  Wallet,
  type Icon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/constants'
import { createBrowserClient } from '@/lib/supabase/client'

const STORAGE_KEY = 'ca-sidebar-collapsed'

const iconMap: Record<string, Icon> = {
  SquaresFour,
  House,
  Wallet,
  Lightning,
  CalendarBlank,
  GraduationCap,
  ChatCircle,
  Bird,
  TrendUp,
  MagnifyingGlass,
  Bell,
}

const GROUP_LABELS: Record<string, string> = {
  markets: 'Markets',
  intelligence: 'Intelligence',
  pelican: 'Pelican AI',
  learn: 'Learn & Community',
}

export default function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [logoHovered, setLogoHovered] = useState(false)
  const [gearHovered, setGearHovered] = useState(false)

  // Load collapse state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'true') setCollapsed(true)
  }, [])

  // Load user email
  useEffect(() => {
    const supabase = createBrowserClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
    })
  }, [])

  const toggleCollapse = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      window.dispatchEvent(new CustomEvent('sidebar-collapse', { detail: next }))
      return next
    })
  }, [])

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-30 hidden md:flex flex-col',
        'border-r border-[var(--border-subtle)] transition-[width] duration-200 ease-out',
      )}
      style={{
        width: collapsed ? 60 : 220,
        backgroundColor: 'rgba(from var(--bg-base) r g b / 0.95)',
        backdropFilter: 'blur(20px) saturate(1.2)',
      }}
    >
      {/* Faint brand edge gradient */}
      <div
        className="absolute right-0 top-0 bottom-0 w-px pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(29,161,196,0.06) 50%, transparent 100%)' }}
      />

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={toggleCollapse}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center z-10
          border border-[var(--border-subtle)] cursor-pointer transition-colors duration-150
          text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        {collapsed ? <CaretRight size={12} /> : <CaretLeft size={12} />}
      </button>

      {/* Logo */}
      <Link
        href="/dashboard"
        className={cn('flex items-center gap-2.5 mt-4 mb-5', collapsed ? 'justify-center px-0' : 'px-4')}
        onMouseEnter={() => setLogoHovered(true)}
        onMouseLeave={() => setLogoHovered(false)}
      >
        <div
          className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 cursor-pointer"
          style={{
            background: 'var(--accent-gradient)',
            boxShadow: logoHovered
              ? '0 2px 16px rgba(29,161,196,0.25)'
              : '0 2px 8px rgba(29,161,196,0.15)',
            transform: logoHovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'all 200ms ease',
          }}
        >
          CA
        </div>
        {!collapsed && (
          <span className="text-[13px] font-semibold text-[var(--text-primary)] whitespace-nowrap overflow-hidden">
            CryptoAnalytix
          </span>
        )}
      </Link>

      {/* Search placeholder (expanded only) */}
      {!collapsed && (
        <div className="px-3 mb-3">
          <div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px]
              text-[var(--text-muted)] border border-[var(--border-subtle)]
              cursor-not-allowed"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <MagnifyingGlass size={14} />
            <span>Search...</span>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className={cn('flex flex-col flex-1 overflow-y-auto', collapsed ? 'items-center' : '')}>
        {NAV_ITEMS.map((item, index) => {
          const prevItem = index > 0 ? NAV_ITEMS[index - 1] : null
          const showGroupLabel = !prevItem || prevItem.group !== item.group

          const NavIcon = iconMap[item.iconName]
          const isActive = !item.external && (pathname === item.path || pathname.startsWith(item.path + '/'))
          const isPelicanItem = item.id === 'pelican-portal'
          const isAlerts = item.id === 'alerts'

          return (
            <Fragment key={item.id}>
              {/* Group label / separator */}
              {showGroupLabel && (
                collapsed ? (
                  index > 0 && (
                    <div className="w-6 h-px my-1.5" style={{ backgroundColor: 'var(--border-subtle)' }} />
                  )
                ) : (
                  <span
                    className={cn(
                      'px-4 mb-1 text-[10px] uppercase tracking-[1.5px] font-semibold',
                      'text-[var(--text-muted)]',
                      index > 0 ? 'mt-5' : 'mt-1',
                    )}
                  >
                    {GROUP_LABELS[item.group] ?? item.group}
                  </span>
                )
              )}

              {/* Nav item */}
              {item.external ? (
                <a
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'relative flex items-center gap-3 py-2 rounded-lg',
                    'text-[13px] font-medium transition-colors duration-150',
                    'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.03)]',
                    collapsed
                      ? 'w-[44px] h-[44px] justify-center mx-auto'
                      : 'mx-2 px-3',
                  )}
                >
                  <span className="relative flex-shrink-0">
                    {NavIcon && <NavIcon size={18} weight="regular" />}
                    <ArrowSquareOut
                      size={8}
                      className="absolute -top-1 -right-1.5 text-[var(--text-muted)]"
                    />
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </a>
              ) : (
                <Link
                  href={item.path}
                  className={cn(
                    'relative flex items-center gap-3 py-2 rounded-lg',
                    'text-[13px] font-medium transition-colors duration-150',
                    isActive
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.03)]',
                    collapsed
                      ? 'w-[44px] h-[44px] justify-center mx-auto flex-col gap-0.5'
                      : 'mx-2 px-3',
                  )}
                  style={
                    isActive
                      ? { background: 'linear-gradient(90deg, rgba(29,161,196,0.08) 0%, transparent 80%)' }
                      : isPelicanItem && !isActive
                        ? { background: 'rgba(29,161,196,0.04)' }
                        : undefined
                  }
                >
                  {/* Active bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r bg-[var(--accent-primary)]" />
                  )}

                  {NavIcon && <NavIcon size={18} weight={isActive ? 'fill' : 'regular'} className="flex-shrink-0" />}

                  {collapsed ? (
                    <span className="text-[9px] font-medium uppercase tracking-[0.4px] leading-none">
                      {item.label}
                    </span>
                  ) : (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {/* AI Alerts badge */}
                      {isAlerts && (
                        <span
                          className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{
                            background: 'rgba(29,161,196,0.15)',
                            color: 'var(--accent-primary)',
                          }}
                        >
                          7 New
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )}
            </Fragment>
          )
        })}
      </nav>

      {/* Bottom user section */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <div className={cn('flex items-center', collapsed ? 'justify-center' : 'gap-2')}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
          >
            {userEmail?.[0]?.toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-xs truncate text-[var(--text-secondary)]">{userEmail ?? 'User'}</div>
                <div className="text-[10px] text-[var(--text-muted)]">Pro</div>
              </div>
              <Link
                href="/settings"
                onMouseEnter={() => setGearHovered(true)}
                onMouseLeave={() => setGearHovered(false)}
              >
                <GearSix
                  size={16}
                  className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                  style={{
                    transform: gearHovered ? 'rotate(30deg)' : 'rotate(0deg)',
                    transition: 'transform 300ms ease',
                  }}
                />
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}

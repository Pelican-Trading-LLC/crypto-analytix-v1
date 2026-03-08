'use client'

import { Suspense, useState, useEffect } from 'react'
import AppSidebar from '@/components/navigation/app-sidebar'
import HeaderBar from '@/components/navigation/header-bar'
import MobileNav from '@/components/navigation/mobile-nav'
import PelicanChatPanel from '@/components/pelican-panel/pelican-chat-panel'
import WhatIMissed from '@/components/brief/what-i-missed'
import { PelicanPanelProvider, usePelicanPanelContext } from '@/providers/pelican-panel-provider'
import { GlossaryProvider } from '@/lib/glossary/glossary-provider'
import { PELICAN_PANEL_WIDTH } from '@/lib/constants'
import { useBrief } from '@/hooks/use-brief'

const SIDEBAR_STORAGE_KEY = 'ca-sidebar-collapsed'

function WhatIMissedWrapper() {
  const { whatIMissed, dismissWhatIMissed } = useBrief()
  return <WhatIMissed data={whatIMissed} onDismiss={dismissWhatIMissed} />
}

function FeaturesContent({ children }: { children: React.ReactNode }) {
  const { state } = usePelicanPanelContext()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  // Sync sidebar collapse state for margin calculation
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    setSidebarCollapsed(stored === 'true')

    const handler = ((e: CustomEvent<boolean>) => {
      setSidebarCollapsed(e.detail)
    }) as EventListener
    window.addEventListener('sidebar-collapse', handler)
    return () => window.removeEventListener('sidebar-collapse', handler)
  }, [])

  const sidebarWidth = sidebarCollapsed ? 60 : 220

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Atmosphere layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 15% 0%, var(--atmosphere-primary) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 85% 100%, var(--atmosphere-secondary) 0%, transparent 50%)',
        }}
      />

      {/* Sidebar — hidden on mobile */}
      <AppSidebar />

      {/* Main content area — sidebar hidden on mobile, so no margin there */}
      <div
        className="flex-1 flex flex-col min-h-screen relative z-10 transition-[margin] duration-200 ease-out md:!ml-[var(--sidebar-w)]"
        style={{ '--sidebar-w': `${sidebarWidth}px` } as React.CSSProperties}
      >
        <HeaderBar />

        <main
          className="flex-1 overflow-y-auto transition-[margin] duration-300 ease-out pb-20 md:pb-0"
          style={{ marginRight: state.isOpen ? PELICAN_PANEL_WIDTH : 0 }}
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Pelican AI panel */}
      <PelicanChatPanel />

      {/* What I Missed overlay */}
      <Suspense fallback={null}>
        <WhatIMissedWrapper />
      </Suspense>
    </div>
  )
}

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <PelicanPanelProvider>
      <GlossaryProvider>
        <FeaturesContent>{children}</FeaturesContent>
      </GlossaryProvider>
    </PelicanPanelProvider>
  )
}

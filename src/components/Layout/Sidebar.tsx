// src/components/Layout/Sidebar.tsx
import type { ReactNode } from 'react'

interface SidebarProps {
  children: ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside style={{ width: 260, borderRight: '1px solid var(--border)', padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24, flexShrink: 0 }}>
      {children}
    </aside>
  )
}

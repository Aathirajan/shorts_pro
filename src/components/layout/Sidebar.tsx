'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Film,
  Wand2,
  UserCircle,
  BarChart3,
  Settings,
  Zap,
  FolderOpen,
  Library,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  badgeColor?: 'orange' | 'green';
}

function SidebarItem({ href, icon, label, badge, badgeColor = 'orange' }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-button text-sm font-medium transition-colors',
        isActive
          ? 'bg-surface-2 text-text'
          : 'text-text-muted hover:text-text hover:bg-surface-2/50'
      )}
    >
      <span className={cn('w-5 h-5', isActive ? 'text-text' : 'text-text-muted')}>
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge variant={badgeColor === 'green' ? 'success' : 'warning'} size="sm">
          {badge}
        </Badge>
      )}
    </Link>
  );
}

interface SidebarSectionProps {
  label: string;
  children: React.ReactNode;
}

function SidebarSection({ label, children }: SidebarSectionProps) {
  return (
    <div className="mb-6">
      <h4 className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </h4>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export function Sidebar() {
  // Mock data - would come from API
  const draftCount = 3;
  const scheduledCount = 8;

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-text flex items-center justify-center">
            <Zap className="w-5 h-5 text-surface" />
          </div>
          <span className="font-display text-lg font-medium text-text">
            YTShortsPro
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <SidebarSection label="Overview">
          <SidebarItem
            href="/dashboard"
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
          />
        </SidebarSection>

        <SidebarSection label="Product">
          <SidebarItem
            href="/projects"
            icon={<Film className="w-5 h-5" />}
            label="Projects"
            badge={draftCount}
          />
          <SidebarItem
            href="/magic-clips"
            icon={<Wand2 className="w-5 h-5" />}
            label="Magic Clips"
          />
          <SidebarItem
            href="/avatar-studio"
            icon={<UserCircle className="w-5 h-5" />}
            label="Avatar Studio"
          />
          <SidebarItem
            href="/library"
            icon={<Library className="w-5 h-5" />}
            label="Library"
          />
          <SidebarItem
            href="/folders"
            icon={<FolderOpen className="w-5 h-5" />}
            label="Folders"
          />
        </SidebarSection>

        <SidebarSection label="Intelligence">
          <SidebarItem
            href="/analytics"
            icon={<BarChart3 className="w-5 h-5" />}
            label="Analytics"
          />
          <SidebarItem
            href="/channels"
            icon={<Sparkles className="w-5 h-5" />}
            label="Channels"
          />
        </SidebarSection>
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border">
        <SidebarItem
          href="/settings"
          icon={<Settings className="w-5 h-5" />}
          label="Settings"
        />
      </div>
    </aside>
  );
}

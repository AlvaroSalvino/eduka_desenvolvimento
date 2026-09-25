import React from 'react';
import { useIes } from '@/hooks/useIes';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRole } from '@/lib/RoleContext';
import { ADMIN_NAV, PORTAL_NAV, filterNavByRole } from '@/lib/navigation';

export default function Sidebar({ collapsed, onToggle }) {
  const { nomeIes } = useIes();
  const { role, isPortalUser } = useRole();
  const nav = isPortalUser ? PORTAL_NAV : filterNavByRole(ADMIN_NAV, role);

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 border-r border-sidebar-border flex flex-col',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shrink-0 shadow-lg">
            <GraduationCap className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="min-w-0"
            >
              <div className="font-serif text-[15px] font-bold leading-tight tracking-tight truncate">
                {nomeIes ?? 'Eduka'}
              </div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-sidebar-foreground/50 font-medium">
                Sistema de Gestão
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3">
        {nav.map((group) => (
          <div key={group.group} className="mb-6">
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] uppercase tracking-[0.15em] text-sidebar-foreground/40 font-semibold">
                {group.group}
              </div>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/portal' || item.to === '/dashboard'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-sidebar-primary"
                          />
                        )}
                        <item.icon className={cn('w-[18px] h-[18px] shrink-0', isActive && 'text-sidebar-primary')} />
                        {!collapsed && <span className="truncate text-white">{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse button */}
      <button
        onClick={onToggle}
        className="h-12 border-t border-sidebar-border hover:bg-sidebar-accent/50 flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
      >
        <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
        {!collapsed && <span className="ml-2 text-xs font-medium">Recolher</span>}
      </button>
    </aside>
  );
}
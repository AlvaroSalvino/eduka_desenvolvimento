import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Wallet, BookOpen, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRole } from '@/lib/RoleContext';

const ADMIN_BOTTOM = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/alunos', label: 'Alunos', icon: Users },
  { to: '/financeiro', label: 'Financeiro', icon: Wallet },
  { to: '/notas', label: 'Notas', icon: BookOpen },
];

const PORTAL_BOTTOM = [
  { to: '/portal', label: 'Início', icon: LayoutDashboard },
  { to: '/portal/notas', label: 'Notas', icon: BookOpen },
  { to: '/portal/financeiro', label: 'Financeiro', icon: Wallet },
  { to: '/portal/perfil', label: 'Perfil', icon: Users },
];

export default function BottomNav({ onMenuOpen }) {
  const { isPortalUser } = useRole();
  const items = isPortalUser ? PORTAL_BOTTOM : ADMIN_BOTTOM;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-card border-t border-border">
      <div className="flex items-stretch">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/portal' || item.to === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('w-5 h-5', isActive && 'text-primary')} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Botão "Mais" abre o drawer com todos os itens */}
        <button
          onClick={onMenuOpen}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
          <span>Menu</span>
        </button>
      </div>
    </nav>
  );
}
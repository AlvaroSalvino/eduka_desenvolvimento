import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Moon, Sun, Menu, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRole } from '@/lib/RoleContext';
import RoleSwitcher from './RoleSwitcher';
import NotificationsPopover from './NotificationsPopover';
import StudentSwitcher from '@/components/portal/StudentSwitcher';

const PATH_LABELS = {
  dashboard: 'Dashboard', alunos: 'Alunos', responsaveis: 'Responsáveis',
  colaboradores: 'Colaboradores', matriculas: 'Matrículas', turmas: 'Turmas',
  calendario: 'Calendário', financeiro: 'Financeiro', boletos: 'Boletos',
  inadimplencia: 'Inadimplência', notas: 'Notas', frequencia: 'Frequência',
  boletins: 'Boletins', documentos: 'Documentos', relatorios: 'Relatórios',
  configuracoes: 'Configurações', mensagens: 'Mensagens', notificacoes: 'Notificações',
  portal: 'Portal', perfil: 'Perfil', comunicados: 'Comunicados',
};

function Breadcrumb() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  return (
    <div className="hidden md:flex items-center gap-1.5 text-sm">
      <span className="text-muted-foreground">Início</span>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
          <span className={i === parts.length - 1 ? 'font-medium text-foreground' : 'text-muted-foreground'}>
            {PATH_LABELS[p] || p}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Topbar({ onToggleSidebar }) {
  const { theme, setTheme, role } = useRole();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-30">
      <div className="h-full px-4 md:px-6 flex items-center gap-4">
        {/* Menu button — only on mobile (sm), hidden on md+ since BottomNav handles it */}
        <Button variant="ghost" size="icon" className="flex lg:hidden" onClick={onToggleSidebar}>
          <Menu className="w-5 h-5" />
        </Button>

        <Breadcrumb />

        <div className="flex-1" />

        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Buscar alunos, turmas, boletos..."
            className="pl-9 pr-4 h-9 w-64 xl:w-80 bg-muted/40 border-transparent focus-visible:bg-background focus-visible:border-border"
          />
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(true)}>
          <Search className="w-5 h-5" />
        </Button>

        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {role === 'responsavel' && <StudentSwitcher />}

        <NotificationsPopover />

        <RoleSwitcher />
      </div>
    </header>
  );
}
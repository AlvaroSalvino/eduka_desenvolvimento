import {
  LayoutDashboard, Users, UserCog, Briefcase, FileSignature,
  GraduationCap, CalendarDays, Wallet, Receipt, AlertTriangle,
  Bell, MessageSquare, BookOpen, ClipboardCheck, FileText,
  FolderOpen, BarChart3, Settings, User, CalendarCheck, CreditCard,
} from 'lucide-react';

export const ADMIN_NAV = [
  {
    group: 'Principal',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'secretaria', 'financeiro', 'professor'] },
    ],
  },
  {
    group: 'Secretaria',
    items: [
      { to: '/alunos', label: 'Alunos', icon: Users, roles: ['admin', 'secretaria', 'professor'] },
      { to: '/responsaveis', label: 'Responsáveis', icon: UserCog, roles: ['admin', 'secretaria'] },
      { to: '/matriculas', label: 'Matrículas', icon: FileSignature, roles: ['admin', 'secretaria'] },
      { to: '/turmas', label: 'Turmas & Séries', icon: GraduationCap, roles: ['admin', 'secretaria', 'professor'] },
      { to: '/calendario', label: 'Calendário', icon: CalendarDays, roles: ['admin', 'secretaria', 'professor'] },
    ],
  },
  {
    group: 'Financeiro',
    items: [
      { to: '/financeiro', label: 'Financeiro', icon: Wallet, roles: ['admin', 'financeiro'] },
      { to: '/planos-pagamento', label: 'Planos de Pagamento', icon: CreditCard, roles: ['admin', 'financeiro'] },
      { to: '/boletos', label: 'Boletos', icon: Receipt, roles: ['admin', 'financeiro'] },
      { to: '/inadimplencia', label: 'Inadimplência', icon: AlertTriangle, roles: ['admin', 'financeiro'] },
    ],
  },
  {
    group: 'Acadêmico',
    items: [
      { to: '/notas', label: 'Notas', icon: BookOpen, roles: ['admin', 'professor', 'secretaria'] },
      { to: '/frequencia', label: 'Frequência', icon: ClipboardCheck, roles: ['admin', 'professor', 'secretaria'] },
      { to: '/boletins', label: 'Boletins', icon: FileText, roles: ['admin', 'professor', 'secretaria'] },
    ],
  },
  {
    group: 'Comunicação',
    items: [
      { to: '/mensagens', label: 'Mensagens', icon: MessageSquare, roles: ['admin', 'secretaria', 'professor'] },
      { to: '/notificacoes', label: 'Notificações', icon: Bell, roles: ['admin', 'secretaria'] },
    ],
  },
  {
    group: 'Gestão',
    items: [
      { to: '/documentos', label: 'Documentos', icon: FolderOpen, roles: ['admin', 'secretaria'] },
      { to: '/colaboradores', label: 'Colaboradores', icon: Briefcase, roles: ['admin'] },
      { to: '/secretaria/documentos', label: 'Solicitações', icon: FileSignature, roles: ['admin', 'secretaria'] },
      { to: '/relatorios', label: 'Relatórios', icon: BarChart3, roles: ['admin', 'financeiro', 'secretaria'] },
      { to: '/configuracoes', label: 'Configurações', icon: Settings, roles: ['admin'] },
    ],
  },
];

export const PORTAL_NAV = [
  {
    group: 'Portal',
    items: [
      { to: '/portal', label: 'Visão Geral', icon: LayoutDashboard },
      { to: '/portal/notas', label: 'Notas & Boletim', icon: BookOpen },
      { to: '/portal/frequencia', label: 'Frequência', icon: CalendarCheck },
      { to: '/portal/financeiro', label: 'Financeiro', icon: Wallet },
      { to: '/portal/documentos', label: 'Documentos', icon: FolderOpen },
      { to: '/portal/comunicados', label: 'Comunicados', icon: Bell },
      { to: '/portal/calendario', label: 'Calendário', icon: CalendarDays },
      { to: '/portal/perfil', label: 'Meu Perfil', icon: User },
    ],
  },
];

export function filterNavByRole(nav, role) {
  return nav
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.roles || item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);
}
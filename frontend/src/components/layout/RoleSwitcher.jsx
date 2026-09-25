import React from 'react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useRole, ROLES } from '@/lib/RoleContext';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RoleSwitcher() {
  const { role, setRole, roleMeta } = useRole();
  const navigate = useNavigate();

  const handleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'aluno' || newRole === 'responsavel') navigate('/portal');
    else navigate('/dashboard');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full hover:bg-muted transition-colors group">
          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm', roleMeta.color)}>
            {roleMeta.label.charAt(0)}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium leading-tight">{roleMeta.label}</div>
            <div className="text-[10px] text-muted-foreground">Trocar perfil</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          Simular perfil
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.values(ROLES).map((r) => (
          <DropdownMenuItem key={r.key} onClick={() => handleChange(r.key)} className="gap-3 py-2">
            <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold', r.color)}>
              {r.label.charAt(0)}
            </div>
            <span className="flex-1">{r.label}</span>
            {role === r.key && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
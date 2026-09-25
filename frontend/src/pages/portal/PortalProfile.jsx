import React from 'react';
import { User, Mail, Phone, Home, GraduationCap, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';

export default function PortalProfile() {
  return (
    <div>
      <PageHeader title="Meu Perfil" subtitle="Dados cadastrais" icon={User} actions={<Button variant="outline"><Pencil className="w-4 h-4 mr-1.5" />Editar</Button>} />

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 premium-shadow text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-serif text-3xl font-bold mb-4 shadow-lg">
            AS
          </div>
          <div className="font-serif text-xl font-bold">Ana Sofia Martins</div>
          <div className="text-sm text-muted-foreground">Matrícula #20250042</div>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Matrícula ativa
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 premium-shadow">
            <h3 className="font-serif text-lg font-semibold mb-5">Informações pessoais</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field icon={User} label="Nome completo" value="Ana Sofia Martins" />
              <Field icon={Mail} label="Email" value="ana.martins@email.com" />
              <Field icon={Phone} label="Telefone" value="(11) 98765-4321" />
              <Field icon={GraduationCap} label="Série / Turma" value="8º Ano — A" />
              <Field icon={Home} label="Endereço" value="Rua das Flores, 123 — São Paulo" span />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 premium-shadow">
            <h3 className="font-serif text-lg font-semibold mb-5">Responsáveis</h3>
            <div className="space-y-3">
              {[
                { name: 'Carlos Martins', rel: 'Pai', phone: '(11) 99999-1111' },
                { name: 'Marina Martins', rel: 'Mãe', phone: '(11) 99999-2222' },
              ].map((r) => (
                <div key={r.name} className="p-4 rounded-xl bg-muted/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                    {r.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.rel} • {r.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value, span }) {
  return (
    <div className={span ? 'md:col-span-2' : ''}>
      <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1 flex items-center gap-1.5">
        <Icon className="w-3 h-3" />{label}
      </div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
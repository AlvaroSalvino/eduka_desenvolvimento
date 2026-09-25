import React from 'react';
import { FolderOpen, Plus, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';

const AVAILABLE = [
  { title: 'Declaração de Matrícula', desc: 'Comprove seu vínculo com a instituição', icon: FileText },
  { title: 'Histórico Escolar', desc: 'Registro completo do seu desempenho', icon: FileText },
  { title: 'Boletim do Bimestre', desc: 'Notas e frequência atualizadas', icon: FileText },
  { title: 'Contrato de Prestação', desc: 'Contrato atual de matrícula', icon: FileText },
];

export default function PortalDocuments() {
  return (
    <div>
      <PageHeader
        title="Documentos"
        subtitle="Solicite e acompanhe documentos escolares"
        icon={FolderOpen}
        actions={<Button className="bg-primary"><Plus className="w-4 h-4 mr-1.5" />Nova solicitação</Button>}
      />

      <div className="grid md:grid-cols-2 gap-4">
        {AVAILABLE.map((d) => (
          <div key={d.title} className="bg-card border border-border rounded-2xl p-6 premium-shadow hover:premium-shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                <d.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg font-semibold">{d.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">{d.desc}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1.5" />Baixar</Button>
                  <Button size="sm" className="bg-primary">Solicitar</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { useIes } from '@/hooks/useIes';
import { iesApi } from '@/services/apiInstitucional';
import { limparCnpj, formatarCnpj } from '@/utils/cnpj';
import { limparCep, formatarCep, buscarCep } from '@/utils/cep';
import { limparTelefone, formatarTelefone } from '@/utils/telefone';
import { Settings as SettingsIcon, Building2, Palette, Users, Shield, Plug, Lock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import PageHeader from '@/components/shared/PageHeader';

export default function Settings() {
  const { ies } = useIes();
  const [form, setForm] = React.useState({});
  React.useEffect(() => {
    if (ies) {
      setForm(ies);
    }
  }, [ies]);
  
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCepChange = async (value) => {
    const cleaned = limparCep(value);

    handleChange('cep', cleaned);

    if (cleaned.length === 8) {
      const toastId = toast.loading("Buscando CEP...");
      
      const data = await buscarCep(cleaned);

      if (data) {
        setForm((prev) => ({
          ...prev,
          cep: cleaned,
          rua: prev.rua || data.rua || '',
          bairro: prev.bairro || data.bairro || '',
          cidade: prev.cidade || data.cidade || '',
          estado: prev.estado || data.estado || '',
          complemento: prev.complemento || data.complemento || '',
        }));
        toast.success("CEP encontrado", { id: toastId });
      } else {
        toast.error("CEP não encontrado", { id: toastId });
      }
    }
  };

  const handleSave = async () => {
    try {
      await iesApi.update(form.id, form);
      toast.success("Dados atualizados com sucesso");
    } catch (error) {
      toast.error("Erro ao salvar");
    }
  };
  return (
    <div>
      <PageHeader title="Configurações" subtitle="Gerencie dados da escola, usuários e preferências" icon={SettingsIcon} />

      <Tabs defaultValue="school" orientation="vertical" className="flex flex-col lg:flex-row gap-6">
        <TabsList className="flex-col h-auto w-full lg:w-60 bg-card border border-border p-2 rounded-2xl premium-shadow">
          <TabsTrigger value="school" className="w-full justify-start gap-2"><Building2 className="w-4 h-4" />Dados da Escola</TabsTrigger>
          <TabsTrigger value="theme" className="w-full justify-start gap-2"><Palette className="w-4 h-4" />Aparência</TabsTrigger>
          <TabsTrigger value="users" className="w-full justify-start gap-2"><Users className="w-4 h-4" />Usuários</TabsTrigger>
          <TabsTrigger value="perms" className="w-full justify-start gap-2"><Shield className="w-4 h-4" />Permissões</TabsTrigger>
          <TabsTrigger value="integrations" className="w-full justify-start gap-2"><Plug className="w-4 h-4" />Integrações</TabsTrigger>
          <TabsTrigger value="security" className="w-full justify-start gap-2"><Lock className="w-4 h-4" />Segurança</TabsTrigger>
        </TabsList>

        <div className="flex-1 bg-card border border-border rounded-2xl p-6 md:p-8 premium-shadow">
          <TabsContent value="school" className="space-y-6 mt-0">
            <div>
              <h3 className="font-serif text-xl font-semibold mb-1">Dados da Escola</h3>
              <p className="text-sm text-muted-foreground">Informações institucionais</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Nome da instituição</Label><Input value={form.nome || ''} onChange={(e) => handleChange('nome', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>CNPJ</Label><Input value={formatarCnpj(form.cnpj || '')} onChange={(e) => { const value = e.target.value; handleChange('cnpj', limparCnpj(value)); }} /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email || ''} onChange={(e) => handleChange('email', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Telefone</Label><Input value={formatarTelefone(form.telefone || '')} onChange={(e) => { const value = e.target.value; handleChange('telefone', limparTelefone(value)); }} /></div>
              <div className="space-y-1.5"><Label>CEP</Label><Input value={formatarCep(form.cep || '')} onChange={(e) => handleCepChange(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Rua</Label><Input value={form.rua || ''} onChange={(e) => handleChange('rua', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Número</Label><Input value={form.numero || ''} onChange={(e) => handleChange('numero', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Complemento</Label><Input value={form.complemento || ''} onChange={(e) => handleChange('complemento', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Bairro</Label><Input value={form.bairro || ''} onChange={(e) => handleChange('bairro', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Cidade</Label><Input value={form.cidade || ''} onChange={(e) => handleChange('cidade', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Estado</Label><Input value={form.estado || ''} onChange={(e) => handleChange('estado', e.target.value)} /></div>
            </div>
            <Button onClick={handleSave}>Salvar alterações</Button>
          </TabsContent>

          <TabsContent value="theme" className="space-y-6 mt-0">
            <div>
              <h3 className="font-serif text-xl font-semibold mb-1">Aparência</h3>
              <p className="text-sm text-muted-foreground">Personalize cores e logo</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Cor primária</Label><Input type="color" defaultValue="#1E3A6B" className="h-11" /></div>
              <div className="space-y-1.5"><Label>Cor de destaque</Label><Input type="color" defaultValue="#C9A961" className="h-11" /></div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            <h3 className="font-serif text-xl font-semibold mb-1">Usuários do Sistema</h3>
            <p className="text-sm text-muted-foreground mb-6">Gerencie acesso e convites</p>
            <div className="border border-dashed border-border rounded-xl p-8 text-center">
              <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Convide colaboradores para acessarem o sistema</p>
              <Button className="mt-4 bg-primary">Convidar usuário</Button>
            </div>
          </TabsContent>

          <TabsContent value="perms" className="mt-0">
            <h3 className="font-serif text-xl font-semibold mb-1">Permissões</h3>
            <p className="text-sm text-muted-foreground mb-6">Configure acessos por perfil</p>
            <div className="space-y-3">
              {['Secretaria pode editar alunos', 'Professores acessam notas', 'Financeiro emite boletos', 'Responsáveis veem boletins'].map((p) => (
                <div key={p} className="flex items-center justify-between p-4 border border-border rounded-xl">
                  <span className="text-sm font-medium">{p}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="mt-0">
            <h3 className="font-serif text-xl font-semibold mb-1">Integrações</h3>
            <p className="text-sm text-muted-foreground mb-6">Conecte serviços externos</p>
            <div className="grid md:grid-cols-2 gap-4">
              {['Pagar.me', 'Gerencianet', 'WhatsApp Business', 'Gmail'].map((n) => (
                <div key={n} className="p-4 border border-border rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-medium">{n}</div>
                    <div className="text-xs text-muted-foreground">Não conectado</div>
                  </div>
                  <Button variant="outline" size="sm">Conectar</Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <h3 className="font-serif text-xl font-semibold mb-1">Segurança</h3>
            <p className="text-sm text-muted-foreground mb-6">Proteção da conta e dados</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <div className="font-medium">Autenticação em 2 fatores</div>
                  <div className="text-xs text-muted-foreground">Camada extra de segurança</div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <div className="font-medium">Backup automático</div>
                  <div className="text-xs text-muted-foreground">Diário às 02:00</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
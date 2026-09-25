import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { User, MapPin, FileText } from 'lucide-react';
import { GradeLevelSelect } from '@/lib/educationLevels.jsx';

const EMPTY = {
  full_name: '', registration_number: '', birth_date: '', gender: 'masculino',
  cpf: '', rg: '', email: '', phone: '',
  education_level: '', grade_level: '', class_name: '', shift: 'manha', status: 'ativo',
  observations: '', address: { street: '', number: '', neighborhood: '', city: '', state: '', zip_code: '' },
};

export default function StudentDialog({ open, onOpenChange, student, onSave }) {
  const [data, setData] = useState(EMPTY);

  useEffect(() => {
    if (student) setData({ ...EMPTY, ...student, address: { ...EMPTY.address, ...(student.address || {}) } });
    else setData(EMPTY);
  }, [student, open]);

  const update = (k, v) => setData((p) => ({ ...p, [k]: v }));
  const updateAddr = (k, v) => setData((p) => ({ ...p, address: { ...p.address, [k]: v } }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {student ? 'Editar Aluno' : 'Novo Aluno'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="dados" className="mt-2">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="dados"><User className="w-4 h-4 mr-1.5" />Dados</TabsTrigger>
              <TabsTrigger value="endereco"><MapPin className="w-4 h-4 mr-1.5" />Endereço</TabsTrigger>
              <TabsTrigger value="obs"><FileText className="w-4 h-4 mr-1.5" />Observações</TabsTrigger>
            </TabsList>
            <TabsContent value="dados" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Nome completo *"><Input required value={data.full_name} onChange={(e) => update('full_name', e.target.value)} /></Field>
                <Field label="Matrícula"><Input value={data.registration_number} onChange={(e) => update('registration_number', e.target.value)} /></Field>
                <Field label="Data de nascimento"><Input type="date" value={data.birth_date} onChange={(e) => update('birth_date', e.target.value)} /></Field>
                <Field label="Gênero">
                  <Select value={data.gender} onValueChange={(v) => update('gender', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="CPF"><Input value={data.cpf} onChange={(e) => update('cpf', e.target.value)} /></Field>
                <Field label="RG"><Input value={data.rg} onChange={(e) => update('rg', e.target.value)} /></Field>
                <Field label="Email"><Input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} /></Field>
                <Field label="Telefone"><Input value={data.phone} onChange={(e) => update('phone', e.target.value)} /></Field>
                <Field label="Nível de ensino">
                  <Select value={data.education_level} onValueChange={(v) => update('education_level', v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione o nível" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infantil">Educação Infantil</SelectItem>
                      <SelectItem value="fundamental_1">Fund. I (1-5)</SelectItem>
                      <SelectItem value="fundamental_2">Fund. II (6-9)</SelectItem>
                      <SelectItem value="medio">Ensino Médio</SelectItem>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                      <SelectItem value="graduacao">Graduação</SelectItem>
                      <SelectItem value="pos_graduacao">Pós-Graduação</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Série / Semestre / Módulo">
                  <GradeLevelSelect value={data.grade_level} onValueChange={(v) => update('grade_level', v)} placeholder="Selecione a série" />
                </Field>
                <Field label="Turma"><Input placeholder="A, B, C..." value={data.class_name} onChange={(e) => update('class_name', e.target.value)} /></Field>
                <Field label="Turno">
                  <Select value={data.shift} onValueChange={(v) => update('shift', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manha">Manhã</SelectItem>
                      <SelectItem value="tarde">Tarde</SelectItem>
                      <SelectItem value="integral">Integral</SelectItem>
                      <SelectItem value="noite">Noite</SelectItem>
                      <SelectItem value="ead">EAD</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Status">
                  <Select value={data.status} onValueChange={(v) => update('status', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="transferido">Transferido</SelectItem>
                      <SelectItem value="formado">Formado</SelectItem>
                      <SelectItem value="trancado">Trancado</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </TabsContent>
            <TabsContent value="endereco" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2"><Field label="Rua"><Input value={data.address.street} onChange={(e) => updateAddr('street', e.target.value)} /></Field></div>
                <Field label="Número"><Input value={data.address.number} onChange={(e) => updateAddr('number', e.target.value)} /></Field>
                <Field label="Bairro"><Input value={data.address.neighborhood} onChange={(e) => updateAddr('neighborhood', e.target.value)} /></Field>
                <Field label="Cidade"><Input value={data.address.city} onChange={(e) => updateAddr('city', e.target.value)} /></Field>
                <Field label="Estado"><Input value={data.address.state} onChange={(e) => updateAddr('state', e.target.value)} /></Field>
                <Field label="CEP"><Input value={data.address.zip_code} onChange={(e) => updateAddr('zip_code', e.target.value)} /></Field>
              </div>
            </TabsContent>
            <TabsContent value="obs" className="mt-4">
              <Field label="Observações">
                <Textarea rows={6} value={data.observations} onChange={(e) => update('observations', e.target.value)} placeholder="Informações relevantes, necessidades especiais, etc." />
              </Field>
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-primary">{student ? 'Salvar alterações' : 'Cadastrar aluno'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}
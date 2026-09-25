import React from 'react';
import { Bell } from 'lucide-react';
import ComingSoonPage from '@/components/shared/ComingSoonPage';

export default function Notifications() {
  return (
    <ComingSoonPage
      title="Notificações"
      subtitle="Central de notificações do sistema"
      icon={Bell}
      features={[
        { title: 'Push notifications', desc: 'Avisos em tempo real' },
        { title: 'Email automático', desc: 'Envio programado' },
        { title: 'Histórico', desc: 'Registro de todas notificações' },
      ]}
    />
  );
}
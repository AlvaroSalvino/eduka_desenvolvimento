import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { RoleProvider } from '@/lib/RoleContext';
import { SelectedStudentProvider } from '@/lib/SelectedStudentContext';
import AppLayout from '@/components/layout/AppLayout';

// Admin pages
import Dashboard from '@/pages/Dashboard';
import Alunos from '@/pages/Alunos';
import Guardians from '@/pages/Guardians';
import Employees from '@/pages/Employees';
import Enrollments from '@/pages/Enrollments';
import Turmas from '@/pages/Turmas';
import Calendar from '@/pages/Calendar';
import Finance from '@/pages/Finance';
import PaymentPlans from '@/pages/PaymentPlans';
import Invoices from '@/pages/Invoices';
import Delinquency from '@/pages/Delinquency';
import Messages from '@/pages/Messages';
import Notifications from '@/pages/Notifications';
import Grades from '@/pages/Grades';
import Attendance from '@/pages/Attendance';
import ReportCards from '@/pages/ReportCards';
import Documents from '@/pages/Documents';
import DocumentRequests from '@/pages/DocumentRequests';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';

// Portal pages
import PortalDashboard from '@/pages/portal/PortalDashboard';
import PortalGrades from '@/pages/portal/PortalGrades';
import PortalAttendance from '@/pages/portal/PortalAttendance';
import PortalFinance from '@/pages/portal/PortalFinance';
import PortalDocuments from '@/pages/portal/PortalDocuments';
import PortalAnnouncements from '@/pages/portal/PortalAnnouncements';
import PortalCalendar from '@/pages/portal/PortalCalendar';
import PortalProfile from '@/pages/portal/PortalProfile';

const AuthenticatedApp = () => {
  const { isLoadingAuth, authError } = useAuth();
  const navigate = useNavigate();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-muted border-t-primary rounded-full animate-spin" />
          <div className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Carregando</div>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') {
      navigate('/login');
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Admin */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/responsaveis" element={<Guardians />} />
        <Route path="/colaboradores" element={<Employees />} />
        <Route path="/matriculas" element={<Enrollments />} />
        <Route path="/turmas" element={<Turmas />} />
        <Route path="/calendario" element={<Calendar />} />
        <Route path="/financeiro" element={<Finance />} />
        <Route path="/planos-pagamento" element={<PaymentPlans />} />
        <Route path="/boletos" element={<Invoices />} />
        <Route path="/inadimplencia" element={<Delinquency />} />
        <Route path="/mensagens" element={<Messages />} />
        <Route path="/notificacoes" element={<Notifications />} />
        <Route path="/notas" element={<Grades />} />
        <Route path="/frequencia" element={<Attendance />} />
        <Route path="/boletins" element={<ReportCards />} />
        <Route path="/documentos" element={<Documents />} />
        <Route path="/secretaria/documentos" element={<DocumentRequests />} />
        <Route path="/relatorios" element={<Reports />} />
        <Route path="/configuracoes" element={<Settings />} />

        {/* Portal */}
        <Route path="/portal" element={<PortalDashboard />} />
        <Route path="/portal/notas" element={<PortalGrades />} />
        <Route path="/portal/frequencia" element={<PortalAttendance />} />
        <Route path="/portal/financeiro" element={<PortalFinance />} />
        <Route path="/portal/documentos" element={<PortalDocuments />} />
        <Route path="/portal/comunicados" element={<PortalAnnouncements />} />
        <Route path="/portal/calendario" element={<PortalCalendar />} />
        <Route path="/portal/perfil" element={<PortalProfile />} />
      </Route>

      <Route path="/login" element={<div>Tela de login aqui</div>} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <RoleProvider>
          <SelectedStudentProvider>
            <Router>
              <AuthenticatedApp />
            </Router>
          </SelectedStudentProvider>

          <Toaster />
          <SonnerToaster position="top-right" richColors closeButton />
        </RoleProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
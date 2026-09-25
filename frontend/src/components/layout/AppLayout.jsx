import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import { useRole } from '@/lib/RoleContext';
import { cn } from '@/lib/utils';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isPortalUser } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  // Fecha menu mobile ao navegar
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Redireciona portal users que estão fora do portal
  useEffect(() => {
    if (isPortalUser && !window.location.pathname.startsWith('/portal')) {
      navigate('/portal');
    }
  }, [isPortalUser, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile/tablet, fixed on desktop */}
      <div className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0'
      )}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Main content — no left padding on mobile */}
      <div className={cn('transition-all duration-300', collapsed ? 'lg:pl-20' : 'lg:pl-72')}>
        <Topbar onToggleSidebar={() => setMobileOpen(!mobileOpen)} />
        <main className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav for mobile/tablet */}
      <BottomNav onMenuOpen={() => setMobileOpen(true)} />
    </div>
  );
}
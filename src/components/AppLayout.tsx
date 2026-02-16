import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, Home, ChevronRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_USERS } from '@/data/mockData';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
}

const isStaffRole = (role?: string) => role === 'THERAPIST' || role === 'INTERN';

const AppLayout: React.FC<AppLayoutProps> = ({ children, title, breadcrumbs }) => {
  const { user, logout, switchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const homePath = isStaffRole(user?.role) ? '/practice/my-radar' : '/hub';

  const normalizedBreadcrumbs = React.useMemo(() => {
    const crumbs = breadcrumbs ?? [];
    if (!isStaffRole(user?.role)) return crumbs;
    return crumbs.map((c) => {
      if (c.label === 'Role Hub' || c.path === '/hub') {
        return { label: 'Group Practice', path: '/practice/my-radar' };
      }
      return c;
    });
  }, [breadcrumbs, user?.role]);

  return (
    <div className="min-h-screen pf-app-bg">
      {/* Top bar */}
      <header className="glass-panel border-b border-white/20 px-6 py-3 flex items-center justify-between card-shadow" style={{ borderRadius: 0 }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/hub')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PF</span>
            </div>
            <span className="font-semibold text-foreground text-lg hidden sm:inline">PracticeFlow</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 mr-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <select
              value={user?.id || ''}
              onChange={(e) => { switchUser(e.target.value); navigate('/hub'); }}
              className="text-sm bg-transparent border border-border rounded-md px-2 py-1 text-foreground"
            >
              {MOCK_USERS.map(u => (
                <option key={u.id} value={u.id}>{u.full_name} ({u.role})</option>
              ))}
            </select>
          </div>
          <span className="text-sm text-muted-foreground hidden md:inline">{user?.full_name}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{user?.role}</span>
          <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="px-6 py-2 flex items-center gap-1 text-sm text-muted-foreground bg-white/30 backdrop-blur-sm border-b border-white/20">
          <button type="button" onClick={() => navigate(homePath)} className="hover:text-primary transition-colors">
            <Home className="w-3.5 h-3.5" />
          </button>
          {normalizedBreadcrumbs.map((bc, i) => (
            <React.Fragment key={i}>
              <ChevronRight className="w-3.5 h-3.5" />
              {bc.path ? (
                <button onClick={() => navigate(bc.path!)} className="hover:text-primary transition-colors">{bc.label}</button>
              ) : (
                <span className="text-foreground font-medium">{bc.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Page title */}
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>

      {/* Content */}
      <main className="px-6 pb-8">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;

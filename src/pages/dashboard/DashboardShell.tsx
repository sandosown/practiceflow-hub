import React from 'react';
import { useSessionData } from '@/context/SessionContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/context/SessionContext';

interface DashboardShellProps {
  roleLabel: string;
}

const DashboardShell: React.FC<DashboardShellProps> = ({ roleLabel }) => {
  const session = useSessionData();
  const { logout } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SF</span>
          </div>
          <span className="font-semibold text-foreground text-lg">SympoFlo</span>
        </div>
        <div className="flex items-center gap-3">
          {session.full_name && (
            <span className="text-sm text-muted-foreground hidden md:inline">{session.full_name}</span>
          )}
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {session.role}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">
            {session.mode}
          </span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">{roleLabel} Dashboard</h1>

        <div className="space-y-3 text-sm text-muted-foreground mb-8">
          <p><strong className="text-foreground">Mode:</strong> {session.mode}</p>
          <p><strong className="text-foreground">Workspace:</strong> {session.workspace_name ?? 'None assigned'}</p>
          {session.clinician_subtype && (
            <p><strong className="text-foreground">Clinician Type:</strong> {session.clinician_subtype}</p>
          )}
          {session.intern_subtype && (
            <p><strong className="text-foreground">Intern Type:</strong> {session.intern_subtype}</p>
          )}
        </div>

        <div className="inline-block px-6 py-3 rounded-xl border border-border bg-muted text-muted-foreground">
          Dashboard coming in Phase 2
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;

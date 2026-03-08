import React from 'react';
import { useSessionData, useSession } from '@/context/SessionContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TopNavBar: React.FC = () => {
  const session = useSessionData();
  const { logout } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Only show workspace name when inside a workspace (not on opening dashboard)
  const isInsideWorkspace = location.pathname.includes('/group-practice') ||
    location.pathname.includes('/coaching') ||
    location.pathname.includes('/home-workspace');

  return (
    <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-card">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">SF</span>
        </div>
        <span className="font-semibold text-foreground text-lg">SympoFlo</span>
      </div>

      <span className="text-sm text-muted-foreground hidden md:inline">
        {isInsideWorkspace ? (session.workspace_name ?? '') : ''}
      </span>

      <div className="flex items-center gap-3">
        {session.full_name && (
          <span className="text-sm text-muted-foreground hidden md:inline">{session.full_name}</span>
        )}
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground gap-1.5">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Log out</span>
        </Button>
      </div>
    </header>
  );
};

export default TopNavBar;

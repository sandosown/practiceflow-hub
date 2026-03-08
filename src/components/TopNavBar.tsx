import React from 'react';
import { useSessionData, useSession } from '@/context/SessionContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TopNavBar: React.FC = () => {
  const session = useSessionData();
  const { logout } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-card">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">SF</span>
        </div>
        <span className="font-semibold text-foreground text-lg">SympoFlo</span>
      </div>

      <span className="text-sm text-muted-foreground hidden md:inline">
        {session.workspace_name ?? 'No workspace'}
      </span>

      <div className="flex items-center gap-3">
        {session.full_name && (
          <span className="text-sm text-muted-foreground hidden md:inline">{session.full_name}</span>
        )}
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
          {session.role}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
          {session.mode}
        </span>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};

export default TopNavBar;

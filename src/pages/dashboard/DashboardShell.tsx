import React from 'react';
import { useSessionData } from '@/context/SessionContext';
import TopNavBar from '@/components/TopNavBar';

interface DashboardShellProps {
  roleLabel: string;
}

const DashboardShell: React.FC<DashboardShellProps> = ({ roleLabel }) => {
  const session = useSessionData();

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">{roleLabel} Dashboard</h1>

        <div className="space-y-3 text-sm text-muted-foreground mb-8">
          <p><strong className="text-foreground">Workspace:</strong> {session.workspace_name ?? 'None assigned'}</p>
        </div>

        <div className="sf-card inline-block px-6 py-3">
          <p className="text-muted-foreground">Dashboard content coming soon</p>
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;

import React from 'react';
import { useSessionData } from '@/context/SessionContext';
import TopNavBar from '@/components/TopNavBar';
import { cardStyle } from '@/lib/cardStyle';

interface DashboardShellProps {
  roleLabel: string;
}

const DashboardShell: React.FC<DashboardShellProps> = ({ roleLabel }) => {
  const session = useSessionData();

  return (
    <div className="min-h-screen" style={{ background: '#0a1628' }}>
      <TopNavBar />

      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#f1f5f9' }}>{roleLabel} Dashboard</h1>

        <div className="space-y-3 text-sm mb-8" style={{ color: '#94a3b8' }}>
          <p><strong style={{ color: '#f1f5f9' }}>Workspace:</strong> {session.workspace_name ?? 'None assigned'}</p>
        </div>

        <div className="inline-block px-6 py-3" style={cardStyle('#2dd4bf')}>
          <p style={{ color: '#64748b' }}>Dashboard coming in Phase 5</p>
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;

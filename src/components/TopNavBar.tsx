import React from 'react';
import { useSessionData, useSession } from '@/context/SessionContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const TopNavBar: React.FC = () => {
  const session = useSessionData();
  const { logout } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isInsideWorkspace = location.pathname.includes('/group-practice') ||
    location.pathname.includes('/coaching') ||
    location.pathname.includes('/home-workspace');

  return (
    <header
      className="px-6 py-3 flex items-center justify-between"
      style={{
        background: '#0a1628',
        borderBottom: '1px solid rgba(45, 212, 191, 0.15)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: 'hsl(170 60% 50%)',
            boxShadow: '0 0 12px rgba(45, 212, 191, 0.4)',
          }}
        >
          <span className="font-bold text-sm" style={{ color: '#0a1628' }}>SF</span>
        </div>
        <span className="font-semibold text-lg" style={{ color: '#f1f5f9' }}>SympoFlo</span>
      </div>

      <span className="text-sm hidden md:inline" style={{ color: '#94a3b8' }}>
        {isInsideWorkspace ? (session.workspace_name ?? '') : ''}
      </span>

      <div className="flex items-center gap-3">
        {session.full_name && (
          <span className="text-sm hidden md:inline" style={{ color: '#94a3b8' }}>{session.full_name}</span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: '#64748b' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
          onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </header>
  );
};

export default TopNavBar;

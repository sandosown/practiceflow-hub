import React from 'react';
import { useSessionData, useSession } from '@/context/SessionContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import SympoFloIcon from '@/components/SympoFloIcon';

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <SympoFloIcon size={32} glow={true} />
        <span style={{
          fontFamily: 'Georgia, serif',
          fontSize: '18px',
          color: '#FFFFFF',
          fontWeight: 'normal',
          letterSpacing: '0.01em',
        }}>SympoFlo</span>
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

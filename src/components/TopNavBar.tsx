import React, { useState, useRef, useEffect } from 'react';
import { useSessionData, useSession } from '@/context/SessionContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import SympoFloIcon from '@/components/SympoFloIcon';

const TopNavBar: React.FC = () => {
  const session = useSessionData();
  const { logout } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const isInsideWorkspace = location.pathname.includes('/group-practice') ||
    location.pathname.includes('/coaching') ||
    location.pathname.includes('/home-workspace');

  const menuItems = [
    { label: 'Profile', action: () => { setDropdownOpen(false); navigate('/profile'); } },
    { label: 'Settings', action: () => { setDropdownOpen(false); navigate('/settings'); } },
    { label: 'Log out', action: handleLogout },
  ];

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

      <div className="flex items-center" ref={dropdownRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setDropdownOpen(prev => !prev)}
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: '#94a3b8', cursor: 'pointer', background: 'none', border: 'none', padding: '4px 8px', borderRadius: 8, transition: 'background 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {isMobile ? (
            <Menu size={24} color="#e2eaf4" />
          ) : (
            <>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#2dd4bf',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f172a',
                fontWeight: 600,
                fontSize: 12,
                flexShrink: 0,
              }}>
                {(session.full_name ?? '?').split(' ').map(w => w.charAt(0)).join('').slice(0, 2)}
              </div>
              {session.full_name && (
                <span>{session.full_name}</span>
              )}
              <ChevronDown size={12} color="rgba(255,255,255,0.6)" />
            </>
          )}
        </button>
        </button>

        {dropdownOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 180,
            background: '#1a2a4a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            zIndex: 100,
            overflow: 'hidden',
          }}>
            {menuItems.map((item, i) => (
              <React.Fragment key={item.label}>
                {i > 0 && <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />}
                <button
                  onClick={item.action}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 16px',
                    fontSize: 14,
                    fontWeight: 400,
                    color: '#e2eaf4',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {item.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNavBar;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DEMO_USERS } from '@/data/demoUsers';
import { getDashboardRoute } from '@/lib/routing';
import type { SessionContext } from '@/types/session';
import { cardStyle, cardHoverStyle } from '@/lib/cardStyle';
import SympoFloIcon from '@/components/SympoFloIcon';

const DEV_DEMO_MODE = true;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginDemo } = useSession();
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleDemoLogin = (userId: string) => {
    const demo = DEMO_USERS.find(u => u.id === userId);
    if (!demo) return;
    loginDemo(userId);
    const synth: SessionContext = {
      user_id: demo.id,
      practice_id: demo.practice_id,
      role: demo.role,
      clinician_subtype: demo.clinician_subtype,
      intern_subtype: demo.intern_subtype,
      mode: 'CONTROL',
      visibility_scope: [],
      workflow_scope: [],
      onboarding_complete: demo.onboarding_complete,
      workspace_name: demo.workspace_name,
      full_name: demo.full_name,
      email: demo.email,
    };
    navigate(getDashboardRoute(synth));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: loginError } = await login(email, password);
    if (loginError) {
      setError(loginError);
    }
    setLoading(false);
  };

  const roleLabel = (u: typeof DEMO_USERS[0]) => {
    let r = u.role as string;
    if (u.intern_subtype) r += ` (${u.intern_subtype})`;
    if (u.clinician_subtype) r += ` (${u.clinician_subtype})`;
    return r;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#f1f4f8' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SympoFloIcon size={64} glow={true} />
          </div>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: '28px',
            color: '#1a2a5e',
            marginTop: '12px',
            fontWeight: 'normal',
          }}>SympoFlo</div>
          <div style={{
            fontSize: '13px',
            color: '#94a3b8',
            marginTop: '4px',
          }}>Your Life-Role Operating System</div>
        </div>

        {/* Demo Mode */}
        {DEV_DEMO_MODE && (
          <div
            className="rounded-xl p-6 mb-4"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
            }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: '#94a3b8' }}>
              Dev Demo Login
            </h2>
            <div className="space-y-2">
              {DEMO_USERS.map(u => {
                const isHovered = hoveredId === u.id;
                return (
                  <button
                    key={u.id}
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg transition-all"
                    style={{
                      background: isHovered ? '#f1f5f9' : '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                    onClick={() => handleDemoLogin(u.id)}
                    onMouseEnter={() => setHoveredId(u.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <span className="text-sm font-medium" style={{ color: '#1a2a5e' }}>{u.full_name}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: '#e0fdf4', color: '#0f766e' }}
                    >
                      {roleLabel(u)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Login Form */}
        <div
          className="rounded-xl p-8"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          }}
        >
          <h2 className="text-xl font-semibold mb-6" style={{ color: '#1a2a5e' }}>Sign in to your account</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" style={{ color: '#94a3b8' }}>Email</Label>
              <Input
                id="email" type="email" value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
                className="mt-1"
                style={{ background: '#ffffff', borderColor: '#e2e8f0', color: '#1a2a5e' }}
              />
            </div>
            <div>
              <Label htmlFor="password" style={{ color: '#94a3b8' }}>Password</Label>
              <Input
                id="password" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                style={{ background: '#ffffff', borderColor: '#e2e8f0', color: '#1a2a5e' }}
              />
            </div>
            {error && <p className="text-sm" style={{ color: '#f59e0b' }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all"
              style={{ background: '#2dd4bf', color: '#0f172a' }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
            <div className="flex items-center justify-between text-sm mt-2">
              <a href="/password-reset" style={{ color: '#2dd4bf' }} className="hover:underline">Forgot password?</a>
              <a href="/register" style={{ color: '#2dd4bf' }} className="hover:underline">Create account</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

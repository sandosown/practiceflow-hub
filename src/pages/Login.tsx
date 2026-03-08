import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DEMO_USERS } from '@/data/demoUsers';
import { getDashboardRoute } from '@/lib/routing';
import type { SessionContext } from '@/types/session';
import { cardStyle, cardHoverStyle } from '@/lib/cardStyle';

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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a1628' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'hsl(170 60% 50%)',
              boxShadow: '0 0 20px rgba(45, 212, 191, 0.5)',
            }}
          >
            <span className="font-bold text-2xl" style={{ color: '#0a1628' }}>SF</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#f1f5f9' }}>SympoFlo</h1>
          <p className="mt-2" style={{ color: '#64748b' }}>Your Multi-Workspace Operating System</p>
        </div>

        {/* Demo Mode */}
        {DEV_DEMO_MODE && (
          <div
            className="rounded-xl p-6 mb-4"
            style={{
              background: '#1a2a4a',
              border: '1px solid rgba(45, 212, 191, 0.2)',
            }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: '#64748b' }}>
              Dev Demo Login
            </h2>
            <div className="space-y-2">
              {DEMO_USERS.map(u => {
                const isHovered = hoveredId === u.id;
                return (
                  <button
                    key={u.id}
                    className="w-full text-left flex items-center justify-between p-3"
                    style={isHovered ? cardHoverStyle('#2dd4bf') : cardStyle('#2dd4bf')}
                    onClick={() => handleDemoLogin(u.id)}
                    onMouseEnter={() => setHoveredId(u.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <span className="text-sm font-medium" style={{ color: '#f1f5f9' }}>{u.full_name}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(45,212,191,0.15)', color: '#2dd4bf' }}
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
            background: '#1a2a4a',
            border: '1px solid rgba(45, 212, 191, 0.3)',
            boxShadow: '0 0 32px rgba(45, 212, 191, 0.1)',
          }}
        >
          <h2 className="text-xl font-semibold mb-6" style={{ color: '#f1f5f9' }}>Sign in to your account</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" style={{ color: '#94a3b8' }}>Email</Label>
              <Input
                id="email" type="email" value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
                className="mt-1"
                style={{ background: '#0f1e38', borderColor: 'rgba(45,212,191,0.2)', color: '#f1f5f9' }}
              />
            </div>
            <div>
              <Label htmlFor="password" style={{ color: '#94a3b8' }}>Password</Label>
              <Input
                id="password" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                style={{ background: '#0f1e38', borderColor: 'rgba(45,212,191,0.2)', color: '#f1f5f9' }}
              />
            </div>
            {error && <p className="text-sm" style={{ color: '#f59e0b' }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all"
              style={{ background: '#2dd4bf', color: '#0a1628' }}
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

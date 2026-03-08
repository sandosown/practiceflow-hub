import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DEMO_USERS } from '@/data/demoUsers';
import { getDashboardRoute } from '@/lib/routing';
import type { SessionContext } from '@/types/session';

const DEV_DEMO_MODE = true;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginDemo } = useSession();
  const navigate = useNavigate();

  const handleDemoLogin = (userId: string) => {
    const demo = DEMO_USERS.find(u => u.id === userId);
    if (!demo) return;
    loginDemo(userId);
    // Build a synthetic session to compute route
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
    // On success, onAuthStateChange in SessionContext will resolve session
    // and App.tsx will redirect via route guards
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">SF</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">SympoFlo</h1>
          <p className="text-muted-foreground mt-2">Your Multi-Workspace Operating System</p>
        </div>

        {/* Demo Mode */}
        {DEV_DEMO_MODE && (
          <div className="rounded-xl border border-border bg-card p-6 mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Dev Demo Login
            </h2>
            <div className="space-y-2">
              {DEMO_USERS.map(u => (
                <Button key={u.id} variant="outline" className="w-full justify-between"
                  onClick={() => handleDemoLogin(u.id)}>
                  <span>{u.full_name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {u.role}{u.intern_subtype ? ` (${u.intern_subtype})` : ''}{u.clinician_subtype ? ` (${u.clinician_subtype})` : ''}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="rounded-xl border border-border bg-card p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Sign in to your account</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" className="mt-1" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
            <div className="flex items-center justify-between text-sm mt-2">
              <a href="/password-reset" className="text-primary hover:underline">Forgot password?</a>
              <a href="/register" className="text-primary hover:underline">Create account</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

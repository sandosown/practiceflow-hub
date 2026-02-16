import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate('/hub');
    } else {
      setError('Invalid credentials. Try: sarah@practiceflow.io, james@practiceflow.io, or priya@practiceflow.io');
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">PF</span>
          </div>
          <h1 className="text-3xl font-bold text-card">PracticeFlow</h1>
          <p className="text-card/60 mt-2">Your Life-Role Operating System</p>
        </div>

        {/* Login card */}
        <div className="bg-card rounded-xl card-shadow-md p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@practiceflow.io"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">Sign In</Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Demo accounts (any password):</p>
            <div className="space-y-1">
              {[
                { email: 'sarah@practiceflow.io', role: 'Owner' },
                { email: 'james@practiceflow.io', role: 'Therapist' },
                { email: 'priya@practiceflow.io', role: 'Intern' },
              ].map(d => (
                <button
                  key={d.email}
                  onClick={() => { setEmail(d.email); setPassword('demo'); }}
                  className="block w-full text-left text-sm px-3 py-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                >
                  {d.email} <span className="text-xs text-primary">({d.role})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

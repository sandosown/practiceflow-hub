import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      options: { emailRedirectTo: window.location.origin },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      toast({ title: 'Check your email', description: 'We sent you a confirmation link.' });
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">SF</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join SympoFlo</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8">
          <form onSubmit={handleSignup} className="space-y-4">
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
                placeholder="Min 6 characters" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••" className="mt-1" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating…' : 'Sign Up'}
            </Button>
          </form>
          <button onClick={() => navigate('/login')}
            className="block w-full text-center text-sm text-primary hover:underline mt-4">
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ACCENT = '#2dd4bf';

const AcceptInvitation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get('token');

  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setInvalid(true);
      setLoading(false);
      return;
    }

    const fetchInvitation = async () => {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      if (error || !data) {
        setInvalid(true);
        setLoading(false);
        return;
      }

      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        setInvalid(true);
        setLoading(false);
        return;
      }

      // Check status
      if (data.status !== 'PENDING') {
        setInvalid(true);
        setLoading(false);
        return;
      }

      setInvitation(data);
      setLoading(false);
    };

    fetchInvitation();
  }, [token]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({ title: 'Password must be at least 8 characters', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    setSubmitting(true);

    try {
      // Create the user account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: invitation.email,
        password,
        options: {
          data: {
            full_name: `${invitation.first_name} ${invitation.last_name}`,
          },
        },
      });

      if (signUpError) {
        toast({ title: signUpError.message, variant: 'destructive' });
        setSubmitting(false);
        return;
      }

      if (!signUpData.user) {
        toast({ title: 'Failed to create account', variant: 'destructive' });
        setSubmitting(false);
        return;
      }

      // Update the profile with the role from the invitation
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: invitation.role,
          full_name: `${invitation.first_name} ${invitation.last_name}`,
          clinician_subtype: invitation.clinician_subtype,
          intern_subtype: invitation.intern_subtype,
        })
        .eq('user_id', signUpData.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      // Mark invitation as accepted using edge function or direct update
      // Use service role via edge function for this, but for now update directly
      // The RLS policy allows authenticated users to update
      const { error: invUpdateError } = await supabase
        .from('invitations')
        .update({
          status: 'ACCEPTED',
          accepted_at: new Date().toISOString(),
        })
        .eq('invitation_id', invitation.invitation_id);

      if (invUpdateError) {
        console.error('Invitation update error:', invUpdateError);
      }

      toast({ title: 'Account created! Redirecting to your dashboard...' });

      // The auth state change will redirect them via SessionContext
      // Small delay to let the profile update propagate
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error(err);
      toast({ title: 'An error occurred', variant: 'destructive' });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Loading invitation…</p>
      </div>
    );
  }

  if (invalid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center space-y-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto" style={{ background: ACCENT }}>
            <span className="text-lg font-bold" style={{ color: 'hsl(226, 57%, 23%)' }}>SF</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Invitation No Longer Valid</h1>
          <p className="text-sm text-muted-foreground">
            This invitation is no longer valid. Please contact your practice administrator.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold px-4 py-2 rounded-md"
            style={{ color: ACCENT, border: `1px solid ${ACCENT}`, background: 'transparent' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto" style={{ background: ACCENT }}>
            <span className="text-lg font-bold" style={{ color: 'hsl(226, 57%, 23%)' }}>SF</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">
            You've been invited to join SympoFlo
          </h1>
          <p className="text-sm text-muted-foreground">
            Set up your account to get started.
          </p>
        </div>

        <form onSubmit={handleAccept} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">First Name</Label>
              <Input value={invitation.first_name} disabled className="mt-1 bg-muted/30" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Last Name</Label>
              <Input value={invitation.last_name} disabled className="mt-1 bg-muted/30" />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input value={invitation.email} disabled className="mt-1 bg-muted/30" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Role</Label>
            <Input
              value={
                invitation.role +
                (invitation.clinician_subtype ? ` — ${invitation.clinician_subtype}` : '') +
                (invitation.intern_subtype ? ` — ${invitation.intern_subtype}` : '')
              }
              disabled
              className="mt-1 bg-muted/30"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Create Password</Label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              className="mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-sm font-semibold px-4 py-2.5 rounded-md transition-opacity"
            style={{
              color: ACCENT,
              border: `1px solid ${ACCENT}`,
              background: 'transparent',
              opacity: submitting ? 0.5 : 1,
            }}
          >
            {submitting ? 'Creating Account…' : 'Accept Invitation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AcceptInvitation;

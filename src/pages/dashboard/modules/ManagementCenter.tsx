import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cardStyle } from '@/lib/cardStyle';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext';
import { useToast } from '@/hooks/use-toast';

const ACCENT = '#7c3aed';
const TEAL = '#2dd4bf';

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

function outlineBtn(accent: string): React.CSSProperties {
  return { background: 'transparent', color: accent, border: `1px solid rgba(${hexToRgb(accent)},0.5)` };
}

const SUMMARY = [
  { label: 'Total Staff', value: '6' },
  { label: 'Active Clients', value: '5' },
  { label: 'Open Referrals', value: '2' },
  { label: 'Pending Actions', value: '4' },
];

const STAFF = [
  { name: 'Dr. Sarah Mitchell', role: 'OWNER' },
  { name: 'Marcus Chen', role: 'ADMIN' },
  { name: 'Dr. Angela Torres', role: 'SUPERVISOR' },
  { name: 'James Rivera LCSW', role: 'CLINICIAN' },
  { name: 'Priya Patel', role: 'INTERN CLINICAL' },
  { name: 'Alex Nguyen', role: 'INTERN BUSINESS' },
  { name: 'Taylor Brooks', role: 'STAFF' },
];

const ACTIVITY = [
  { title: 'New hire added', detail: 'Alex Nguyen — Business Intern', time: '2 days ago' },
  { title: 'Referral received', detail: 'Austin Health — Awaiting assignment', time: '2 days ago' },
  { title: 'Transfer request submitted', detail: 'Robert Chen — Pending approval', time: '3 days ago' },
  { title: 'Credential alert', detail: 'James Rivera LCSW — License expiring in 14 days', time: '1 day ago' },
];

const ROLE_OPTIONS = [
  { value: 'PARTNER', label: 'Partner' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'CLINICIAN', label: 'Clinician' },
  { value: 'INTERN', label: 'Intern' },
  { value: 'STAFF', label: 'Staff' },
];

interface Invitation {
  invitation_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  intern_subtype: string | null;
  clinician_subtype: string | null;
  status: string;
  token: string;
  created_at: string;
  expires_at: string;
  accepted_at: string | null;
}

const statusColor = (status: string): React.CSSProperties => {
  switch (status) {
    case 'PENDING': return { color: '#f59e0b', border: '1px solid #f59e0b' };
    case 'ACCEPTED': return { color: '#059669', border: '1px solid #059669' };
    case 'EXPIRED': return { color: 'hsl(var(--muted-foreground))', border: '1px solid hsl(var(--muted-foreground))' };
    case 'REVOKED': return { color: 'hsl(var(--muted-foreground))', border: '1px solid hsl(var(--muted-foreground))' };
    default: return {};
  }
};

const ManagementCenter: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const { toast } = useToast();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [internSubtype, setInternSubtype] = useState('');
  const [clinicianSubtype, setClinicianSubtype] = useState('');
  const [sending, setSending] = useState(false);

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);

  const callerRole = session?.role;

  // Filter role options based on caller role
  const availableRoles = callerRole === 'OWNER'
    ? ROLE_OPTIONS
    : ROLE_OPTIONS.filter(r => r.value !== 'PARTNER' && r.value !== 'OWNER');

  const fetchInvitations = useCallback(async () => {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Auto-mark expired ones on the client
      const now = new Date();
      const processed = (data as unknown as Invitation[]).map(inv => {
        if (inv.status === 'PENDING' && new Date(inv.expires_at) < now) {
          return { ...inv, status: 'EXPIRED' };
        }
        return inv;
      });
      setInvitations(processed);
    }
    setLoadingInvitations(false);
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setRole('');
    setInternSubtype('');
    setClinicianSubtype('');
  };

  const handleSendInvitation = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !role) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    if (role === 'INTERN' && !internSubtype) {
      toast({ title: 'Please select an intern subtype', variant: 'destructive' });
      return;
    }
    if (role === 'CLINICIAN' && !clinicianSubtype) {
      toast({ title: 'Please select a clinician subtype', variant: 'destructive' });
      return;
    }

    setSending(true);

    const { data, error } = await supabase.functions.invoke('send-invitation', {
      body: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        role,
        intern_subtype: role === 'INTERN' ? internSubtype : null,
        clinician_subtype: role === 'CLINICIAN' ? clinicianSubtype : null,
        hat_id: 'w1',
      },
    });

    setSending(false);

    if (error) {
      toast({ title: error.message || 'Failed to send invitation', variant: 'destructive' });
      return;
    }

    if (data?.error) {
      toast({ title: data.error, variant: 'destructive' });
      return;
    }

    toast({ title: `Invitation sent to ${email.trim().toLowerCase()}` });
    resetForm();
    setInviteOpen(false);
    fetchInvitations();
  };

  const handleRevoke = async (invitationId: string) => {
    const { error } = await supabase
      .from('invitations')
      .update({
        status: 'REVOKED',
        revoked_at: new Date().toISOString(),
        revoked_by: session?.user_id ?? null,
      })
      .eq('invitation_id', invitationId);

    if (error) {
      toast({ title: 'Failed to revoke invitation', variant: 'destructive' });
      return;
    }

    toast({ title: 'Invitation revoked' });
    fetchInvitations();
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <div className="max-w-5xl mx-auto px-6 py-6 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground pl-3" style={{ borderLeft: `4px solid ${ACCENT}` }}>Management Center</h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {SUMMARY.map((s, i) => (
            <div key={i} className="p-4 rounded-xl" style={cardStyle(ACCENT)}>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Invite Team Member */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: `4px solid ${ACCENT}` }}>
            TEAM INVITATIONS
          </h2>

          <button
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-md mb-4"
            style={{ color: TEAL, border: `1px solid ${TEAL}`, background: 'transparent' }}
          >
            <Plus className="w-4 h-4" />
            Invite Team Member
          </button>

          {/* Pending Invitations List */}
          {loadingInvitations ? (
            <p className="text-sm text-muted-foreground">Loading invitations…</p>
          ) : invitations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invitations sent yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {invitations.map(inv => (
                <div key={inv.invitation_id} className="p-4 flex items-center justify-between gap-4" style={cardStyle(ACCENT)}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {inv.first_name} {inv.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{inv.email}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                        {inv.role}{inv.clinician_subtype ? ` — ${inv.clinician_subtype}` : ''}{inv.intern_subtype ? ` — ${inv.intern_subtype}` : ''}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Sent {formatDate(inv.created_at)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Expires {formatDate(inv.expires_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ ...statusColor(inv.status), background: 'transparent' }}
                    >
                      {inv.status}
                    </span>
                    {inv.status === 'PENDING' && (
                      <button
                        onClick={() => handleRevoke(inv.invitation_id)}
                        className="text-xs font-semibold px-3 py-1 rounded"
                        style={outlineBtn(ACCENT)}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Staff Overview */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: `4px solid ${ACCENT}` }}>
            STAFF OVERVIEW
          </h2>
          <div className="flex flex-col gap-3">
            {STAFF.map((s, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4" style={cardStyle(ACCENT)}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.role}</p>
                </div>
                <button className="text-xs font-semibold uppercase px-4 py-1.5 rounded shrink-0" style={outlineBtn(ACCENT)}>View Profile</button>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: `4px solid ${ACCENT}` }}>
            RECENT ACTIVITY
          </h2>
          <div className="flex flex-col gap-3">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="p-4" style={cardStyle(ACCENT)}>
                <p className="text-sm font-semibold text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{a.detail} · {a.time}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <BottomNavBar />

      {/* Invite Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">First Name *</Label>
                <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1" placeholder="First name" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Last Name *</Label>
                <Input value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1" placeholder="Last name" />
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Email *</Label>
              <Input value={email} onChange={e => setEmail(e.target.value)} className="mt-1" placeholder="email@example.com" type="email" />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Role *</Label>
              <Select value={role} onValueChange={v => { setRole(v); setInternSubtype(''); setClinicianSubtype(''); }}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {role === 'CLINICIAN' && (
              <div>
                <Label className="text-xs text-muted-foreground">Clinician Subtype *</Label>
                <Select value={clinicianSubtype} onValueChange={setClinicianSubtype}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select subtype" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LICENSED">Licensed</SelectItem>
                    <SelectItem value="LP">Limited Permit (LP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {role === 'INTERN' && (
              <div>
                <Label className="text-xs text-muted-foreground">Intern Subtype *</Label>
                <Select value={internSubtype} onValueChange={setInternSubtype}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select subtype" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLINICAL">Clinical</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSendInvitation}
                disabled={sending}
                className="text-sm font-semibold px-4 py-2 rounded-md transition-opacity"
                style={{ color: TEAL, border: `1px solid ${TEAL}`, background: 'transparent', opacity: sending ? 0.5 : 1 }}
              >
                {sending ? 'Sending…' : 'Send Invitation'}
              </button>
              <button
                onClick={() => { resetForm(); setInviteOpen(false); }}
                className="text-sm text-muted-foreground px-4 py-2 rounded-md hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagementCenter;

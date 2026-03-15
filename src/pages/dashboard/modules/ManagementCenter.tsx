import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cardStyle } from '@/lib/cardStyle';
import { supabase } from '@/integrations/supabase/client';
import { useSession, useSessionData } from '@/context/SessionContext';
import { useToast } from '@/hooks/use-toast';
import InviteTeamMemberModal from '@/components/InviteTeamMemberModal';
import RemoveStaffModal from '@/components/RemoveStaffModal';
import { DEMO_USERS } from '@/data/demoUsers';

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

interface StaffEntry {
  name: string;
  firstName: string;
  role: string;
  id: string;
  status: 'active' | 'inactive';
}

const INITIAL_STAFF: StaffEntry[] = [
  { id: 'demo-owner', name: 'Dr. Sarah Mitchell', firstName: 'Sarah', role: 'OWNER', status: 'active' },
  { id: 'demo-admin', name: 'Marcus Chen', firstName: 'Marcus', role: 'ADMIN', status: 'active' },
  { id: 'demo-supervisor', name: 'Dr. Angela Torres', firstName: 'Angela', role: 'SUPERVISOR', status: 'active' },
  { id: 'demo-clinician', name: 'James Rivera LCSW', firstName: 'James', role: 'CLINICIAN', status: 'active' },
  { id: 'demo-intern-clinical', name: 'Priya Patel', firstName: 'Priya', role: 'INTERN CLINICAL', status: 'active' },
  { id: 'demo-intern-business', name: 'Alex Nguyen', firstName: 'Alex', role: 'INTERN BUSINESS', status: 'active' },
  { id: 'demo-staff', name: 'Taylor Brooks', firstName: 'Taylor', role: 'STAFF', status: 'active' },
];

const ACTIVITY = [
  { title: 'New hire added', detail: 'Alex Nguyen — Business Intern', time: '2 days ago' },
  { title: 'Referral received', detail: 'Austin Health — Awaiting assignment', time: '2 days ago' },
  { title: 'Transfer request submitted', detail: 'Robert Chen — Pending approval', time: '3 days ago' },
  { title: 'Credential alert', detail: 'James Rivera LCSW — License expiring in 14 days', time: '1 day ago' },
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

/** Access rules for removal */
function canRemove(actorRole: string, targetRole: string, actorId: string, targetId: string): boolean {
  // Cannot remove self
  if (actorId === targetId) return false;
  if (actorRole === 'OWNER') {
    return targetRole !== 'OWNER';
  }
  if (actorRole === 'ADMIN') {
    const allowed = ['CLINICIAN', 'INTERN CLINICAL', 'INTERN BUSINESS', 'INTERN', 'STAFF'];
    return allowed.includes(targetRole);
  }
  return false;
}

/** Mock blocking check for demo — in production this queries real data */
function checkBlocksForStaff(staff: { name: string; role: string }): { label: string; detail: string }[] {
  // For demo: James Rivera has active clients
  if (staff.name.includes('James Rivera')) {
    return [
      { label: 'Active client assignments', detail: '3 clients currently assigned' },
    ];
  }
  return [];
}

const ManagementCenter: React.FC = () => {
  const navigate = useNavigate();
  const { session, isDemoMode } = useSession();
  const sessionData = useSessionData();
  const { toast } = useToast();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);

  // Staff list with status tracking
  const [staffList, setStaffList] = useState<StaffEntry[]>(INITIAL_STAFF);
  const [showFormerStaff, setShowFormerStaff] = useState(false);

  // Staff profile view
  const [viewingStaff, setViewingStaff] = useState<StaffEntry | null>(null);

  // Removal modal
  const [removeTarget, setRemoveTarget] = useState<StaffEntry | null>(null);
  const [removeOpen, setRemoveOpen] = useState(false);

  const currentRole = sessionData.role;
  const currentId = sessionData.user_id;

  const activeStaff = useMemo(() => staffList.filter(s => s.status === 'active'), [staffList]);
  const inactiveStaff = useMemo(() => staffList.filter(s => s.status === 'inactive'), [staffList]);
  const isOwner = currentRole === 'OWNER';

  const fetchInvitations = useCallback(async () => {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
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

  const handleConfirmRemoval = useCallback(async (staff: { name: string; firstName: string; role: string; id?: string }, endDate: Date) => {
    const staffId = staff.id;

    if (!isDemoMode && staffId) {
      // Persist to Supabase for real users
      await supabase
        .from('profiles')
        .update({
          status: 'inactive',
          removed_at: new Date().toISOString(),
          removed_by: session?.user_id ?? null,
          access_end_date: endDate.toISOString().split('T')[0],
        } as any)
        .eq('user_id', staffId);
    }

    // Update local state
    setStaffList(prev =>
      prev.map(s => s.name === staff.name ? { ...s, status: 'inactive' as const } : s)
    );

    setRemoveOpen(false);
    setRemoveTarget(null);
    setViewingStaff(null);

    toast({ title: `${staff.name} has been removed from this practice.` });
  }, [isDemoMode, session?.user_id, toast]);

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Staff profile view
  if (viewingStaff) {
    const showRemoveBtn = canRemove(currentRole, viewingStaff.role, currentId, viewingStaff.id);
    return (
      <div className="min-h-screen bg-background">
        <TopNavBar />
        <div className="max-w-3xl mx-auto px-6 py-6 pb-20">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setViewingStaff(null)} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground pl-3" style={{ borderLeft: `4px solid ${ACCENT}` }}>
              {viewingStaff.name}
            </h1>
          </div>

          <div className="p-6 rounded-xl space-y-4" style={cardStyle(ACCENT)}>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Name</p>
              <p className="text-base font-semibold text-foreground">{viewingStaff.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Role</p>
              <p className="text-base text-foreground">{viewingStaff.role}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Status</p>
              <span
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  color: viewingStaff.status === 'active' ? '#059669' : 'hsl(var(--muted-foreground))',
                  border: `1px solid ${viewingStaff.status === 'active' ? '#059669' : 'hsl(var(--muted-foreground))'}`,
                  background: 'transparent',
                }}
              >
                {viewingStaff.status.toUpperCase()}
              </span>
            </div>
          </div>

          {showRemoveBtn && viewingStaff.status === 'active' && (
            <div className="mt-8">
              <button
                onClick={() => {
                  setRemoveTarget(viewingStaff);
                  setRemoveOpen(true);
                }}
                className="text-sm font-semibold px-5 py-2 rounded-md"
                style={{ color: TEAL, border: `1px solid ${TEAL}`, background: 'transparent' }}
              >
                Remove from Practice
              </button>
            </div>
          )}
        </div>
        <BottomNavBar />
        <RemoveStaffModal
          open={removeOpen}
          onOpenChange={setRemoveOpen}
          staff={removeTarget}
          checkBlocks={checkBlocksForStaff}
          onConfirmRemoval={handleConfirmRemoval}
        />
      </div>
    );
  }

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
            {activeStaff.map((s) => (
              <div key={s.id} className="p-4 flex items-center justify-between gap-4" style={cardStyle(ACCENT)}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.role}</p>
                </div>
                <button
                  onClick={() => setViewingStaff(s)}
                  className="text-xs font-semibold uppercase px-4 py-1.5 rounded shrink-0"
                  style={outlineBtn(ACCENT)}
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>

          {/* Former Staff toggle — Owner only */}
          {isOwner && inactiveStaff.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowFormerStaff(prev => !prev)}
                className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-md"
                style={{ color: 'hsl(var(--muted-foreground))', border: '1px solid hsl(var(--border))', background: 'transparent' }}
              >
                {showFormerStaff ? 'Hide' : 'Show'} Former Staff ({inactiveStaff.length})
              </button>

              {showFormerStaff && (
                <div className="flex flex-col gap-3 mt-3">
                  {inactiveStaff.map((s) => (
                    <div key={s.id} className="p-4 flex items-center justify-between gap-4 opacity-60" style={cardStyle(ACCENT)}>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{s.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-muted-foreground">{s.role}</p>
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ color: 'hsl(var(--muted-foreground))', border: '1px solid hsl(var(--muted-foreground))', background: 'transparent' }}
                          >
                            INACTIVE
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setViewingStaff(s)}
                        className="text-xs font-semibold uppercase px-4 py-1.5 rounded shrink-0"
                        style={outlineBtn(ACCENT)}
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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

      <InviteTeamMemberModal open={inviteOpen} onOpenChange={setInviteOpen} onInviteSent={fetchInvitations} />
      <RemoveStaffModal
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        staff={removeTarget}
        checkBlocks={checkBlocksForStaff}
        onConfirmRemoval={handleConfirmRemoval}
      />
    </div>
  );
};

export default ManagementCenter;

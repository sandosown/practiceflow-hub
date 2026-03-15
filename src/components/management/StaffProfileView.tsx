import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cardStyle } from '@/lib/cardStyle';
import StaffAvatar from './StaffAvatar';
import type { StaffEntry } from './types';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import RemoveStaffModal from '@/components/RemoveStaffModal';

const ACCENT = '#7c3aed';
const TEAL = '#2dd4bf';

function formatRoleLabel(staff: StaffEntry): string {
  if (staff.role === 'CLINICIAN' && staff.clinicianSubtype) {
    return `Clinician — ${staff.clinicianSubtype === 'LP' ? 'Limited Permit' : 'Licensed'}`;
  }
  if (staff.role === 'INTERN' || staff.role === 'INTERN CLINICAL' || staff.role === 'INTERN BUSINESS') {
    const sub = staff.internSubtype ?? (staff.role.includes('CLINICAL') ? 'CLINICAL' : staff.role.includes('BUSINESS') ? 'BUSINESS' : null);
    if (sub) return `Intern — ${sub === 'CLINICAL' ? 'Clinical' : 'Business'}`;
    return 'Intern';
  }
  const labels: Record<string, string> = {
    OWNER: 'Owner', PARTNER: 'Partner', ADMIN: 'Admin',
    SUPERVISOR: 'Supervisor', CLINICIAN: 'Clinician', STAFF: 'Staff',
  };
  return labels[staff.role] ?? staff.role;
}

function canRemove(actorRole: string, targetRole: string, actorId: string, targetId: string): boolean {
  if (actorId === targetId) return false;
  if (actorRole === 'OWNER') return targetRole !== 'OWNER';
  if (actorRole === 'ADMIN') {
    return ['CLINICIAN', 'INTERN CLINICAL', 'INTERN BUSINESS', 'INTERN', 'STAFF'].includes(targetRole);
  }
  return false;
}

function checkBlocksForStaff(staff: { name: string; role: string }): { label: string; detail: string }[] {
  if (staff.name.includes('James Rivera')) {
    return [{ label: 'Active client assignments', detail: '3 clients currently assigned' }];
  }
  return [];
}

interface StaffProfileViewProps {
  staff: StaffEntry;
  currentRole: string;
  currentId: string;
  onBack: () => void;
  onRemoved: (staff: { name: string; firstName: string; role: string; id?: string }, endDate: Date) => void;
}

const StaffProfileView: React.FC<StaffProfileViewProps> = ({
  staff, currentRole, currentId, onBack, onRemoved,
}) => {
  const navigate = useNavigate();
  const [removeOpen, setRemoveOpen] = React.useState(false);
  const showRemoveBtn = canRemove(currentRole, staff.role, currentId, staff.id);
  const isActive = staff.status === 'active';

  const isClinician = staff.role === 'CLINICIAN';
  const isSupOrClinOrIntern = ['CLINICIAN', 'SUPERVISOR', 'INTERN', 'INTERN CLINICAL', 'INTERN BUSINESS'].includes(staff.role);

  const hasCredentials = isClinician && (staff.licenseType || staff.caqhNumber || staff.npiNumber);
  const hasWorkload = isSupOrClinOrIntern && (staff.activeClients != null || staff.superviseeCount != null || staff.supervisorName);

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <div className="max-w-3xl mx-auto px-6 py-6 pb-20">
        {/* Back button */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground pl-3" style={{ borderLeft: `4px solid ${ACCENT}` }}>
            Staff Profile
          </h1>
        </div>

        {/* SECTION 1 — IDENTITY */}
        <div className="p-6 rounded-xl" style={cardStyle(ACCENT)}>
          <div className="flex items-center gap-4 mb-4">
            <StaffAvatar name={staff.name} size="lg" />
            <div>
              <p className="text-lg font-bold text-foreground">{staff.name}</p>
              <p className="text-sm text-muted-foreground">{formatRoleLabel(staff)}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    color: isActive ? TEAL : 'hsl(var(--muted-foreground))',
                    border: `1px solid ${isActive ? TEAL : 'hsl(var(--muted-foreground))'}`,
                    background: 'transparent',
                  }}
                >
                  {isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {staff.email && (
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Email</p>
                <p className="text-sm text-foreground">{staff.email}</p>
              </div>
            )}
            {staff.joinedAt && (
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Member Since</p>
                <p className="text-sm text-foreground">{staff.joinedAt}</p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2 — CREDENTIALS */}
        {hasCredentials && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3 pl-3 text-muted-foreground" style={{ borderLeft: `4px solid ${ACCENT}` }}>
              CREDENTIALS
            </h2>
            <div className="p-5 rounded-xl" style={cardStyle(ACCENT)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staff.licenseType && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">License Type</p>
                    <p className="text-sm text-foreground">{staff.licenseType}</p>
                  </div>
                )}
                {staff.licenseNumber && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">License Number</p>
                    <p className="text-sm text-foreground">{staff.licenseNumber}</p>
                  </div>
                )}
                {staff.licenseState && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">State</p>
                    <p className="text-sm text-foreground">{staff.licenseState}</p>
                  </div>
                )}
                {staff.licenseExpiry && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Expiry Date</p>
                    <p className="text-sm" style={{ color: staff.licenseDaysLeft != null && staff.licenseDaysLeft <= 30 ? '#f59e0b' : 'hsl(var(--foreground))' }}>
                      {staff.licenseExpiry}
                      {staff.licenseDaysLeft != null && staff.licenseDaysLeft <= 30 && (
                        <span className="ml-2 text-[10px] font-bold uppercase">⚠ Expires in {staff.licenseDaysLeft} days</span>
                      )}
                    </p>
                  </div>
                )}
                {staff.npiNumber && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">NPI #</p>
                    <p className="text-sm text-foreground">{staff.npiNumber}</p>
                  </div>
                )}
                {staff.caqhNumber && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">CAQH #</p>
                    <p className="text-sm text-foreground">{staff.caqhNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3 — WORKLOAD */}
        {hasWorkload && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3 pl-3 text-muted-foreground" style={{ borderLeft: `4px solid ${ACCENT}` }}>
              WORKLOAD
            </h2>
            <div className="p-5 rounded-xl" style={cardStyle(ACCENT)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staff.activeClients != null && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Active Clients</p>
                    <p className="text-sm text-foreground">{staff.activeClients}</p>
                  </div>
                )}
                {staff.superviseeCount != null && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Supervisees</p>
                    <p className="text-sm text-foreground">{staff.superviseeCount}</p>
                  </div>
                )}
                {staff.supervisorName && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Supervisor</p>
                    <p className="text-sm text-foreground">{staff.supervisorName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4 — ACCESS */}
        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3 pl-3 text-muted-foreground" style={{ borderLeft: `4px solid ${ACCENT}` }}>
            ACCESS
          </h2>
          <div className="p-5 rounded-xl" style={cardStyle(ACCENT)}>
            <button
              onClick={() => navigate('/dashboard/owner/group-practice/access-permissions', { state: { preselectedUserId: staff.id } })}
              className="text-sm font-semibold"
              style={{ color: TEAL }}
            >
              Manage Access →
            </button>
            {staff.grantedPermissions && staff.grantedPermissions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {staff.grantedPermissions.map((perm) => (
                  <span
                    key={perm}
                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ color: TEAL, border: `1px solid ${TEAL}`, background: 'transparent' }}
                  >
                    {perm}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 5 — DANGER ZONE */}
        {showRemoveBtn && isActive && (
          <>
            <Separator className="mt-8 mb-6" />
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-3 pl-3 text-muted-foreground" style={{ borderLeft: `4px solid ${ACCENT}` }}>
                DANGER ZONE
              </h2>
              <button
                onClick={() => setRemoveOpen(true)}
                className="text-sm font-semibold px-5 py-2 rounded-md"
                style={{ color: TEAL, border: `1px solid ${TEAL}`, background: 'transparent' }}
              >
                Remove from Practice
              </button>
              <p className="text-xs text-muted-foreground mt-2">
                Removing this person will revoke their access. Their records will be preserved.
              </p>
            </div>
          </>
        )}
      </div>
      <BottomNavBar />

      <RemoveStaffModal
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        staff={staff}
        checkBlocks={checkBlocksForStaff}
        onConfirmRemoval={onRemoved}
      />
    </div>
  );
};

export default StaffProfileView;

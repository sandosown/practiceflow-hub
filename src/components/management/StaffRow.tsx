import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cardStyle } from '@/lib/cardStyle';
import StaffAvatar from './StaffAvatar';
import type { StaffEntry, StaffContextInfo } from './types';

const ACCENT = '#7c3aed';
const TEAL = '#2dd4bf';

function outlineBtn(color: string): React.CSSProperties {
  return { background: 'transparent', color, border: `1px solid ${color}` };
}

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

interface StaffRowProps {
  staff: StaffEntry;
  contextInfo: StaffContextInfo;
  onViewProfile: (staff: StaffEntry) => void;
  onRemove?: (staff: StaffEntry) => void;
  showRemove?: boolean;
}

const StaffRow: React.FC<StaffRowProps> = ({ staff, contextInfo, onViewProfile }) => {
  const navigate = useNavigate();
  const isActive = staff.status === 'active';

  const handleManageAccess = () => {
    navigate('/dashboard/owner/group-practice/access-permissions', {
      state: { preselectedUserId: staff.id },
    });
  };

  return (
    <div
      className="p-4 flex items-center gap-4"
      style={cardStyle(ACCENT, { muted: !isActive })}
    >
      <StaffAvatar name={staff.name} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-foreground">{staff.name}</p>
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
        <p className="text-xs text-muted-foreground mt-0.5">{formatRoleLabel(staff)}</p>

        {/* Contextual info line */}
        {contextInfo.lines.length > 0 && (
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {contextInfo.lines.map((line, i) => (
              <span
                key={i}
                className="text-[11px]"
                style={{ color: line.warn ? '#f59e0b' : 'hsl(var(--muted-foreground))' }}
              >
                {line.text}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onViewProfile(staff)}
          className="text-xs font-semibold px-3 py-1.5 rounded"
          style={outlineBtn(TEAL)}
        >
          View Profile
        </button>
        <button
          onClick={handleManageAccess}
          className="text-xs font-semibold px-3 py-1.5 rounded hidden sm:inline-flex"
          style={outlineBtn(TEAL)}
        >
          Manage Access
        </button>
      </div>
    </div>
  );
};

export default StaffRow;

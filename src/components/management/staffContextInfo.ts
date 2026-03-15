import type { StaffEntry, StaffContextInfo } from './types';

export function getStaffContextInfo(staff: StaffEntry): StaffContextInfo {
  const lines: StaffContextInfo['lines'] = [];

  if (staff.role === 'CLINICIAN') {
    if (staff.activeClients != null) {
      lines.push({ text: `${staff.activeClients} active client${staff.activeClients !== 1 ? 's' : ''}` });
    }
    if (staff.licenseDaysLeft != null && staff.licenseDaysLeft <= 30) {
      lines.push({ text: `License expires in ${staff.licenseDaysLeft} day${staff.licenseDaysLeft !== 1 ? 's' : ''}`, warn: true });
    }
  } else if (staff.role === 'SUPERVISOR') {
    if (staff.superviseeCount != null) {
      lines.push({ text: `${staff.superviseeCount} supervisee${staff.superviseeCount !== 1 ? 's' : ''}` });
    }
  } else if (staff.role === 'INTERN' || staff.role === 'INTERN CLINICAL' || staff.role === 'INTERN BUSINESS') {
    const sub = staff.internSubtype ?? (staff.role.includes('CLINICAL') ? 'Clinical' : staff.role.includes('BUSINESS') ? 'Business' : null);
    if (sub) lines.push({ text: `${sub} track` });
    if (staff.supervisorName) lines.push({ text: `Supervised by ${staff.supervisorName}` });
  } else {
    // Admin, Staff, Partner, Owner
    if (staff.lastActive) lines.push({ text: `Last active ${staff.lastActive}` });
  }

  return { lines };
}

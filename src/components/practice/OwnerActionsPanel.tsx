import React, { useState } from 'react';
import { Referral, UserProfile, ReferralStatus } from '@/types/models';
import { User, Phone, CalendarCheck, ShieldAlert, StickyNote, Settings } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface OwnerActionsPanelProps {
  selectedItem: Referral | null;
  onUpdateItem: (updated: Referral) => void;
  staffList: UserProfile[];
  onOpenSettings: () => void;
}

const statusLabels: Record<string, string> = {
  NEW: 'New Referral',
  ACKNOWLEDGED: 'Acknowledged',
  CONTACT_IN_PROGRESS: 'Contact In Progress',
  APPT_SCHEDULED: 'Appointment Scheduled',
  INTAKE_BLOCKED: 'Intake Blocked',
  INTAKE_READY: 'Intake Ready',
};

const OwnerActionsPanel: React.FC<OwnerActionsPanelProps> = ({
  selectedItem,
  onUpdateItem,
  staffList,
  onOpenSettings,
}) => {
  const [assigneeId, setAssigneeId] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [note, setNote] = useState('');

  const assignee = selectedItem
    ? staffList.find(u => u.id === selectedItem.assigned_to_profile_id)
    : null;

  const handleAssign = () => {
    if (!selectedItem || !assigneeId) return;
    onUpdateItem({ ...selectedItem, assigned_to_profile_id: assigneeId });
    setAssigneeId('');
  };

  const handleStatusChange = (status: ReferralStatus) => {
    if (!selectedItem) return;
    onUpdateItem({ ...selectedItem, status });
  };

  if (!selectedItem) {
    return (
      <div className="pf-glass p-6 flex flex-col items-center justify-center gap-4 min-h-[300px]">
        <p className="text-muted-foreground text-sm italic">Select an item to take action</p>
        <button onClick={onOpenSettings} className="pf-btn pf-btn-slate flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Practice Settings
        </button>
      </div>
    );
  }

  return (
    <div className="pf-glass p-5 space-y-5">
      {/* Client Summary */}
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground text-lg">{selectedItem.client_name}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-3.5 h-3.5" />
          <span>{assignee ? assignee.full_name : 'Unassigned'}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Status: <span className="font-medium text-foreground">{statusLabels[selectedItem.status]}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Contact by: <span className="font-medium text-foreground">{selectedItem.contact_by}</span>
        </div>
      </div>

      <hr className="border-white/30" />

      {/* A) Assign / Reassign */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Assign / Reassign
        </label>
        <div className="flex gap-2">
          <select
            value={assigneeId}
            onChange={e => setAssigneeId(e.target.value)}
            className="flex-1 text-sm rounded-xl border border-white/40 bg-white/40 px-3 py-2 text-foreground backdrop-blur-sm"
          >
            <option value="">Select staff…</option>
            {staffList.map(s => (
              <option key={s.id} value={s.id}>{s.full_name}</option>
            ))}
          </select>
          <button onClick={handleAssign} disabled={!assigneeId} className="pf-btn pf-btn-teal disabled:opacity-40">
            Confirm
          </button>
        </div>
      </div>

      {/* B) Mark Contacted */}
      <button
        onClick={() => handleStatusChange('CONTACT_IN_PROGRESS')}
        className="pf-btn pf-btn-blue w-full flex items-center justify-center gap-2"
      >
        <Phone className="w-4 h-4" />
        Mark Contacted
      </button>

      {/* C) Schedule Appointment */}
      <button
        onClick={() => handleStatusChange('APPT_SCHEDULED')}
        className="pf-btn pf-btn-lavender w-full flex items-center justify-center gap-2"
      >
        <CalendarCheck className="w-4 h-4" />
        Schedule Appointment
      </button>

      {/* D) Mark Intake Blocked */}
      <div className="space-y-2">
        <button
          onClick={() => handleStatusChange('INTAKE_BLOCKED')}
          className="pf-btn pf-btn-slate w-full flex items-center justify-center gap-2"
        >
          <ShieldAlert className="w-4 h-4" />
          Mark Intake Blocked
        </button>
        <input
          value={blockReason}
          onChange={e => setBlockReason(e.target.value)}
          placeholder="Optional reason…"
          className="w-full text-sm rounded-xl border border-white/40 bg-white/40 px-3 py-2 text-foreground backdrop-blur-sm placeholder:text-muted-foreground"
        />
      </div>

      {/* E) Internal Note */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
          <StickyNote className="w-3.5 h-3.5" />
          Internal Note
        </label>
        <Textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add an owner-only note…"
          className="bg-white/40 border-white/40 backdrop-blur-sm rounded-xl text-sm min-h-[60px]"
        />
        <button onClick={() => setNote('')} className="pf-btn pf-btn-teal text-xs">
          Save Note
        </button>
      </div>

      <hr className="border-white/30" />

      <button onClick={onOpenSettings} className="pf-btn pf-btn-slate w-full flex items-center justify-center gap-2">
        <Settings className="w-4 h-4" />
        Practice Settings
      </button>
    </div>
  );
};

export default OwnerActionsPanel;

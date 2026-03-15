import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext';
import { useToast } from '@/hooks/use-toast';

const TEAL = '#2dd4bf';

const ROLE_OPTIONS = [
  { value: 'PARTNER', label: 'Partner' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'CLINICIAN', label: 'Clinician' },
  { value: 'INTERN', label: 'Intern' },
  { value: 'STAFF', label: 'Staff' },
];

interface InviteTeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInviteSent?: () => void;
}

const InviteTeamMemberModal: React.FC<InviteTeamMemberModalProps> = ({ open, onOpenChange, onInviteSent }) => {
  const { session } = useSession();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [internSubtype, setInternSubtype] = useState('');
  const [clinicianSubtype, setClinicianSubtype] = useState('');
  const [sending, setSending] = useState(false);

  const callerRole = session?.role;
  const availableRoles = callerRole === 'OWNER'
    ? ROLE_OPTIONS
    : ROLE_OPTIONS.filter(r => r.value !== 'PARTNER' && r.value !== 'OWNER');

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setRole('');
    setInternSubtype('');
    setClinicianSubtype('');
  };

  const handleSend = async () => {
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
    onOpenChange(false);
    onInviteSent?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onClick={handleSend}
              disabled={sending}
              className="text-sm font-semibold px-4 py-2 rounded-md transition-opacity"
              style={{ color: TEAL, border: `1px solid ${TEAL}`, background: 'transparent', opacity: sending ? 0.5 : 1 }}
            >
              {sending ? 'Sending…' : 'Send Invitation'}
            </button>
            <button
              onClick={() => { resetForm(); onOpenChange(false); }}
              className="text-sm text-muted-foreground px-4 py-2 rounded-md hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteTeamMemberModal;

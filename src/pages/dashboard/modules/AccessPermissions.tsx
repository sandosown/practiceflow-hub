import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { DEMO_USERS } from '@/data/demoUsers';
import AppLayout from '@/components/AppLayout';

const ALL_MODULES = [
  'Charts Requiring Action',
  'Message Board',
  'Management Center',
  'Client Database',
  'Referral Pipeline',
  'Treatment Plan Tracker',
  'Finance',
  'Insurance Database',
  'Vendor Database',
  'Supervision Structure',
  'Major Moments',
];

// Default modules by role
const ROLE_DEFAULT_MODULES: Record<string, string[]> = {
  OWNER: ALL_MODULES,
  ADMIN: ['Management Center', 'Client Database', 'Insurance Database', 'Vendor Database', 'Charts Requiring Action'],
  SUPERVISOR: ['Client Database', 'Supervision Structure', 'Charts Requiring Action'],
  CLINICIAN: ['Supervision Structure', 'Charts Requiring Action'],
  INTERN_CLINICAL: ['Supervision Structure', 'Charts Requiring Action'],
  INTERN_BUSINESS: [],
  STAFF: [],
};

interface Grant {
  grant_id: string;
  granted_to: string;
  module: string;
  access_type: string;
  is_active: boolean;
  created_at: string;
}

interface StaffMember {
  id: string;
  full_name: string;
  role: string;
  intern_subtype?: string | null;
  clinician_subtype?: string | null;
}

const AccessPermissions: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isDemoMode } = useSession();

  const [grants, setGrants] = useState<Grant[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [grantModule, setGrantModule] = useState('');
  const [grantAccessType, setGrantAccessType] = useState<'view' | 'full'>('view');

  const loadData = useCallback(async () => {
    if (isDemoMode) {
      // Use demo users as staff (exclude owner)
      const staff = DEMO_USERS.filter(u => u.id !== session?.user_id).map(u => ({
        id: u.id,
        full_name: u.full_name,
        role: u.role === 'INTERN' ? (u.intern_subtype === 'BUSINESS' ? 'INTERN_BUSINESS' : 'INTERN_CLINICAL') : u.role,
        intern_subtype: u.intern_subtype,
        clinician_subtype: u.clinician_subtype,
      }));
      setStaffList(staff);

      // Load grants from localStorage for demo
      const stored = localStorage.getItem('pf_permission_grants');
      if (stored) setGrants(JSON.parse(stored));
      return;
    }

    // Real mode: load profiles and grants
    const [profilesRes, grantsRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('permission_grants').select('*').eq('is_active', true),
    ]);

    if (profilesRes.data) {
      const staff = profilesRes.data
        .filter((p: any) => p.user_id !== session?.user_id)
        .map((p: any) => ({
          id: p.user_id,
          full_name: p.full_name || p.email || 'Unknown',
          role: p.role === 'INTERN' ? (p.intern_subtype === 'BUSINESS' ? 'INTERN_BUSINESS' : 'INTERN_CLINICAL') : p.role,
          intern_subtype: p.intern_subtype,
          clinician_subtype: p.clinician_subtype,
        }));
      setStaffList(staff);
    }

    if (grantsRes.data) {
      setGrants(grantsRes.data as any);
    }
  }, [isDemoMode, session?.user_id]);

  useEffect(() => { loadData(); }, [loadData]);

  const getEffectiveRole = (staff: StaffMember) => staff.role;

  const getDefaultModules = (staff: StaffMember) => {
    return ROLE_DEFAULT_MODULES[getEffectiveRole(staff)] ?? [];
  };

  const getActiveGrants = (staffId: string) => {
    return grants.filter(g => g.granted_to === staffId && g.is_active);
  };

  const getAvailableModules = (staff: StaffMember) => {
    const defaults = getDefaultModules(staff);
    const granted = getActiveGrants(staff.id).map(g => g.module);
    return ALL_MODULES.filter(m => !defaults.includes(m) && !granted.includes(m));
  };

  const handleGrant = async () => {
    if (!grantModule || !selectedStaff || !session) return;

    const newGrant: Grant = {
      grant_id: crypto.randomUUID(),
      granted_to: selectedStaff.id,
      module: grantModule,
      access_type: grantAccessType,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    if (isDemoMode) {
      const updated = [...grants, newGrant];
      setGrants(updated);
      localStorage.setItem('pf_permission_grants', JSON.stringify(updated));
    } else {
      const { error } = await supabase.from('permission_grants').insert({
        grant_id: newGrant.grant_id,
        hat_id: 'w1',
        granted_by: session.user_id,
        granted_to: selectedStaff.id,
        module: grantModule,
        access_type: grantAccessType,
      } as any);
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    }

    toast({ title: 'Access granted', description: `${selectedStaff.full_name} now has ${grantAccessType} access to ${grantModule}.` });
    setGrantModule('');
    setGrantAccessType('view');
    loadData();
  };

  const handleRevoke = async (grant: Grant) => {
    if (isDemoMode) {
      const updated = grants.map(g =>
        g.grant_id === grant.grant_id ? { ...g, is_active: false } : g
      );
      setGrants(updated.filter(g => g.is_active));
      localStorage.setItem('pf_permission_grants', JSON.stringify(updated));
    } else {
      await supabase.from('permission_grants').update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revoked_by: session?.user_id,
      } as any).eq('grant_id', grant.grant_id);
    }

    toast({ title: 'Access revoked', description: `Removed ${grant.module} access.` });
    loadData();
  };

  const roleLabelMap: Record<string, string> = {
    OWNER: 'Owner', ADMIN: 'Admin', SUPERVISOR: 'Supervisor', CLINICIAN: 'Clinician',
    INTERN_CLINICAL: 'Clinical Intern', INTERN_BUSINESS: 'Business Intern', STAFF: 'Staff',
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Access &amp; Permissions</h1>
            <p className="text-sm text-muted-foreground">Control what each team member can access.</p>
          </div>
        </div>

        {/* Staff list */}
        <div className="space-y-2">
          {staffList.map(staff => (
            <div key={staff.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{staff.full_name}</p>
                <p className="text-xs text-muted-foreground">{roleLabelMap[getEffectiveRole(staff)] ?? staff.role}</p>
              </div>
              <div className="flex items-center gap-2">
                {getActiveGrants(staff.id).length > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    {getActiveGrants(staff.id).length} grant{getActiveGrants(staff.id).length > 1 ? 's' : ''}
                  </Badge>
                )}
                <button
                  onClick={() => { setSelectedStaff(staff); setModalOpen(true); setGrantModule(''); setGrantAccessType('view'); }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                  style={{ color: '#2dd4bf', border: '1px solid #2dd4bf', background: 'transparent' }}
                >
                  Manage Access
                </button>
              </div>
            </div>
          ))}
          {staffList.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No team members found.</p>
          )}
        </div>
      </div>

      {/* Manage Access Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedStaff?.full_name}</DialogTitle>
            <DialogDescription>
              {roleLabelMap[selectedStaff ? getEffectiveRole(selectedStaff) : 'STAFF']} — manage additional module access
            </DialogDescription>
          </DialogHeader>

          {selectedStaff && (
            <div className="space-y-5">
              {/* Default access */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Default Access</p>
                <div className="flex flex-wrap gap-1.5">
                  {getDefaultModules(selectedStaff).length > 0 ? getDefaultModules(selectedStaff).map(m => (
                    <Badge key={m} variant="outline" className="text-[10px]">{m}</Badge>
                  )) : (
                    <span className="text-xs text-muted-foreground">No default modules</span>
                  )}
                </div>
              </div>

              {/* Current grants */}
              {getActiveGrants(selectedStaff.id).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Additional Access</p>
                  <div className="space-y-1.5">
                    {getActiveGrants(selectedStaff.id).map(g => (
                      <div key={g.grant_id} className="flex items-center justify-between rounded border border-border px-2.5 py-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-foreground">{g.module}</span>
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                            {g.access_type === 'full' ? 'Full' : 'View'}
                          </Badge>
                        </div>
                        <button
                          onClick={() => handleRevoke(g)}
                          className="text-[10px] font-medium px-2 py-0.5 rounded transition-colors text-destructive border border-destructive/40 hover:bg-destructive/10"
                        >
                          Revoke
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grant new access */}
              {getAvailableModules(selectedStaff).length > 0 && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Grant Access</p>

                  <Select value={grantModule} onValueChange={setGrantModule}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select module…" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableModules(selectedStaff).map(m => (
                        <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <RadioGroup value={grantAccessType} onValueChange={(v) => setGrantAccessType(v as 'view' | 'full')} className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="view" id="view" />
                      <Label htmlFor="view" className="text-xs">View Only</Label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full" className="text-xs">Full Access</Label>
                    </div>
                  </RadioGroup>

                  <button
                    onClick={handleGrant}
                    disabled={!grantModule}
                    className="text-xs font-semibold px-4 py-1.5 rounded-md transition-colors disabled:opacity-40"
                    style={{ color: '#2dd4bf', border: '1px solid #2dd4bf', background: 'transparent' }}
                  >
                    Grant Access
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default AccessPermissions;

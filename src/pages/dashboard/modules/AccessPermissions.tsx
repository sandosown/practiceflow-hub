import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { DEMO_USERS } from '@/data/demoUsers';

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

const TEAL = '#2dd4bf';

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
      const staff = DEMO_USERS.filter(u => u.id !== session?.user_id).map(u => ({
        id: u.id,
        full_name: u.full_name,
        role: u.role === 'INTERN' ? (u.intern_subtype === 'BUSINESS' ? 'INTERN_BUSINESS' : 'INTERN_CLINICAL') : u.role,
        intern_subtype: u.intern_subtype,
        clinician_subtype: u.clinician_subtype,
      }));
      setStaffList(staff);
      const stored = localStorage.getItem('pf_permission_grants');
      if (stored) setGrants(JSON.parse(stored));
      return;
    }

    const [profilesRes, grantsRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('permission_grants' as any).select('*').eq('is_active', true),
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

  const getDefaultModules = (staff: StaffMember) => ROLE_DEFAULT_MODULES[staff.role] ?? [];

  const getActiveGrants = (staffId: string) => grants.filter(g => g.granted_to === staffId && g.is_active);

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
      const { error } = await (supabase.from('permission_grants' as any) as any).insert({
        hat_id: 'w1',
        granted_by: session.user_id,
        granted_to: selectedStaff.id,
        module: grantModule,
        access_type: grantAccessType,
      });
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
      await (supabase.from('permission_grants' as any) as any).update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revoked_by: session?.user_id,
      }).eq('grant_id', grant.grant_id);
    }

    toast({ title: 'Access revoked', description: `Removed ${grant.module} access.` });
    loadData();
  };

  const roleLabelMap: Record<string, string> = {
    OWNER: 'Owner', ADMIN: 'Admin', SUPERVISOR: 'Supervisor', CLINICIAN: 'Clinician',
    INTERN_CLINICAL: 'Clinical Intern', INTERN_BUSINESS: 'Business Intern', STAFF: 'Staff',
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a1628' }}>
      <TopNavBar />

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
            <ArrowLeft className="h-5 w-5" style={{ color: '#94a3b8' }} />
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>Access &amp; Permissions</h1>
            <p className="text-sm" style={{ color: '#64748b' }}>Control what each team member can access.</p>
          </div>
        </div>

        {/* Staff list */}
        <div className="space-y-2">
          {staffList.map(staff => (
            <div
              key={staff.id}
              className="flex items-center justify-between rounded-lg p-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: '#f1f5f9' }}>{staff.full_name}</p>
                <p className="text-xs" style={{ color: '#64748b' }}>{roleLabelMap[staff.role] ?? staff.role}</p>
              </div>
              <div className="flex items-center gap-2">
                {getActiveGrants(staff.id).length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(45,212,191,0.15)', color: TEAL }}>
                    {getActiveGrants(staff.id).length} grant{getActiveGrants(staff.id).length > 1 ? 's' : ''}
                  </span>
                )}
                <button
                  onClick={() => { setSelectedStaff(staff); setModalOpen(true); setGrantModule(''); setGrantAccessType('view'); }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-md transition-colors hover:bg-white/5"
                  style={{ color: TEAL, border: `1px solid ${TEAL}`, background: 'transparent' }}
                >
                  Manage Access
                </button>
              </div>
            </div>
          ))}
          {staffList.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: '#64748b' }}>No team members found.</p>
          )}
        </div>
      </div>

      <BottomNavBar />

      {/* Manage Access Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md" style={{ background: '#0f1d32', border: '1px solid rgba(255,255,255,0.1)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#f1f5f9' }}>{selectedStaff?.full_name}</DialogTitle>
            <DialogDescription style={{ color: '#64748b' }}>
              {roleLabelMap[selectedStaff?.role ?? 'STAFF']} — manage additional module access
            </DialogDescription>
          </DialogHeader>

          {selectedStaff && (
            <div className="space-y-5">
              {/* Default access */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a8ab0' }}>Default Access</p>
                <div className="flex flex-wrap gap-1.5">
                  {getDefaultModules(selectedStaff).length > 0 ? getDefaultModules(selectedStaff).map(m => (
                    <span key={m} className="text-[10px] px-2 py-0.5 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8' }}>{m}</span>
                  )) : (
                    <span className="text-xs" style={{ color: '#64748b' }}>No default modules</span>
                  )}
                </div>
              </div>

              {/* Current grants */}
              {getActiveGrants(selectedStaff.id).length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a8ab0' }}>Additional Access</p>
                  <div className="space-y-1.5">
                    {getActiveGrants(selectedStaff.id).map(g => (
                      <div key={g.grant_id} className="flex items-center justify-between rounded px-2.5 py-1.5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: '#e2eaf4' }}>{g.module}</span>
                          <span className="text-[9px] px-1.5 py-0 rounded-full" style={{ background: 'rgba(45,212,191,0.15)', color: TEAL }}>
                            {g.access_type === 'full' ? 'Full' : 'View'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRevoke(g)}
                          className="text-[10px] font-medium px-2 py-0.5 rounded transition-colors hover:bg-red-500/10"
                          style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
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
                <div className="space-y-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5a8ab0' }}>Grant Access</p>

                  <Select value={grantModule} onValueChange={setGrantModule}>
                    <SelectTrigger className="h-9 text-xs" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2eaf4' }}>
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
                      <RadioGroupItem value="view" id="perm-view" />
                      <Label htmlFor="perm-view" className="text-xs" style={{ color: '#e2eaf4' }}>View Only</Label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="full" id="perm-full" />
                      <Label htmlFor="perm-full" className="text-xs" style={{ color: '#e2eaf4' }}>Full Access</Label>
                    </div>
                  </RadioGroup>

                  <button
                    onClick={handleGrant}
                    disabled={!grantModule}
                    className="text-xs font-semibold px-4 py-1.5 rounded-md transition-colors disabled:opacity-40"
                    style={{ color: TEAL, border: `1px solid ${TEAL}`, background: 'transparent' }}
                  >
                    Grant Access
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessPermissions;

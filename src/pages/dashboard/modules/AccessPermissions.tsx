import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ArrowLeft, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
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
  PARTNER: ALL_MODULES,
  ADMIN: ['Management Center', 'Client Database', 'Insurance Database', 'Vendor Database', 'Charts Requiring Action'],
  SUPERVISOR: ['Client Database', 'Supervision Structure', 'Charts Requiring Action'],
  CLINICIAN: ['Supervision Structure', 'Charts Requiring Action'],
  INTERN_CLINICAL: ['Supervision Structure', 'Charts Requiring Action'],
  INTERN_BUSINESS: [],
  STAFF: [],
};

const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Owner', PARTNER: 'Partner', ADMIN: 'Admin', SUPERVISOR: 'Supervisor', CLINICIAN: 'Clinician',
  INTERN_CLINICAL: 'Clinical Intern', INTERN_BUSINESS: 'Business Intern', STAFF: 'Staff',
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

// --- Sub-components ---

const PersonSearch: React.FC<{
  staffList: StaffMember[];
  onSelect: (s: StaffMember) => void;
  selected: StaffMember | null;
}> = ({ staffList, onSelect, selected }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return staffList;
    const q = query.toLowerCase();
    return staffList.filter(s => s.full_name.toLowerCase().includes(q));
  }, [query, staffList]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2.5"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        <Search className="h-4 w-4 shrink-0" style={{ color: '#64748b' }} />
        <input
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#64748b]"
          style={{ color: '#f1f5f9' }}
          placeholder="Search team member..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false); }} className="p-0.5 rounded hover:bg-white/10">
            <X className="h-3.5 w-3.5" style={{ color: '#64748b' }} />
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div
          className="absolute z-50 mt-1 w-full rounded-lg py-1 shadow-xl max-h-60 overflow-y-auto"
          style={{ background: '#0f1d32', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {filtered.map(s => (
            <button
              key={s.id}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 transition-colors"
              onClick={() => { onSelect(s); setOpen(false); setQuery(s.full_name); }}
            >
              <span
                className="flex items-center justify-center h-7 w-7 rounded-full text-[10px] font-bold shrink-0"
                style={{ background: 'rgba(45,212,191,0.15)', color: '#2dd4bf' }}
              >
                {s.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#f1f5f9' }}>{s.full_name}</p>
                <p className="text-[10px]" style={{ color: '#64748b' }}>{ROLE_LABELS[s.role] ?? s.role}</p>
              </div>
              {selected?.id === s.id && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(45,212,191,0.15)', color: '#2dd4bf' }}>
                  Selected
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {open && filtered.length === 0 && query.trim() && (
        <div
          className="absolute z-50 mt-1 w-full rounded-lg py-4 text-center text-xs shadow-xl"
          style={{ background: '#0f1d32', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}
        >
          No team members found.
        </div>
      )}
    </div>
  );
};

const ModuleGridSelector: React.FC<{
  disabledModules: string[];
  onConfirm: (modules: string[], accessType: 'view' | 'full') => void;
  onCancel: () => void;
}> = ({ disabledModules, onConfirm, onCancel }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [accessType, setAccessType] = useState<'view' | 'full'>('view');

  const toggle = (m: string) => {
    if (disabledModules.includes(m)) return;
    setSelected(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const availableModules = ALL_MODULES.filter(m => !disabledModules.includes(m));
  const allAvailableSelected = availableModules.length > 0 && availableModules.every(m => selected.includes(m));

  const handleToggleAll = () => {
    if (allAvailableSelected) {
      setSelected([]);
    } else {
      setSelected(availableModules);
    }
  };

  return (
    <div className="space-y-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#5a8ab0' }}>Select Modules</span>
        {availableModules.length > 0 && (
          <button
            onClick={handleToggleAll}
            className="text-[11px] font-medium transition-colors hover:underline"
            style={{ color: '#2dd4bf', background: 'transparent', border: 'none' }}
          >
            {allAvailableSelected ? 'Deselect All' : 'Select All'}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ALL_MODULES.map(m => {
          const disabled = disabledModules.includes(m);
          const active = selected.includes(m);
          return (
            <button
              key={m}
              disabled={disabled}
              onClick={() => toggle(m)}
              className="text-[11px] rounded-md px-2.5 py-2 text-left transition-all"
              style={{
                background: active ? 'rgba(45,212,191,0.12)' : disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                border: active ? '1px solid #2dd4bf' : '1px solid rgba(255,255,255,0.08)',
                color: disabled ? '#475569' : active ? '#2dd4bf' : '#94a3b8',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
              }}
            >
              {m}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#5a8ab0' }}>Access Type</span>
        <div className="flex rounded-md overflow-hidden gap-2">
          {(['view', 'full'] as const).map(t => (
            <button
              key={t}
              onClick={() => setAccessType(t)}
              className="text-[11px] px-3 py-1.5 rounded-md transition-colors font-medium"
              style={{
                background: accessType === t ? '#2dd4bf' : 'transparent',
                color: accessType === t ? '#0a1628' : '#2dd4bf',
                border: '1px solid #2dd4bf',
              }}
            >
              {t === 'view' ? 'View Only' : 'Full Access'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={selected.length === 0}
          onClick={() => onConfirm(selected, accessType)}
          className="text-xs font-semibold px-4 py-1.5 rounded-md transition-colors disabled:opacity-40"
          style={{ color: '#2dd4bf', border: '1px solid #2dd4bf', background: 'transparent' }}
        >
          Grant Access
        </button>
        <button
          onClick={onCancel}
          className="text-xs px-3 py-1.5 rounded-md transition-colors hover:bg-white/5"
          style={{ color: '#64748b' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const PersonAccessPanel: React.FC<{
  staff: StaffMember;
  grants: Grant[];
  onGrant: (modules: string[], accessType: 'view' | 'full') => void;
  onRevoke: (grant: Grant) => void;
}> = ({ staff, grants, onGrant, onRevoke }) => {
  const [showGrantSelector, setShowGrantSelector] = useState(false);
  const defaultModules = ROLE_DEFAULT_MODULES[staff.role] ?? [];
  const activeGrants = grants.filter(g => g.granted_to === staff.id && g.is_active);
  const disabledModules = [...defaultModules, ...activeGrants.map(g => g.module)];

  const handleConfirm = (modules: string[], accessType: 'view' | 'full') => {
    onGrant(modules, accessType);
    setShowGrantSelector(false);
  };

  const initials = staff.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className="rounded-xl p-5 space-y-5"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Person header */}
      <div className="flex items-center gap-3">
        <span
          className="flex items-center justify-center h-10 w-10 rounded-full text-sm font-bold"
          style={{ background: 'rgba(45,212,191,0.15)', color: '#2dd4bf' }}
        >
          {initials}
        </span>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>{staff.full_name}</p>
          <p className="text-[11px]" style={{ color: '#64748b' }}>{ROLE_LABELS[staff.role] ?? staff.role}</p>
        </div>
      </div>

      {/* Section A — Default Access */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a8ab0' }}>Default Access</p>
        <p className="text-[10px] mb-2" style={{ color: '#475569' }}>Default access based on role — cannot be changed</p>
        {defaultModules.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {defaultModules.map(m => (
              <span key={m} className="text-[10px] px-2 py-0.5 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}>
                {m}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[11px]" style={{ color: '#475569' }}>No default modules for this role.</span>
        )}
      </div>

      {/* Section B — Granted Access */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#5a8ab0' }}>Granted Access</p>
        {activeGrants.length > 0 ? (
          <div className="space-y-1.5">
            {activeGrants.map(g => (
              <div key={g.grant_id} className="flex items-center justify-between rounded-md px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: '#e2eaf4' }}>{g.module}</span>
                  <span className="text-[9px] px-1.5 py-0 rounded-full" style={{ background: 'rgba(45,212,191,0.12)', color: '#2dd4bf' }}>
                    {g.access_type === 'full' ? 'FULL' : 'VIEW'}
                  </span>
                </div>
                <button
                  onClick={() => onRevoke(g)}
                  className="text-[11px] font-medium transition-colors hover:underline"
                  style={{ color: '#2dd4bf' }}
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px]" style={{ color: '#475569' }}>No additional access granted yet.</p>
        )}
      </div>

      {/* Section C — Grant Access */}
      {!showGrantSelector ? (
        <button
          onClick={() => setShowGrantSelector(true)}
          className="text-xs font-semibold px-4 py-1.5 rounded-md transition-colors hover:bg-white/5"
          style={{ color: '#2dd4bf', border: '1px solid #2dd4bf', background: 'transparent' }}
        >
          + Grant Access
        </button>
      ) : (
        <ModuleGridSelector
          disabledModules={disabledModules}
          onConfirm={handleConfirm}
          onCancel={() => setShowGrantSelector(false)}
        />
      )}
    </div>
  );
};

// --- Main Page ---

const AccessPermissions: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isDemoMode } = useSession();

  const [grants, setGrants] = useState<Grant[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

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
      supabase.from('permission_grants').select('*').eq('is_active', true),
    ]);

    if (profilesRes.data) {
      setStaffList(profilesRes.data
        .filter((p: any) => p.user_id !== session?.user_id)
        .map((p: any) => ({
          id: p.user_id,
          full_name: p.full_name || p.email || 'Unknown',
          role: p.role === 'INTERN' ? (p.intern_subtype === 'BUSINESS' ? 'INTERN_BUSINESS' : 'INTERN_CLINICAL') : p.role,
          intern_subtype: p.intern_subtype,
          clinician_subtype: p.clinician_subtype,
        })));
    }
    if (grantsRes.data) setGrants(grantsRes.data as any);
  }, [isDemoMode, session?.user_id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleGrant = async (modules: string[], accessType: 'view' | 'full') => {
    if (!selectedStaff || !session) return;

    if (isDemoMode) {
      const newGrants = modules.map(m => ({
        grant_id: crypto.randomUUID(),
        granted_to: selectedStaff.id,
        module: m,
        access_type: accessType,
        is_active: true,
        created_at: new Date().toISOString(),
      }));
      const updated = [...grants, ...newGrants];
      setGrants(updated);
      localStorage.setItem('pf_permission_grants', JSON.stringify(updated));
    } else {
      for (const m of modules) {
        const { error } = await supabase.from('permission_grants').insert({
          granted_by: session.user_id,
          granted_to: selectedStaff.id,
          module: m,
          access_type: accessType,
        });
        if (error) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
          return;
        }
      }
    }

    toast({
      title: 'Access granted',
      description: `${selectedStaff.full_name} now has ${accessType} access to ${modules.length} module${modules.length > 1 ? 's' : ''}.`,
    });
    loadData();
  };

  const handleRevoke = async (grant: Grant) => {
    if (isDemoMode) {
      const updated = grants.map(g => g.grant_id === grant.grant_id ? { ...g, is_active: false } : g);
      setGrants(updated.filter(g => g.is_active));
      localStorage.setItem('pf_permission_grants', JSON.stringify(updated));
    } else {
      await supabase.from('permission_grants').update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revoked_by: session?.user_id,
      }).eq('grant_id', grant.grant_id);
    }

    toast({ title: 'Access revoked', description: `Removed ${grant.module} access.` });
    loadData();
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a1628' }}>
      <TopNavBar />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
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

        {/* Search */}
        <PersonSearch staffList={staffList} onSelect={setSelectedStaff} selected={selectedStaff} />

        {/* Person Panel */}
        {selectedStaff && (
          <PersonAccessPanel
            staff={selectedStaff}
            grants={grants}
            onGrant={handleGrant}
            onRevoke={handleRevoke}
          />
        )}

        {!selectedStaff && (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: '#475569' }}>Search for a team member above to manage their access.</p>
          </div>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
};

export default AccessPermissions;

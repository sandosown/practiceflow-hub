import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { workerProfilesStore } from '@/data/gpMockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft, Save, Send, AlertTriangle, Plus, Trash2, Star, Upload, CalendarIcon, ChevronRight } from 'lucide-react';
import { useQuestionnaireDraft } from '@/hooks/useQuestionnaireDraft';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  US_STATES, POPULATIONS_LIST, PRESENTING_ISSUES_LIST,
  CLINICAL_DISORDERS_LIST, MODALITIES_LIST, LICENSE_STATUS_OPTIONS,
} from '@/data/wizardOptions';

const STEPS = [
  'Basics', 'Credentials', 'Address',
  'Preferred Populations', 'Presenting Issues',
  'Clinical Disorders', 'Specialty Areas',
];

// ── Shared styles ──────────────────────────────────────────────────────────
const sectionTitle = 'uppercase text-[11px] tracking-[0.08em] text-[rgba(255,255,255,0.4)] font-medium mb-4';
const fieldLabel = 'uppercase text-[11px] tracking-[0.08em] text-[rgba(255,255,255,0.4)] font-medium mb-1.5 block';
const inputClass = 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-sm';

const WorkerProfileWizard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const workerId = user?.id ?? 'anonymous';
  const hook = useQuestionnaireDraft(workerId);

  const ans = hook.answers;
  const set = (key: string, value: string) => hook.setAnswer(key as any, value);

  // ── Legacy submit for ProfileReviews compatibility ──────────────────────
  const submitForReview = async () => {
    await hook.saveDraft();
    const existing = workerProfilesStore.getAll().find(p => p.worker_profile_id === workerId);
    const primaryLicense = hook.licenses.find(l => l.is_primary) ?? hook.licenses[0];
    const populations = hook.tags.filter(t => t.tag_type === 'population').map(t => t.tag_value);
    const ethnicity = hook.tags.filter(t => t.tag_type === 'ethnicity').map(t => t.tag_value);

    const profileData = {
      id: existing?.id ?? crypto.randomUUID(),
      workspace_id: 'w1',
      worker_profile_id: workerId,
      status: 'submitted' as const,
      review_note: null,
      reviewed_by_profile_id: null,
      reviewed_at: null,
      submitted_at: new Date().toISOString(),
      created_at: existing?.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email: ans.email ?? '',
      first_name: ans.first_name ?? '',
      last_name: ans.last_name ?? '',
      date_of_birth: ans.date_of_birth ?? '',
      license_type: primaryLicense?.license_type ?? '',
      caqh_number: ans.caqh_number ?? '',
      npi_number: ans.npi_number ?? '',
      address: ans.address ?? '',
      city: ans.city ?? '',
      county: ans.county ?? '',
      state: ans.state ?? '',
      zip_code: ans.zip_code ?? '',
      populations_served: populations,
      provider_ethnicity: ethnicity,
    };

    if (existing) workerProfilesStore.update(existing.id, profileData);
    else workerProfilesStore.create(profileData);
    navigate('/practice/people');
  };

  if (hook.loading) {
    return (
      <AppLayout title="My Onboarding Profile" breadcrumbs={[
        { label: 'People', path: '/practice/people' }, { label: 'My Profile' },
      ]}>
        <p className="text-muted-foreground p-4">Loading your draft…</p>
      </AppLayout>
    );
  }

  const legacy = workerProfilesStore.getAll().find(p => p.worker_profile_id === workerId);
  const isLast = step === STEPS.length - 1;

  return (
    <AppLayout title="My Onboarding Profile" breadcrumbs={[
      { label: 'People', path: '/practice/people' }, { label: 'My Profile' },
    ]}>
      {/* Changes-requested banner */}
      {legacy?.status === 'changes_requested' && legacy.review_note && (
        <div className="pf-glass p-4 mb-4 border-l-4 border-orange-400 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-foreground">Changes Requested</p>
            <p className="text-sm text-muted-foreground">{legacy.review_note}</p>
          </div>
        </div>
      )}

      {/* Step indicator — 7 pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
        {STEPS.map((s, i) => (
          <button key={s} onClick={() => setStep(i)}
            className={cn(
              'text-xs px-3 py-1.5 rounded-full font-medium transition whitespace-nowrap min-h-[44px] md:min-h-0',
              i === step
                ? 'bg-[hsl(var(--accent-teal,174_100%_52%))] text-[#060e1e]'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}>
            {s}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className="pf-glass p-6 max-w-2xl space-y-6">
        {step === 0 && <SectionBasics ans={ans} set={set} />}
        {step === 1 && <SectionCredentials ans={ans} set={set} hook={hook} />}
        {step === 2 && <SectionAddress ans={ans} set={set} />}
        {step === 3 && <SectionChips label="Preferred Populations" items={POPULATIONS_LIST} tagType="population" hook={hook} />}
        {step === 4 && <SectionChecklist label="Presenting Issues" items={PRESENTING_ISSUES_LIST} tagType="specialty" hook={hook} tagPrefix="issue:" />}
        {step === 5 && <SectionChecklist label="Clinical Disorders" items={CLINICAL_DISORDERS_LIST} tagType="specialty" hook={hook} tagPrefix="disorder:" />}
        {step === 6 && <SectionChecklist label="Specialty Areas / Treatment Modalities" items={MODALITIES_LIST} tagType="modality" hook={hook} />}
      </div>

      {/* Navigation */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mt-6 max-w-2xl gap-3">
        <Button variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          className="min-h-[44px] md:min-h-0 w-auto self-start">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={() => hook.saveDraft()} disabled={hook.saving}
            className="min-h-[44px] text-sm border-[rgba(255,255,255,0.2)] text-muted-foreground w-full md:w-auto">
            <Save className="w-4 h-4 mr-1" /> {hook.saving ? 'Saving…' : 'Save Draft'}
          </Button>
          {isLast ? (
            <Button onClick={submitForReview} disabled={hook.saving}
              className="min-h-[44px] bg-transparent border border-[#2dd4bf] text-[#2dd4bf] hover:bg-[rgba(45,212,191,0.1)] w-full md:w-auto">
              <Send className="w-4 h-4 mr-1" /> Submit for Review
            </Button>
          ) : (
            <Button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
              className="min-h-[44px] bg-transparent border border-[#2dd4bf] text-[#2dd4bf] hover:bg-[rgba(45,212,191,0.1)] w-full md:w-auto">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default WorkerProfileWizard;

// ═══════════════════════════════════════════════════════════════════════════
// Section Components
// ═══════════════════════════════════════════════════════════════════════════

function SectionBasics({ ans, set }: { ans: any; set: (k: string, v: string) => void }) {
  const [dobOpen, setDobOpen] = useState(false);
  const dobDate = ans.date_of_birth ? new Date(ans.date_of_birth + 'T00:00:00') : undefined;

  return (
    <div className="space-y-4">
      <h3 className={sectionTitle}>Basics</h3>

      {/* Upload to Autofill — disabled V1 */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button disabled
              className="flex items-center gap-2 uppercase text-[11px] tracking-[0.06em] border border-[rgba(255,255,255,0.2)] text-[rgba(255,255,255,0.3)] rounded-lg px-3 py-2 opacity-50 cursor-not-allowed mb-2">
              <Upload className="w-3.5 h-3.5" /> Upload CV / Resume to Autofill
            </button>
          </TooltipTrigger>
          <TooltipContent><p>Coming soon</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="space-y-4">
        <div>
          <label className={fieldLabel}>First Name</label>
          <Input className={inputClass} value={ans.first_name ?? ''} onChange={e => set('first_name', e.target.value)} />
        </div>
        <div>
          <label className={fieldLabel}>Last Name</label>
          <Input className={inputClass} value={ans.last_name ?? ''} onChange={e => set('last_name', e.target.value)} />
        </div>
        <div>
          <label className={fieldLabel}>Email</label>
          <Input type="email" className={inputClass} value={ans.email ?? ''} onChange={e => set('email', e.target.value)} />
        </div>
        <div>
          <label className={fieldLabel}>Date of Birth</label>
          <Popover open={dobOpen} onOpenChange={setDobOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn(inputClass, 'w-full justify-start text-left font-normal', !dobDate && 'text-muted-foreground')}>
                <CalendarIcon className="w-4 h-4 mr-2 opacity-50" />
                {dobDate ? format(dobDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dobDate}
                onSelect={(d) => { if (d) { set('date_of_birth', format(d, 'yyyy-MM-dd')); setDobOpen(false); } }}
                disabled={(d) => d > new Date()}
                captionLayout="dropdown-buttons" fromYear={1930} toYear={new Date().getFullYear()}
                className={cn('p-3 pointer-events-auto')} />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className={fieldLabel}>Phone Number</label>
          <Input className={inputClass} value={ans.phone_number ?? ''} onChange={e => set('phone_number', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function SectionCredentials({ ans, set, hook }: { ans: any; set: (k: string, v: string) => void; hook: any }) {
  return (
    <div className="space-y-4">
      <h3 className={sectionTitle}>Credentials</h3>

      {/* Repeatable license cards */}
      <div className="flex items-center justify-between mb-1">
        <span className={fieldLabel}>Licenses</span>
        <button type="button" onClick={() => hook.addLicense()}
          className="text-xs flex items-center gap-1 border border-[#2dd4bf] text-[#2dd4bf] rounded-lg px-3 py-1.5 min-h-[44px] md:min-h-0 hover:bg-[rgba(45,212,191,0.1)] transition">
          <Plus className="w-3 h-3" /> Add License
        </button>
      </div>

      {hook.licenses.length === 0 && (
        <p className="text-xs text-muted-foreground italic">No licenses added yet.</p>
      )}

      {hook.licenses.map((lic: any, idx: number) => (
        <LicenseCard key={lic.id} lic={lic} idx={idx} hook={hook} canRemove={hook.licenses.length > 1} />
      ))}

      <div className="pt-4 space-y-4">
        <div>
          <label className={fieldLabel}>CAQH #</label>
          <Input className={inputClass} value={ans.caqh_number ?? ''} onChange={e => set('caqh_number', e.target.value)} />
        </div>
        <div>
          <label className={fieldLabel}>NPI #</label>
          <Input className={inputClass} value={ans.npi_number ?? ''} onChange={e => set('npi_number', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function LicenseCard({ lic, idx, hook, canRemove }: { lic: any; idx: number; hook: any; canRemove: boolean }) {
  const [expiryOpen, setExpiryOpen] = useState(false);
  const expiryDate = lic.expiry_date ? new Date(lic.expiry_date + 'T00:00:00') : undefined;

  return (
    <div className="pf-glass p-4 space-y-3 border border-[rgba(255,255,255,0.06)] rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">License {idx + 1}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => hook.setPrimaryLicense(lic.id)}
            className={cn('text-xs flex items-center gap-1 min-h-[44px] md:min-h-0', lic.is_primary ? 'text-[#2dd4bf]' : 'text-muted-foreground hover:text-[#2dd4bf]')}>
            <Star className={cn('w-3 h-3', lic.is_primary && 'fill-[#2dd4bf]')} />
            {lic.is_primary ? 'Primary' : 'Set primary'}
          </button>
          {canRemove && (
            <button type="button" onClick={() => hook.removeLicense(lic.id)} className="min-h-[44px] md:min-h-0 flex items-center">
              <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={fieldLabel}>License Type</label>
          <Input className={inputClass} placeholder="e.g. LPC" value={lic.license_type} onChange={e => hook.updateLicense(lic.id, { license_type: e.target.value })} />
        </div>
        <div>
          <label className={fieldLabel}>License Number</label>
          <Input className={inputClass} value={lic.license_number ?? ''} onChange={e => hook.updateLicense(lic.id, { license_number: e.target.value })} />
        </div>
        <div>
          <label className={fieldLabel}>License State</label>
          <Select value={lic.issuing_state ?? ''} onValueChange={v => hook.updateLicense(lic.id, { issuing_state: v })}>
            <SelectTrigger className={inputClass}><SelectValue placeholder="Select state" /></SelectTrigger>
            <SelectContent>{US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <label className={fieldLabel}>Expiration Date</label>
          <Popover open={expiryOpen} onOpenChange={setExpiryOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn(inputClass, 'w-full justify-start text-left font-normal', !expiryDate && 'text-muted-foreground')}>
                <CalendarIcon className="w-4 h-4 mr-2 opacity-50" />
                {expiryDate ? format(expiryDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={expiryDate}
                onSelect={(d) => { if (d) { hook.updateLicense(lic.id, { expiry_date: format(d, 'yyyy-MM-dd') }); setExpiryOpen(false); } }}
                className={cn('p-3 pointer-events-auto')} />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className={fieldLabel}>Status</label>
          <Select value={lic.status ?? ''} onValueChange={v => hook.updateLicense(lic.id, { status: v })}>
            <SelectTrigger className={inputClass}><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>{LICENSE_STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer min-h-[44px] md:min-h-0">
            <Checkbox checked={lic.is_primary} onCheckedChange={() => hook.setPrimaryLicense(lic.id)}
              className="data-[state=checked]:bg-[#2dd4bf] data-[state=checked]:border-[#2dd4bf]" />
            <span className="text-xs text-muted-foreground">Is Primary</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function SectionAddress({ ans, set }: { ans: any; set: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <h3 className={sectionTitle}>Address</h3>
      <div>
        <label className={fieldLabel}>Street Address</label>
        <Input className={inputClass} value={ans.address ?? ''} onChange={e => set('address', e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={fieldLabel}>City</label>
          <Input className={inputClass} value={ans.city ?? ''} onChange={e => set('city', e.target.value)} />
        </div>
        <div>
          <label className={fieldLabel}>County</label>
          <Input className={inputClass} value={ans.county ?? ''} onChange={e => set('county', e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={fieldLabel}>State</label>
          <Select value={ans.state ?? ''} onValueChange={v => set('state', v)}>
            <SelectTrigger className={inputClass}><SelectValue placeholder="Select state" /></SelectTrigger>
            <SelectContent>{US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <label className={fieldLabel}>Zip Code</label>
          <Input className={inputClass} value={ans.zip_code ?? ''} onChange={e => set('zip_code', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function SectionChips({ label, items, tagType, hook }: { label: string; items: string[]; tagType: string; hook: any }) {
  return (
    <div className="space-y-4">
      <h3 className={sectionTitle}>{label}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map(item => {
          const selected = hook.hasTag(tagType, item);
          return (
            <button key={item} onClick={() => hook.toggleTag(tagType, item)}
              className={cn(
                'text-xs px-3 py-2 rounded-full border transition min-h-[44px] md:min-h-0',
                selected
                  ? 'border-[#2dd4bf] text-[#2dd4bf] bg-[rgba(45,212,191,0.1)]'
                  : 'border-[rgba(45,212,191,0.45)] text-[rgba(45,212,191,0.45)] bg-transparent hover:bg-[rgba(45,212,191,0.05)]'
              )}>
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionChecklist({ label, items, tagType, hook, tagPrefix = '' }: {
  label: string; items: string[]; tagType: string; hook: any; tagPrefix?: string;
}) {
  return (
    <div className="space-y-4">
      <h3 className={sectionTitle}>{label}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
        {items.map(item => {
          const tagValue = tagPrefix + item;
          const checked = hook.hasTag(tagType, tagValue);
          return (
            <label key={item}
              className={cn(
                'flex items-center gap-2.5 py-2 px-1 rounded cursor-pointer min-h-[44px] md:min-h-0 transition',
                checked ? 'text-foreground' : 'text-muted-foreground'
              )}>
              <Checkbox checked={checked} onCheckedChange={() => hook.toggleTag(tagType, tagValue)}
                className="data-[state=checked]:bg-[#2dd4bf] data-[state=checked]:border-[#2dd4bf] flex-shrink-0" />
              <span className="text-sm leading-snug">{item}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { workerProfilesStore, GpWorkerProfile, POPULATIONS_OPTIONS, ETHNICITY_OPTIONS } from '@/data/gpMockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, Send, AlertTriangle } from 'lucide-react';

const STEPS = ['Basics', 'Credentials', 'Address', 'Populations', 'Ethnicity'];

const emptyProfile = (workerId: string): GpWorkerProfile => ({
  id: crypto.randomUUID(), workspace_id: 'w1', worker_profile_id: workerId,
  status: 'draft', review_note: null, reviewed_by_profile_id: null, reviewed_at: null,
  submitted_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  email: '', first_name: '', last_name: '', date_of_birth: '', license_type: '', caqh_number: '',
  npi_number: '', address: '', city: '', county: '', state: '', zip_code: '',
  populations_served: [], provider_ethnicity: [],
});

const WorkerProfileWizard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const existing = useMemo(() => workerProfilesStore.getAll().find(p => p.worker_profile_id === user?.id), [user?.id]);
  const [form, setForm] = useState<GpWorkerProfile>(() => existing ? { ...existing } : emptyProfile(user?.id ?? ''));

  const set = (field: keyof GpWorkerProfile, value: any) => setForm(f => ({ ...f, [field]: value }));

  const toggleArr = (field: 'populations_served' | 'provider_ethnicity', val: string) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(v => v !== val) : [...f[field], val],
    }));
  };

  const saveDraft = () => {
    const data = { ...form, status: form.status === 'approved' ? 'draft' as const : form.status, updated_at: new Date().toISOString() };
    if (existing) workerProfilesStore.update(existing.id, data);
    else workerProfilesStore.create(data);
  };

  const submitForReview = () => {
    const data = { ...form, status: 'submitted' as const, submitted_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    if (existing) workerProfilesStore.update(existing.id, data);
    else workerProfilesStore.create(data);
    navigate('/practice/people');
  };

  return (
    <AppLayout title="My Onboarding Profile" breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' },
      { label: 'People', path: '/practice/people' }, { label: 'My Profile' },
    ]}>
      {form.status === 'changes_requested' && form.review_note && (
        <div className="pf-glass p-4 mb-4 border-l-4 border-orange-400 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-foreground">Changes Requested</p>
            <p className="text-sm text-muted-foreground">{form.review_note}</p>
          </div>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <button key={s} onClick={() => setStep(i)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${i === step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="pf-glass p-5 max-w-xl">
        {step === 0 && (
          <div className="space-y-3">
            <Input placeholder="First Name" value={form.first_name} onChange={e => set('first_name', e.target.value)} />
            <Input placeholder="Last Name" value={form.last_name} onChange={e => set('last_name', e.target.value)} />
            <Input placeholder="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
            <Input placeholder="Date of Birth" type="date" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} />
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <Input placeholder="License Type" value={form.license_type} onChange={e => set('license_type', e.target.value)} />
            <Input placeholder="CAQH Number" value={form.caqh_number} onChange={e => set('caqh_number', e.target.value)} />
            <Input placeholder="NPI Number" value={form.npi_number} onChange={e => set('npi_number', e.target.value)} />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <Input placeholder="Address" value={form.address} onChange={e => set('address', e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="City" value={form.city} onChange={e => set('city', e.target.value)} />
              <Input placeholder="County" value={form.county} onChange={e => set('county', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="State" value={form.state} onChange={e => set('state', e.target.value)} />
              <Input placeholder="ZIP Code" value={form.zip_code} onChange={e => set('zip_code', e.target.value)} />
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground mb-2">Populations Served</p>
            <div className="flex flex-wrap gap-2">
              {POPULATIONS_OPTIONS.map(p => (
                <button key={p} onClick={() => toggleArr('populations_served', p)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${form.populations_served.includes(p) ? 'bg-primary/15 border-primary text-primary' : 'bg-muted border-border text-muted-foreground hover:bg-accent'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground mb-2">Provider Ethnicity (optional)</p>
            <div className="flex flex-wrap gap-2">
              {ETHNICITY_OPTIONS.map(e => (
                <button key={e} onClick={() => toggleArr('provider_ethnicity', e)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${form.provider_ethnicity.includes(e) ? 'bg-primary/15 border-primary text-primary' : 'bg-muted border-border text-muted-foreground hover:bg-accent'}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 max-w-xl">
        <Button variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveDraft} className="text-sm"><Save className="w-4 h-4 mr-1" /> Save Draft</Button>
          {step === STEPS.length - 1 ? (
            <Button onClick={submitForReview} className="pf-btn pf-btn-teal"><Send className="w-4 h-4 mr-1" /> Submit for Review</Button>
          ) : (
            <Button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} className="pf-btn pf-btn-teal">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default WorkerProfileWizard;

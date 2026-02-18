import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { POPULATIONS_OPTIONS, ETHNICITY_OPTIONS, workerProfilesStore } from '@/data/gpMockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, Send, AlertTriangle, Plus, Trash2, Star } from 'lucide-react';
import { useQuestionnaireDraft } from '@/hooks/useQuestionnaireDraft';

/**
 * WorkerProfileWizard — Questionnaire-first architecture
 *
 * Reads/writes exclusively through useQuestionnaireDraft (→ questionnaire_draft_answers,
 * employee_licenses, employee_tags). The old flat gp_worker_profiles localStorage store
 * is only touched on final submit, preserving backward compatibility with ProfileReviews.
 *
 * Upload-to-autofill (future): call hook.applyAutofill(extraction) — hydrates wizard
 * state without creating any records directly. Manual entry and upload share this
 * same save pipeline (saveDraft).
 */

const STEPS = ['Basics', 'Credentials', 'Address', 'Populations', 'Ethnicity'];

const WorkerProfileWizard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const workerId = user?.id ?? 'anonymous';
  const hook = useQuestionnaireDraft(workerId);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const ans = hook.answers;
  const set = (key: string, value: string) => hook.setAnswer(key as any, value);

  // ── Legacy save for ProfileReviews compatibility ──────────────────────────
  // On submit we still write to workerProfilesStore so the existing owner
  // review flow continues to work during the migration period.
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
        { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' },
        { label: 'People', path: '/practice/people' }, { label: 'My Profile' },
      ]}>
        <p className="text-muted-foreground p-4">Loading your draft…</p>
      </AppLayout>
    );
  }

  // ── Changes-requested banner (from legacy store) ──────────────────────────
  const legacy = workerProfilesStore.getAll().find(p => p.worker_profile_id === workerId);

  return (
    <AppLayout title="My Onboarding Profile" breadcrumbs={[
      { label: 'Role Hub', path: '/hub' }, { label: 'Group Practice', path: '/practice/radar' },
      { label: 'People', path: '/practice/people' }, { label: 'My Profile' },
    ]}>
      {legacy?.status === 'changes_requested' && legacy.review_note && (
        <div className="pf-glass p-4 mb-4 border-l-4 border-orange-400 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-foreground">Changes Requested</p>
            <p className="text-sm text-muted-foreground">{legacy.review_note}</p>
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
        {/* ── Step 0: Basics ── */}
        {step === 0 && (
          <div className="space-y-3">
            <Input placeholder="First Name" value={ans.first_name ?? ''} onChange={e => set('first_name', e.target.value)} />
            <Input placeholder="Last Name" value={ans.last_name ?? ''} onChange={e => set('last_name', e.target.value)} />
            <Input placeholder="Email" type="email" value={ans.email ?? ''} onChange={e => set('email', e.target.value)} />
            <Input placeholder="Date of Birth" type="date" value={ans.date_of_birth ?? ''} onChange={e => set('date_of_birth', e.target.value)} />
          </div>
        )}

        {/* ── Step 1: Credentials — repeatable licenses ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Input placeholder="CAQH Number" value={ans.caqh_number ?? ''} onChange={e => set('caqh_number', e.target.value)} />
              <Input placeholder="NPI Number" value={ans.npi_number ?? ''} onChange={e => set('npi_number', e.target.value)} />
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-foreground">Licenses</p>
                <button
                  type="button"
                  onClick={() => hook.addLicense()}
                  className="text-xs flex items-center gap-1 text-primary hover:underline"
                >
                  <Plus className="w-3 h-3" /> Add license
                </button>
              </div>

              {hook.licenses.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No licenses added yet. Click "Add license" above.</p>
              )}

              {hook.licenses.map((lic, idx) => (
                <div key={lic.id} className="pf-glass p-3 mb-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">License {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        title="Set as primary"
                        onClick={() => hook.setPrimaryLicense(lic.id)}
                        className={`text-xs flex items-center gap-1 ${lic.is_primary ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                      >
                        <Star className={`w-3 h-3 ${lic.is_primary ? 'fill-primary' : ''}`} />
                        {lic.is_primary ? 'Primary' : 'Set primary'}
                      </button>
                      <button type="button" onClick={() => hook.removeLicense(lic.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="License type (e.g. LPC)"
                      value={lic.license_type}
                      onChange={e => hook.updateLicense(lic.id, { license_type: e.target.value })}
                    />
                    <Input
                      placeholder="License number"
                      value={lic.license_number ?? ''}
                      onChange={e => hook.updateLicense(lic.id, { license_number: e.target.value })}
                    />
                    <Input
                      placeholder="Issuing state"
                      value={lic.issuing_state ?? ''}
                      onChange={e => hook.updateLicense(lic.id, { issuing_state: e.target.value })}
                    />
                    <Input
                      placeholder="Expiry date"
                      type="date"
                      value={lic.expiry_date ?? ''}
                      onChange={e => hook.updateLicense(lic.id, { expiry_date: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Address ── */}
        {step === 2 && (
          <div className="space-y-3">
            <Input placeholder="Address" value={ans.address ?? ''} onChange={e => set('address', e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="City" value={ans.city ?? ''} onChange={e => set('city', e.target.value)} />
              <Input placeholder="County" value={ans.county ?? ''} onChange={e => set('county', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="State" value={ans.state ?? ''} onChange={e => set('state', e.target.value)} />
              <Input placeholder="ZIP Code" value={ans.zip_code ?? ''} onChange={e => set('zip_code', e.target.value)} />
            </div>
          </div>
        )}

        {/* ── Step 3: Populations (employee_tags: population) ── */}
        {step === 3 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground mb-2">Populations Served</p>
            <div className="flex flex-wrap gap-2">
              {POPULATIONS_OPTIONS.map(p => (
                <button key={p} onClick={() => hook.toggleTag('population', p)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${hook.hasTag('population', p) ? 'bg-primary/15 border-primary text-primary' : 'bg-muted border-border text-muted-foreground hover:bg-accent'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 4: Ethnicity (employee_tags: ethnicity) ── */}
        {step === 4 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground mb-2">Provider Ethnicity (optional)</p>
            <div className="flex flex-wrap gap-2">
              {ETHNICITY_OPTIONS.map(e => (
                <button key={e} onClick={() => hook.toggleTag('ethnicity', e)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${hook.hasTag('ethnicity', e) ? 'bg-primary/15 border-primary text-primary' : 'bg-muted border-border text-muted-foreground hover:bg-accent'}`}>
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
          <Button variant="outline" onClick={() => hook.saveDraft()} disabled={hook.saving} className="text-sm">
            <Save className="w-4 h-4 mr-1" /> {hook.saving ? 'Saving…' : 'Save Draft'}
          </Button>
          {step === STEPS.length - 1 ? (
            <Button onClick={submitForReview} disabled={hook.saving} className="pf-btn pf-btn-teal">
              <Send className="w-4 h-4 mr-1" /> Submit for Review
            </Button>
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

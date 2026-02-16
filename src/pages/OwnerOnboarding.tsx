import React, { useState } from 'react';
import { Briefcase, GraduationCap, Home, Check, ArrowRight, ArrowUp, ArrowDown, Plus, Trash2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface OwnerOnboardingProps {
  onComplete: (data: {
    domains: string[];
    domain_priority: string[];
    domain_labels: Record<string, string>;
    notifications_pref: 'LOW' | 'MEDIUM' | 'HIGH';
    onboarding_complete: true;
  }) => void;
}

const BUILTIN_DOMAINS = [
  {
    key: 'GROUP_PRACTICE',
    label: 'Group Practice',
    description: 'Manage referrals, staff, and intake workflows',
    icon: Briefcase,
    required: true,
    gradient: 'linear-gradient(135deg, rgba(47,198,180,0.30) 0%, rgba(91,183,255,0.25) 100%)',
    border: 'rgba(47,198,180,0.45)',
    borderSelected: 'rgba(47,198,180,0.80)',
  },
  {
    key: 'COACHING',
    label: 'Coaching Business',
    description: 'Client follow-ups, workshops, and invoicing',
    icon: GraduationCap,
    required: false,
    gradient: 'linear-gradient(135deg, rgba(124,108,246,0.25) 0%, rgba(91,183,255,0.22) 100%)',
    border: 'rgba(124,108,246,0.35)',
    borderSelected: 'rgba(124,108,246,0.80)',
  },
  {
    key: 'HOME',
    label: 'Home',
    description: 'Household tasks, maintenance, and reminders',
    icon: Home,
    required: false,
    gradient: 'linear-gradient(135deg, rgba(167,243,208,0.35) 0%, rgba(47,198,180,0.25) 100%)',
    border: 'rgba(47,198,180,0.35)',
    borderSelected: 'rgba(47,198,180,0.80)',
  },
];

const CUSTOM_KEYS = ['CUSTOM_1', 'CUSTOM_2'] as const;
const CUSTOM_GRADIENT = 'linear-gradient(135deg, rgba(91,183,255,0.20) 0%, rgba(124,108,246,0.15) 100%)';
const CUSTOM_BORDER = 'rgba(91,183,255,0.35)';
const CUSTOM_BORDER_SELECTED = 'rgba(91,183,255,0.80)';

const NOISE_OPTIONS: { key: 'LOW' | 'MEDIUM' | 'HIGH'; label: string; description: string }[] = [
  { key: 'LOW', label: 'Low', description: 'Only critical deadlines' },
  { key: 'MEDIUM', label: 'Medium', description: 'Daily digest + urgent alerts' },
  { key: 'HIGH', label: 'High', description: 'Real-time for everything' },
];

const OwnerOnboarding: React.FC<OwnerOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['GROUP_PRACTICE']);
  const [priority, setPriority] = useState<string[]>(['GROUP_PRACTICE']);
  const [domainLabels, setDomainLabels] = useState<Record<string, string>>({
    GROUP_PRACTICE: 'Group Practice',
    COACHING: 'Coaching Business',
    HOME: 'Home',
  });
  const [noisePref, setNoisePref] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const customDomains = CUSTOM_KEYS.filter(k => k in domainLabels && selectedDomains.includes(k));
  const nextCustomKey = CUSTOM_KEYS.find(k => !domainLabels[k] || !selectedDomains.includes(k));
  const canAddCustom = customDomains.length < 2 && !!nextCustomKey;

  const toggleDomain = (key: string) => {
    const builtin = BUILTIN_DOMAINS.find(d => d.key === key);
    if (builtin?.required) return;
    setSelectedDomains(prev => {
      const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
      setPriority(p => {
        const filtered = p.filter(k => next.includes(k));
        const missing = next.filter(k => !filtered.includes(k));
        return [...filtered, ...missing];
      });
      return next;
    });
  };

  const addCustomDomain = () => {
    const label = customInput.trim();
    if (!label || !nextCustomKey) return;
    const key = nextCustomKey;
    setDomainLabels(prev => ({ ...prev, [key]: label }));
    setSelectedDomains(prev => [...prev, key]);
    setPriority(prev => [...prev, key]);
    setCustomInput('');
    setShowCustomInput(false);
  };

  const removeCustomDomain = (key: string) => {
    setSelectedDomains(prev => prev.filter(k => k !== key));
    setPriority(prev => prev.filter(k => k !== key));
    setDomainLabels(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const movePriority = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= priority.length) return;
    setPriority(prev => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const getDomainDisplay = (key: string) => {
    const builtin = BUILTIN_DOMAINS.find(d => d.key === key);
    if (builtin) return { label: builtin.label, icon: builtin.icon, gradient: builtin.gradient, border: builtin.border };
    return { label: domainLabels[key] || key, icon: Sparkles, gradient: CUSTOM_GRADIENT, border: CUSTOM_BORDER };
  };

  const handleFinish = () => {
    onComplete({
      domains: selectedDomains,
      domain_priority: priority,
      domain_labels: domainLabels,
      notifications_pref: noisePref,
      onboarding_complete: true,
    });
  };

  return (
    <div className="min-h-screen pf-app-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-xl">PF</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Set up your workspace</h1>
          <p className="text-muted-foreground mt-1 text-sm">Step {step + 1} of 3</p>
        </div>

        <div className="flex gap-2 mb-8 max-w-xs mx-auto">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-all duration-300"
              style={{
                background: i <= step
                  ? 'linear-gradient(90deg, hsl(171 62% 48%), hsl(209 100% 67%))'
                  : 'rgba(100,116,139,0.18)',
              }}
            />
          ))}
        </div>

        <div className="pf-glass p-8">
          {/* Step 1 */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">
                What areas do you want PracticeFlow to help you run?
              </h2>
              <div className="space-y-3">
                {/* Built-in domains */}
                {BUILTIN_DOMAINS.map(opt => {
                  const selected = selectedDomains.includes(opt.key);
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => toggleDomain(opt.key)}
                      className="w-full text-left rounded-2xl p-5 transition-all duration-200 group"
                      style={{
                        background: opt.gradient,
                        border: `2px solid ${selected ? opt.borderSelected : opt.border}`,
                        boxShadow: selected
                          ? `0 0 0 2px ${opt.borderSelected}, 0 12px 30px rgba(17,24,39,0.08)`
                          : '0 12px 30px rgba(17,24,39,0.05)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{opt.label}</span>
                            {opt.required && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">Required</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{opt.description}</p>
                        </div>
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all"
                          style={{
                            background: selected ? 'hsl(171 62% 48%)' : 'rgba(255,255,255,0.5)',
                            border: selected ? 'none' : '2px solid rgba(100,116,139,0.3)',
                          }}
                        >
                          {selected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Custom domains already added */}
                {customDomains.map(key => (
                  <div
                    key={key}
                    className="w-full text-left rounded-2xl p-5 transition-all duration-200"
                    style={{
                      background: CUSTOM_GRADIENT,
                      border: `2px solid ${CUSTOM_BORDER_SELECTED}`,
                      boxShadow: `0 0 0 2px ${CUSTOM_BORDER_SELECTED}, 0 12px 30px rgba(17,24,39,0.08)`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-foreground">{domainLabels[key]}</span>
                        <p className="text-sm text-muted-foreground">Custom area</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCustomDomain(key)}
                        className="pf-btn pf-btn-slate !p-2 !rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add custom input */}
                {canAddCustom && !showCustomInput && (
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(true)}
                    className="pf-btn pf-btn-blue w-full flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add another area
                  </button>
                )}
                {showCustomInput && (
                  <div className="flex gap-2">
                    <Input
                      value={customInput}
                      onChange={e => setCustomInput(e.target.value)}
                      placeholder="e.g. Podcast, Side Business"
                      className="flex-1"
                      autoFocus
                      onKeyDown={e => { if (e.key === 'Enter') addCustomDomain(); }}
                    />
                    <button type="button" onClick={addCustomDomain} disabled={!customInput.trim()} className="pf-btn pf-btn-teal disabled:opacity-40">
                      Add
                    </button>
                    <button type="button" onClick={() => { setShowCustomInput(false); setCustomInput(''); }} className="pf-btn pf-btn-slate">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className="pt-2 flex justify-end">
                <button type="button" onClick={() => setStep(1)} className="pf-btn pf-btn-teal flex items-center gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Priority */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">What matters most right now?</h2>
              <p className="text-sm text-muted-foreground">Reorder your priorities — the top item gets the most attention.</p>
              <div className="space-y-2">
                {priority.map((key, idx) => {
                  const display = getDomainDisplay(key);
                  const Icon = display.icon;
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 rounded-2xl p-4"
                      style={{ background: display.gradient, border: `1px solid ${display.border}` }}
                    >
                      <span className="text-sm font-bold text-muted-foreground w-5 text-center">{idx + 1}</span>
                      <div className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-foreground" />
                      </div>
                      <span className="flex-1 font-semibold text-foreground text-sm">{display.label}</span>
                      <div className="flex flex-col gap-0.5">
                        <button type="button" onClick={() => movePriority(idx, -1)} disabled={idx === 0} className="pf-btn pf-btn-slate !p-1 !rounded-lg disabled:opacity-30">
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => movePriority(idx, 1)} disabled={idx === priority.length - 1} className="pf-btn pf-btn-slate !p-1 !rounded-lg disabled:opacity-30">
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-2 flex justify-between">
                <button type="button" onClick={() => setStep(0)} className="pf-btn pf-btn-back">← Back</button>
                <button type="button" onClick={() => setStep(2)} className="pf-btn pf-btn-teal flex items-center gap-2">Next <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* Step 3: Notifications */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground">How noisy do you want reminders?</h2>
              <div className="space-y-3">
                {NOISE_OPTIONS.map(opt => {
                  const selected = noisePref === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setNoisePref(opt.key)}
                      className="w-full text-left rounded-2xl p-5 transition-all duration-200"
                      style={{
                        background: selected ? 'linear-gradient(135deg, rgba(47,198,180,0.25), rgba(91,183,255,0.20))' : 'rgba(255,255,255,0.4)',
                        border: selected ? '2px solid rgba(47,198,180,0.60)' : '2px solid rgba(255,255,255,0.45)',
                        boxShadow: selected ? '0 0 0 1px rgba(47,198,180,0.30)' : 'none',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all" style={{ background: selected ? 'hsl(171 62% 48%)' : 'rgba(255,255,255,0.5)', border: selected ? 'none' : '2px solid rgba(100,116,139,0.3)' }}>
                          {selected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">{opt.label}</span>
                          <p className="text-sm text-muted-foreground">{opt.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="pt-2 flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="pf-btn pf-btn-back">← Back</button>
                <button type="button" onClick={handleFinish} className="pf-btn pf-btn-teal flex items-center gap-2">Finish Setup <Check className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerOnboarding;

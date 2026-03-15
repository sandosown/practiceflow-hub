import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { ArrowLeft, ClipboardList, MessageSquare, LayoutDashboard, Users, Briefcase, FileText, DollarSign, CreditCard, Package, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cardStyle, cardHoverStyle, iconSquareStyle } from '@/lib/cardStyle';
import BottomNavBar from '@/components/BottomNavBar';
import { useSessionData, useSession } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

const SIGNALS = [
  { type: 'LICENSE EXPIRING', name: 'James Rivera, LCSW', detail: '14 days remaining', accent: '#d97706' },
  { type: 'LP VERIFICATION OVERDUE', name: 'Priya Patel', detail: 'Due 3 days ago', accent: '#ea580c' },
  { type: 'UNASSIGNED REFERRAL', name: 'New referral from Austin Health', detail: 'Awaiting assignment', accent: '#0ea5e9' },
  { type: 'DISCHARGE DEADLINE', name: 'Maria Gonzalez', detail: 'Due tomorrow', accent: '#7c3aed' },
  { type: 'ONBOARDING STUCK', name: 'Alex Nguyen (Business Intern)', detail: 'Step 2 of 4', accent: '#3b82f6' },
  { type: 'MISSING CREDENTIALS', name: 'Dr. Angela Torres', detail: 'NPI # missing', accent: '#78716c' },
];

const ALL_MODULES = [
  { id: 'charts', label: 'Charts Requiring Action', icon: ClipboardList, subtitle: 'Treatment plans needing review', path: '/dashboard/partner/group-practice/charts', accent: '#d97706' },
  { id: 'message-board', label: 'Message Board', icon: MessageSquare, subtitle: 'Announcements, updates & resources', path: '/dashboard/partner/group-practice/office-board', accent: '#0ea5e9' },
  { id: 'management', label: 'Management Center', icon: LayoutDashboard, subtitle: 'Staff, operations & oversight', path: '/dashboard/partner/group-practice/management', accent: '#7c3aed' },
  { id: 'clients', label: 'Client Database', icon: Users, subtitle: 'Client records & status', path: '/dashboard/partner/group-practice/clients', accent: '#0d9488' },
  { id: 'caseload', label: 'Referral Pipeline', icon: Briefcase, subtitle: 'Referral intake to assignment.', path: '/dashboard/partner/group-practice/caseload', accent: '#0ea5e9' },
  { id: 'treatment', label: 'Treatment Plan Tracker', icon: FileText, subtitle: 'Plan cycles & reviews', path: '/dashboard/partner/group-practice/treatment', accent: '#059669' },
  { id: 'finance', label: 'Finance', icon: DollarSign, subtitle: 'Income, expenses & practice health.', path: '/dashboard/partner/group-practice/finance', accent: '#059669' },
  { id: 'insurance', label: 'Insurance Database', icon: CreditCard, subtitle: 'Payers & coverage', path: '/dashboard/partner/group-practice/insurance', accent: '#78716c' },
  { id: 'vendors', label: 'Vendor Database', icon: Package, subtitle: 'Vendor contacts & contracts', path: '/dashboard/partner/group-practice/vendors', accent: '#92764a' },
  { id: 'major-moments', label: 'Major Moments', icon: Sparkles, subtitle: 'Milestones & celebrations', path: '/dashboard/partner/group-practice/major-moments', accent: '#f59e0b' },
];

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0,2),16)},${parseInt(h.substring(2,4),16)},${parseInt(h.substring(4,6),16)}`;
}

const TEAL = '#2dd4bf';
const STORAGE_KEY = 'pf_partner_hidden_modules';

const CustomizeViewModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hiddenModules: string[];
  onSave: (hidden: string[]) => void;
}> = ({ open, onOpenChange, hiddenModules, onSave }) => {
  const [localHidden, setLocalHidden] = useState<string[]>(hiddenModules);

  useEffect(() => {
    if (open) setLocalHidden(hiddenModules);
  }, [open, hiddenModules]);

  const toggle = (id: string) => {
    setLocalHidden(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSave = () => {
    onSave(localHidden);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">Customize My View</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Choose which modules appear on your dashboard.</p>
        <div className="space-y-3 pt-2">
          {ALL_MODULES.map(m => {
            const isVisible = !localHidden.includes(m.id);
            return (
              <div key={m.id} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-foreground">{m.label}</span>
                <Switch checked={isVisible} onCheckedChange={() => toggle(m.id)} />
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 pt-3">
          <button
            onClick={handleSave}
            className="text-sm font-semibold px-4 py-2 rounded-md"
            style={{ color: TEAL, border: `1px solid ${TEAL}`, background: 'transparent' }}
          >
            Save
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="text-sm text-muted-foreground px-4 py-2 rounded-md hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PartnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const session = useSessionData();
  const { isDemoMode } = useSession();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [hiddenModules, setHiddenModules] = useState<string[]>([]);

  const rawFirst = session.full_name?.split(' ')[0] ?? '';
  const firstName = rawFirst.endsWith('.') ? rawFirst.slice(0, -1) : rawFirst;
  const displayName = session.full_name?.startsWith('Dr.') ? `Dr. ${session.full_name.split(' ').slice(1).join(' ').split(' ')[0]}` : firstName;

  // Load preferences
  useEffect(() => {
    const load = async () => {
      if (isDemoMode) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setHiddenModules(JSON.parse(stored));
        return;
      }
      const { data } = await supabase
        .from('partner_preferences')
        .select('hidden_modules')
        .eq('user_id', session.user_id)
        .eq('hat_id', 'w1')
        .maybeSingle();
      if (data?.hidden_modules) setHiddenModules(data.hidden_modules as string[]);
    };
    load();
  }, [isDemoMode, session.user_id]);

  const handleSavePreferences = useCallback(async (hidden: string[]) => {
    setHiddenModules(hidden);
    if (isDemoMode) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hidden));
      return;
    }
    await supabase
      .from('partner_preferences')
      .upsert(
        { user_id: session.user_id, hat_id: 'w1', hidden_modules: hidden, updated_at: new Date().toISOString() } as any,
        { onConflict: 'user_id,hat_id' }
      );
  }, [isDemoMode, session.user_id]);

  const visibleModules = ALL_MODULES.filter(m => !hiddenModules.includes(m.id));

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <div className="max-w-5xl mx-auto px-6 py-6 pb-20">


        {/* Contextual greeting */}
        <div style={{
          background: 'hsl(var(--card))',
          borderRadius: 12,
          borderLeft: '4px solid #2dd4bf',
          borderTop: '1px solid rgba(45,212,191,0.25)',
          borderBottom: '1px solid rgba(45,212,191,0.25)',
          borderRight: '1px solid rgba(45,212,191,0.15)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          width: 'fit-content',
          whiteSpace: 'nowrap',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: 16,
        }}>
          {(() => {
            const h = new Date().getHours();
            const greeting = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
            const count = SIGNALS.length;
            const signalText = count === 0
              ? 'no signals requiring your attention.'
              : `${count} signal${count !== 1 ? 's' : ''} requiring your attention.`;
            return (
              <p style={{ color: 'hsl(var(--foreground))', fontSize: 16, fontWeight: 400, margin: 0 }}>
                {`${greeting}, ${displayName}. `}
                <span style={{ color: '#94a3b8' }}>—</span>
                {" You currently have "}
                <span style={{ color: '#2dd4bf', fontWeight: 600 }}>{signalText}</span>
              </p>
            );
          })()}
        </div>

        {/* Radar */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 pl-3 text-foreground border-l-4 border-primary">
            RADAR
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {SIGNALS.map((s, i) => (
              <div
                key={i}
                className="p-4 space-y-2 flex-shrink-0"
                style={{ ...cardStyle(s.accent), minWidth: 260 }}
              >
                <span className="font-bold tracking-wider uppercase" style={{ fontSize: 11, color: s.accent }}>{s.type}</span>
                <p className="font-bold text-base text-foreground">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.detail}</p>
                <button
                  className="h-7 text-xs font-semibold px-3 rounded-full mt-1"
                  style={{ background: 'transparent', color: s.accent, border: `1px solid rgba(${hexToRgb(s.accent)},0.45)` }}
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Module grid header with Customize button */}
        <div className="flex items-center justify-between mb-4">
          <div /> {/* spacer */}
          <button
            onClick={() => setCustomizeOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors hover:bg-white/5"
            style={{ color: TEAL, border: `1px solid ${TEAL}`, background: 'transparent' }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Customize My View
          </button>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleModules.map(m => {
            const isHovered = hoveredId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => navigate(m.path)}
                onMouseEnter={() => setHoveredId(m.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="p-5 text-left flex items-start gap-4 cursor-pointer"
                style={isHovered ? cardHoverStyle(m.accent) : cardStyle(m.accent)}
              >
                <div
                  className="flex-shrink-0"
                  style={{ ...iconSquareStyle(m.accent), width: 44, height: 44 }}
                >
                  <m.icon className="w-5 h-5" style={{ color: m.accent }} />
                </div>
                <div>
                  <p className="font-semibold text-base text-foreground">{m.label}</p>
                  <p className="text-xs mt-0.5 text-muted-foreground">{m.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <BottomNavBar />
      <CustomizeViewModal
        open={customizeOpen}
        onOpenChange={setCustomizeOpen}
        hiddenModules={hiddenModules}
        onSave={handleSavePreferences}
      />
    </div>
  );
};

export default PartnerDashboard;

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import RadarCard from '@/components/RadarCard';
import OwnerActionsPanel from '@/components/practice/OwnerActionsPanel';
import PracticeSettingsSheet from '@/components/practice/PracticeSettingsSheet';
import { useAuth } from '@/context/AuthContext';
import { MOCK_REFERRALS, MOCK_USERS } from '@/data/mockData';
import { Referral, RadarBucket } from '@/types/models';
import { Circle, Pause, CalendarClock, PanelRightOpen, ArrowRightLeft, Users, MessageSquare, ClipboardList, LayoutDashboard } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { resolveOperatingProfile } from '@/lib/profile/resolveOperatingProfile';
import { interpretRadarItems, recordView, incrementDrift } from '@/lib/radar/interpretRadarItems';

function classifyBucket(r: Referral): RadarBucket {
  const today = new Date().toISOString().split('T')[0];
  const in3Days = new Date();
  in3Days.setDate(in3Days.getDate() + 3);
  const in3Str = in3Days.toISOString().split('T')[0];

  if (r.status === 'INTAKE_BLOCKED') return 'do_now';
  if (r.status === 'NEW' && r.acknowledge_by <= today) return 'do_now';
  if (r.status === 'ACKNOWLEDGED' && r.contact_by <= today) return 'do_now';
  if (r.status === 'CONTACT_IN_PROGRESS') return 'waiting';
  if (r.status === 'APPT_SCHEDULED') return 'waiting';
  if (r.status === 'NEW' && r.acknowledge_by <= in3Str) return 'coming_up';
  if (r.status === 'ACKNOWLEDGED' && r.contact_by <= in3Str) return 'coming_up';
  return 'coming_up';
}

const bucketMeta: { key: RadarBucket; label: string; icon: React.ReactNode; bucketClass: string }[] = [
  { key: 'do_now', label: 'Do Now', icon: <Circle className="w-5 h-5 text-pf-focus" />, bucketClass: 'pf-bucket pf-bucket-now' },
  { key: 'waiting', label: 'Waiting', icon: <Pause className="w-5 h-5 text-pf-waiting" />, bucketClass: 'pf-bucket pf-bucket-wait' },
  { key: 'coming_up', label: 'Coming Up', icon: <CalendarClock className="w-5 h-5 text-pf-upcoming" />, bucketClass: 'pf-bucket pf-bucket-up' },
];

const GroupPracticeRadar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwner = user?.role === 'OWNER';
  const viewerRole = isOwner ? 'owner' : 'staff';

  const operatingProfile = useMemo(() => resolveOperatingProfile(), []);

  const [referrals, setReferrals] = useState(() =>
    MOCK_REFERRALS.filter(r => r.workspace_id === 'w1')
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

  const selectedItem = referrals.find(r => r.id === selectedId) || null;
  const staffList = MOCK_USERS.filter(u => u.role !== 'OWNER');

  const handleUpdateItem = (updated: Referral) => {
    setReferrals(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const handleSelect = (id: string) => {
    setSelectedId(prev => prev === id ? null : id);
    // Owner view-relief + drift tracking
    if (isOwner && user) {
      recordView(user.id, id);
      incrementDrift(user.id, id);
    }
  };

  // Interpret items within each bucket, sorted by display_weight DESC
  const buckets = useMemo(() => {
    return bucketMeta.map(bm => {
      const bucketItems = referrals.filter(r => classifyBucket(r) === bm.key);
      const interpreted = interpretRadarItems({
        items: bucketItems,
        viewerId: user?.id ?? '',
        viewerRole,
        operatingProfile,
      });
      return {
        ...bm,
        items: interpreted.map(i => i.original),
      };
    });
  }, [referrals, user?.id, viewerRole, operatingProfile]);

  return (
    <AppLayout
      title="Group Practice Radar"
      breadcrumbs={[
        { label: 'Role Hub', path: '/hub' },
        { label: 'Group Practice Radar' },
      ]}
    >
      {/* Mobile actions trigger */}
      {isOwner && (
        <div className="flex justify-end mb-4 mt-2">
          <button
            onClick={() => setMobileActionsOpen(true)}
            className="lg:hidden pf-btn pf-btn-teal flex items-center gap-2"
          >
            <PanelRightOpen className="w-4 h-4" />
            Actions
          </button>
        </div>
      )}

      {/* Command Center Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <button
          onClick={() => navigate('/practice/transfers')}
          className="pf-glass text-left p-7 rounded-2xl group hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
          style={{ background: 'rgba(91,183,255,0.13)', borderColor: 'rgba(91,183,255,0.28)' }}
        >
          <ArrowRightLeft className="w-8 h-8 mb-3 text-pf-sky opacity-80" />
          <h3 className="text-lg font-semibold text-foreground mb-1">Referrals</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Incoming referrals & intake pipeline</p>
        </button>

        <button
          onClick={() => navigate('/practice/staff')}
          className="pf-glass text-left p-7 rounded-2xl group hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
          style={{ background: 'rgba(124,108,246,0.12)', borderColor: 'rgba(124,108,246,0.25)' }}
        >
          <Users className="w-8 h-8 mb-3 text-pf-lavender opacity-80" />
          <h3 className="text-lg font-semibold text-foreground mb-1">Team Directory</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Staff profiles & contact info</p>
        </button>

        <button
          onClick={() => navigate('/practice/comms')}
          className="pf-glass text-left p-7 rounded-2xl group hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
          style={{ background: 'rgba(47,198,180,0.12)', borderColor: 'rgba(47,198,180,0.25)' }}
        >
          <MessageSquare className="w-8 h-8 mb-3 text-pf-upcoming opacity-80" />
          <h3 className="text-lg font-semibold text-foreground mb-1">Office Board</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Announcements, updates & resources</p>
        </button>

        <button
          onClick={() => navigate('/practice/people')}
          className="pf-glass text-left p-7 rounded-2xl group hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
          style={{ background: 'rgba(153,204,153,0.14)', borderColor: 'rgba(153,204,153,0.28)' }}
        >
          <ClipboardList className="w-8 h-8 mb-3 text-pf-complete opacity-80" />
          <h3 className="text-lg font-semibold text-foreground mb-1">Charts Requiring Action</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Worker profiles & onboarding reviews</p>
        </button>

        <button
          onClick={() => navigate('/practice/ops')}
          className="pf-glass text-left p-7 rounded-2xl group hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
          style={{ background: 'rgba(100,116,139,0.11)', borderColor: 'rgba(100,116,139,0.22)' }}
        >
          <LayoutDashboard className="w-8 h-8 mb-3 text-pf-soft-slate opacity-80" />
          <h3 className="text-lg font-semibold text-foreground mb-1">Management Center</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Clients, billing, vendors & operations</p>
        </button>
      </div>

      <div className={`flex gap-6 ${isOwner ? 'flex-col lg:flex-row' : ''}`}>
        {/* Left: Radar buckets */}
        <div className={isOwner ? 'flex-1 min-w-0' : 'w-full'}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {buckets.map(bucket => (
              <div key={bucket.key} className={bucket.bucketClass}>
                <div className="flex items-center gap-2 mb-4">
                  {bucket.icon}
                  <h2 className="font-semibold text-foreground text-lg">{bucket.label}</h2>
                  <span className="text-sm text-muted-foreground">({bucket.items.length})</span>
                </div>
                <div className="space-y-3">
                  {bucket.items.length === 0 && (
                    <p className="text-sm text-muted-foreground italic p-4 pf-glass rounded-lg">No items</p>
                  )}
                  {bucket.items.map(r => (
                    <RadarCard
                      key={r.id}
                      referral={r}
                      bucket={bucket.key}
                      basePath="/practice/transfers"
                      isSelected={r.id === selectedId}
                      onSelect={isOwner ? handleSelect : undefined}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Owner Actions (desktop) */}
        {isOwner && (
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-4">
              <OwnerActionsPanel
                selectedItem={selectedItem}
                onUpdateItem={handleUpdateItem}
                staffList={staffList}
                onOpenSettings={() => setSettingsOpen(true)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Actions Sheet */}
      {isOwner && (
        <Sheet open={mobileActionsOpen} onOpenChange={setMobileActionsOpen}>
          <SheetContent side="bottom" className="pf-app-bg border-t border-white/20 rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Owner Actions</SheetTitle>
            </SheetHeader>
            <OwnerActionsPanel
              selectedItem={selectedItem}
              onUpdateItem={handleUpdateItem}
              staffList={staffList}
              onOpenSettings={() => { setMobileActionsOpen(false); setSettingsOpen(true); }}
            />
          </SheetContent>
        </Sheet>
      )}

      <PracticeSettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </AppLayout>
  );
};

export default GroupPracticeRadar;

import React from 'react';
import AppLayout from '@/components/AppLayout';
import RadarCard from '@/components/RadarCard';
import { MOCK_REFERRALS } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Referral, RadarBucket } from '@/types/models';
import { Circle, Pause, CalendarClock } from 'lucide-react';

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
  return 'coming_up';
}

const bucketMeta: { key: RadarBucket; label: string; icon: React.ReactNode; bucketClass: string }[] = [
  { key: 'do_now', label: 'Do Now', icon: <Circle className="w-5 h-5 text-pf-focus" />, bucketClass: 'pf-bucket pf-bucket-now' },
  { key: 'waiting', label: 'Waiting', icon: <Pause className="w-5 h-5 text-pf-waiting" />, bucketClass: 'pf-bucket pf-bucket-wait' },
  { key: 'coming_up', label: 'Coming Up', icon: <CalendarClock className="w-5 h-5 text-pf-upcoming" />, bucketClass: 'pf-bucket pf-bucket-up' },
];

const MyRadar: React.FC = () => {
  const { user } = useAuth();
  const referrals = MOCK_REFERRALS.filter(r => r.workspace_id === 'w1' && r.assigned_to_profile_id === user?.id);

  const buckets = bucketMeta.map(bm => ({
    ...bm,
    items: referrals.filter(r => classifyBucket(r) === bm.key),
  }));

  return (
    <AppLayout
      title="My Radar"
      breadcrumbs={[
        { label: 'Role Hub', path: '/hub' },
        { label: 'My Radar' },
      ]}
    >
      <div className="flex gap-3 mb-6 mt-2">
        <button className="pf-tab pf-tab-myradar pf-tab-active">My Radar</button>
        <a href="/practice/my-transfers" className="pf-tab pf-tab-mytransfer">My Referrals</a>
      </div>

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
                <RadarCard key={r.id} referral={r} bucket={bucket.key} basePath="/practice/transfers" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default MyRadar;

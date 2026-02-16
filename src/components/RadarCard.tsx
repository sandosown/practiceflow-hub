import React from 'react';
import { Referral, RadarBucket } from '@/types/models';
import { Circle, Pause, CalendarClock, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '@/data/mockData';

interface RadarCardProps {
  referral: Referral;
  bucket: RadarBucket;
  basePath: string;
}

const bucketConfig: Record<RadarBucket, { label: string; borderClass: string; icon: React.ReactNode; bgClass: string }> = {
  do_now: {
    label: 'Do Now',
    borderClass: 'border-l-4 border-l-pf-focus',
    bgClass: 'bg-pf-focus/[0.16]',
    icon: <Circle className="w-4 h-4 text-pf-focus" />,
  },
  waiting: {
    label: 'Waiting',
    borderClass: 'border-l-4 border-l-pf-waiting',
    bgClass: 'bg-pf-waiting/[0.18]',
    icon: <Pause className="w-4 h-4 text-pf-waiting" />,
  },
  coming_up: {
    label: 'Coming Up',
    borderClass: 'border-l-4 border-l-pf-upcoming',
    bgClass: 'bg-pf-upcoming/[0.18]',
    icon: <CalendarClock className="w-4 h-4 text-pf-upcoming" />,
  },
};

const statusLabels: Record<string, string> = {
  NEW: 'New Referral',
  ACKNOWLEDGED: 'Acknowledged',
  CONTACT_IN_PROGRESS: 'Contact In Progress',
  APPT_SCHEDULED: 'Appointment Scheduled',
  INTAKE_BLOCKED: 'Intake Blocked',
  INTAKE_READY: 'Intake Ready',
};

const RadarCard: React.FC<RadarCardProps> = ({ referral, bucket, basePath }) => {
  const navigate = useNavigate();
  const config = bucketConfig[bucket];
  const assignee = MOCK_USERS.find(u => u.id === referral.assigned_to_profile_id);

  return (
    <button
      onClick={() => navigate(`${basePath}/${referral.id}`)}
      className={`w-full text-left rounded-lg card-shadow-md p-4 ${config.borderClass} ${config.bgClass} backdrop-blur-sm hover:shadow-lg transition-all duration-200 group`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {config.icon}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{statusLabels[referral.status]}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <h3 className="font-semibold text-foreground text-lg mb-1">{referral.client_name}</h3>
      {assignee && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="w-3.5 h-3.5" />
          <span>{assignee.full_name}</span>
        </div>
      )}
      {!assignee && (
        <span className="text-sm text-pf-blocked font-medium">Unassigned</span>
      )}
      <div className="mt-2 text-xs text-muted-foreground">
        Contact by: {referral.contact_by}
      </div>
    </button>
  );
};

export default RadarCard;

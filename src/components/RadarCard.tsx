import React from 'react';
import { Referral, RadarBucket } from '@/types/models';
import { Circle, Pause, CalendarClock, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '@/data/mockData';
import { cardStyle } from '@/lib/cardStyle';

interface RadarCardProps {
  referral: Referral;
  bucket: RadarBucket;
  basePath: string;
  accent?: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const bucketConfig: Record<RadarBucket, { label: string; icon: React.ReactNode }> = {
  do_now: {
    label: 'Do Now',
    icon: <Circle className="w-4 h-4 text-pf-focus" />,
  },
  waiting: {
    label: 'Waiting',
    icon: <Pause className="w-4 h-4 text-pf-waiting" />,
  },
  coming_up: {
    label: 'Coming Up',
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

const RadarCard: React.FC<RadarCardProps> = ({ referral, bucket, basePath, accent = '#0ea5e9', isSelected, onSelect }) => {
  const navigate = useNavigate();
  const config = bucketConfig[bucket];
  const assignee = MOCK_USERS.find(u => u.id === referral.assigned_to_profile_id);

  const handleClick = () => {
    if (onSelect) {
      onSelect(referral.id);
    } else {
      navigate(`${basePath}/${referral.id}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left p-4 group ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={cardStyle(accent)}
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

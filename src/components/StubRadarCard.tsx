import React from 'react';
import { RadarBucket } from '@/types/models';
import { Circle, Pause, CalendarClock } from 'lucide-react';

interface StubRadarCardProps {
  title: string;
  detail: string;
  bucket: RadarBucket;
}

const bucketStyles: Record<RadarBucket, { cardClass: string; icon: React.ReactNode }> = {
  do_now: { cardClass: 'pf-card pf-card-now', icon: <Circle className="w-4 h-4 text-pf-focus" /> },
  waiting: { cardClass: 'pf-card pf-card-wait', icon: <Pause className="w-4 h-4 text-pf-waiting" /> },
  coming_up: { cardClass: 'pf-card pf-card-up', icon: <CalendarClock className="w-4 h-4 text-pf-upcoming" /> },
};

const StubRadarCard: React.FC<StubRadarCardProps> = ({ title, detail, bucket }) => {
  const style = bucketStyles[bucket];
  return (
    <div className={style.cardClass}>
      <div className="flex items-center gap-2 mb-2">{style.icon}<span className="text-xs uppercase font-medium text-muted-foreground tracking-wide">{bucket.replace('_', ' ')}</span></div>
      <h3 className="font-semibold text-foreground text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{detail}</p>
    </div>
  );
};

export default StubRadarCard;

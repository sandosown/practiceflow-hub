import React from 'react';
import { RadarBucket } from '@/types/models';
import { Circle, Pause, CalendarClock } from 'lucide-react';

interface StubRadarCardProps {
  title: string;
  detail: string;
  bucket: RadarBucket;
}

const bucketStyles: Record<RadarBucket, { border: string; bg: string; icon: React.ReactNode }> = {
  do_now: { border: 'border-l-4 border-l-pf-focus', bg: 'bg-pf-focus/[0.16]', icon: <Circle className="w-4 h-4 text-pf-focus" /> },
  waiting: { border: 'border-l-4 border-l-pf-waiting', bg: 'bg-pf-waiting/[0.18]', icon: <Pause className="w-4 h-4 text-pf-waiting" /> },
  coming_up: { border: 'border-l-4 border-l-pf-upcoming', bg: 'bg-pf-upcoming/[0.18]', icon: <CalendarClock className="w-4 h-4 text-pf-upcoming" /> },
};

const StubRadarCard: React.FC<StubRadarCardProps> = ({ title, detail, bucket }) => {
  const style = bucketStyles[bucket];
  return (
    <div className={`rounded-lg card-shadow-md p-4 ${style.border} ${style.bg}`}>
      <div className="flex items-center gap-2 mb-2">{style.icon}<span className="text-xs uppercase font-medium text-muted-foreground tracking-wide">{bucket.replace('_', ' ')}</span></div>
      <h3 className="font-semibold text-foreground text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{detail}</p>
    </div>
  );
};

export default StubRadarCard;

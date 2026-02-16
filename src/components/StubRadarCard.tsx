import React from 'react';
import { RadarBucket } from '@/types/models';
import { AlertTriangle, Clock, CalendarClock } from 'lucide-react';

interface StubRadarCardProps {
  title: string;
  detail: string;
  bucket: RadarBucket;
}

const bucketStyles: Record<RadarBucket, { border: string; icon: React.ReactNode }> = {
  do_now: { border: 'border-l-4 border-l-destructive', icon: <AlertTriangle className="w-4 h-4 text-destructive" /> },
  waiting: { border: 'border-l-4 border-l-warning', icon: <Clock className="w-4 h-4 text-warning" /> },
  coming_up: { border: 'border-l-4 border-l-primary', icon: <CalendarClock className="w-4 h-4 text-primary" /> },
};

const StubRadarCard: React.FC<StubRadarCardProps> = ({ title, detail, bucket }) => {
  const style = bucketStyles[bucket];
  return (
    <div className={`bg-card rounded-lg card-shadow-md p-4 ${style.border}`}>
      <div className="flex items-center gap-2 mb-2">{style.icon}<span className="text-xs uppercase font-medium text-muted-foreground tracking-wide">{bucket.replace('_', ' ')}</span></div>
      <h3 className="font-semibold text-foreground text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{detail}</p>
    </div>
  );
};

export default StubRadarCard;

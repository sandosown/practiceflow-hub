import React from 'react';
import { RadarBucket } from '@/types/models';
import { Circle, Pause, CalendarClock } from 'lucide-react';
import { cardStyle } from '@/lib/cardStyle';

interface StubRadarCardProps {
  title: string;
  detail: string;
  bucket: RadarBucket;
  accent?: string;
}

const bucketConfig: Record<RadarBucket, { icon: React.ReactNode; defaultAccent: string }> = {
  do_now: { icon: <Circle className="w-4 h-4 text-pf-focus" />, defaultAccent: '#d97706' },
  waiting: { icon: <Pause className="w-4 h-4 text-pf-waiting" />, defaultAccent: '#0ea5e9' },
  coming_up: { icon: <CalendarClock className="w-4 h-4 text-pf-upcoming" />, defaultAccent: '#059669' },
};

const StubRadarCard: React.FC<StubRadarCardProps> = ({ title, detail, bucket, accent }) => {
  const config = bucketConfig[bucket];
  const color = accent ?? config.defaultAccent;
  return (
    <div className="p-4" style={cardStyle(color)}>
      <div className="flex items-center gap-2 mb-2">{config.icon}<span className="text-xs uppercase font-medium text-muted-foreground tracking-wide">{bucket.replace('_', ' ')}</span></div>
      <h3 className="font-semibold text-foreground text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{detail}</p>
    </div>
  );
};

export default StubRadarCard;

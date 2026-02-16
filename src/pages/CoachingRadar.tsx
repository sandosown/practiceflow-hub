import React from 'react';
import AppLayout from '@/components/AppLayout';
import StubRadarCard from '@/components/StubRadarCard';
import { COACHING_STUB_CARDS } from '@/data/mockData';

const CoachingRadar: React.FC = () => {
  return (
    <AppLayout
      title="Coaching Business"
      breadcrumbs={[
        { label: 'Role Hub', path: '/hub' },
        { label: 'Coaching Business' },
      ]}
    >
      <p className="text-muted-foreground mb-6">This workspace is coming soon. Here's a preview of what your coaching radar will look like.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
        {COACHING_STUB_CARDS.map(card => (
          <StubRadarCard key={card.id} title={card.title} detail={card.detail} bucket={card.bucket} />
        ))}
      </div>
    </AppLayout>
  );
};

export default CoachingRadar;

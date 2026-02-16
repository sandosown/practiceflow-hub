import React from 'react';
import AppLayout from '@/components/AppLayout';
import StubRadarCard from '@/components/StubRadarCard';
import { HOME_STUB_CARDS } from '@/data/mockData';

const HomeRadar: React.FC = () => {
  return (
    <AppLayout
      title="Home"
      breadcrumbs={[
        { label: 'Role Hub', path: '/hub' },
        { label: 'Home' },
      ]}
    >
      <p className="text-muted-foreground mb-6">Your household radar — maintenance, insurance, and more. Full features coming soon.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        {HOME_STUB_CARDS.map(card => (
          <StubRadarCard key={card.id} title={card.title} detail={card.detail} bucket={card.bucket} />
        ))}
      </div>
    </AppLayout>
  );
};

export default HomeRadar;

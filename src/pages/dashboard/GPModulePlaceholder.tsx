import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cardStyle } from '@/lib/cardStyle';

// Map module id to accent color
const MODULE_ACCENTS: Record<string, string> = {
  'Charts Requiring Action': '#d97706',
  'Office Board': '#0ea5e9',
  'Management Center': '#7c3aed',
  'Client Database': '#0d9488',
  'Referral Pipeline': '#0ea5e9',
  'Finance Tab': '#059669',
  'Treatment Plan Tracker': '#059669',
  'Supervision Structure': '#4f46e5',
  'Insurance Database': '#78716c',
  'Vendor Database': '#92764a',
};

interface Props {
  title: string;
}

const GPModulePlaceholder: React.FC<Props> = ({ title }) => {
  const navigate = useNavigate();
  const accent = MODULE_ACCENTS[title] ?? '#2dd4bf';

  return (
    <div className="min-h-screen" style={{ background: '#0a1628' }}>
      <TopNavBar />
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1
            className="text-2xl font-bold pl-3"
            style={{ color: '#f1f5f9', borderLeft: `4px solid ${accent}` }}
          >
            {title}
          </h1>
        </div>

        <div className="p-8 text-center" style={cardStyle(accent)}>
          <p style={{ color: '#64748b' }}>Coming in Phase 5</p>
        </div>
      </div>
    </div>
  );
};

export default GPModulePlaceholder;

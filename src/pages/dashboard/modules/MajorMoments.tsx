import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { ArrowLeft, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cardStyle } from '@/lib/cardStyle';

const ACCENT = '#a78bfa';

const georgia: React.CSSProperties = { fontFamily: 'Georgia, serif' };

function momentCard(accent: string): React.CSSProperties {
  return { ...cardStyle(accent), borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' };
}

interface Moment {
  year: string;
  title: string;
  description: string;
  date?: string;
}

const ON_THIS_DAY: Moment[] = [
  { year: '2024', title: 'Hired First Clinician', description: 'James Rivera LCSW joined the practice.', date: 'March 14, 2024' },
  { year: '2023', title: 'First Client', description: 'Clarity Counseling Group welcomed its first client.', date: 'March 14, 2023' },
  { year: '2022', title: 'Practice Founded', description: 'Clarity Counseling Group was established.', date: 'March 14, 2022' },
];

const MORE_MOMENTS: Moment[] = [
  { year: 'Dec 2025', title: 'License Approved', description: 'James Rivera LCSW renewed state license.' },
  { year: 'Oct 2025', title: 'Certification Earned', description: 'Dr. Angela Torres completed trauma certification.' },
  { year: 'Jun 2025', title: 'Team Milestone', description: 'Practice reached 5 active clinicians.' },
];

const MajorMoments: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [bannerVisible, setBannerVisible] = useState(true);
  const q = search.toLowerCase();

  const filter = (items: Moment[]) =>
    items.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.year.toLowerCase().includes(q) ||
        (m.date?.toLowerCase().includes(q) ?? false)
    );

  const renderMomentCard = (m: Moment, i: number) => (
    <div key={i} className="p-5" style={momentCard(ACCENT)}>
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{m.year}</p>
      <p className="text-base font-semibold text-foreground mb-1" style={{ ...georgia, fontSize: 16 }}>{m.title}</p>
      <p className="text-xs text-muted-foreground">{m.description}</p>
      {m.date && <p className="text-xs text-muted-foreground mt-2" style={georgia}>{m.date}</p>}
    </div>
  );

  const filteredOnThisDay = filter(ON_THIS_DAY);
  const filteredMore = filter(MORE_MOMENTS);

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />

      <div className="max-w-5xl mx-auto px-6 py-6 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          </Button>
          <h1
            className="text-2xl font-bold text-foreground pl-3"
            style={{ ...georgia, borderLeft: `4px solid ${ACCENT}` }}
          >
            Major Moments
          </h1>
        </div>
        <p className="text-muted-foreground text-sm mb-6 ml-[52px]">Your milestones and achievements.</p>

        {/* Reflection Banner */}
        {bannerVisible && (
          <div
            className="relative mb-8 p-4 rounded-lg"
            style={{
              borderLeft: `4px solid ${ACCENT}`,
              background: 'rgba(167,139,250,0.08)',
            }}
          >
            <button
              onClick={() => setBannerVisible(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-sm text-foreground" style={georgia}>On this day you hired your first clinician.</p>
            <button className="text-xs font-semibold mt-1" style={{ color: ACCENT }}>
              See more in your Major Moments →
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by keyword, date, or person..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* ON THIS DAY */}
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground"
            style={{ borderLeft: `4px solid ${ACCENT}` }}
          >
            ON THIS DAY
          </h2>
          <div className="flex flex-col gap-4 max-w-[600px] mx-auto">
            {filteredOnThisDay.length === 0 && (
              <p className="text-sm text-muted-foreground pl-3">No matching moments.</p>
            )}
            {filteredOnThisDay.map(renderMomentCard)}
          </div>
        </section>

        {/* SEE MORE MOMENTS */}
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground"
            style={{ borderLeft: `4px solid ${ACCENT}` }}
          >
            SEE MORE MOMENTS
          </h2>
          <div className="flex flex-col gap-4 max-w-[600px] mx-auto">
            {filteredMore.length === 0 && (
              <p className="text-sm text-muted-foreground pl-3">No matching moments.</p>
            )}
            {filteredMore.map(renderMomentCard)}
          </div>
        </section>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default MajorMoments;

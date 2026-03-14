import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useSessionData } from '@/context/SessionContext';

const ACCENT = '#2dd4bf';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2
    className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 pl-3"
    style={{ borderLeft: `4px solid ${ACCENT}` }}
  >
    {title}
  </h2>
);

const FieldRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
    <span className="text-sm font-medium text-foreground">{label}</span>
    <div className="flex items-center gap-2">{children}</div>
  </div>
);

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const session = useSessionData();

  const [name, setName] = useState(session.full_name ?? '');
  const [email, setEmail] = useState(session.email ?? '');
  const [practiceName, setPracticeName] = useState(session.workspace_name ?? 'Clarity Counseling Group');
  const [notificationIntensity, setNotificationIntensity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [radarDensity, setRadarDensity] = useState<'Compact' | 'Comfortable'>('Comfortable');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const intensityOptions = ['LOW', 'MEDIUM', 'HIGH'] as const;
  const densityOptions = ['Compact', 'Comfortable'] as const;

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <div className="max-w-2xl mx-auto px-6 py-6 pb-20">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>

        {/* ACCOUNT */}
        <section className="mb-8">
          <SectionHeader title="Account" />
          <div className="rounded-xl bg-card p-4">
            <FieldRow label="Name">
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-48 text-right text-sm h-8"
              />
            </FieldRow>
            <FieldRow label="Email">
              <Input
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-48 text-right text-sm h-8"
              />
            </FieldRow>
            <FieldRow label="Password">
              <button
                className="text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                style={{ color: ACCENT, border: `1px solid ${ACCENT}`, background: 'transparent' }}
              >
                Change Password
              </button>
            </FieldRow>
          </div>
        </section>

        {/* WORKSPACE */}
        <section className="mb-8">
          <SectionHeader title="Workspace" />
          <div className="rounded-xl bg-card p-4">
            <FieldRow label="Practice Name">
              <Input
                value={practiceName}
                onChange={e => setPracticeName(e.target.value)}
                className="w-56 text-right text-sm h-8"
              />
            </FieldRow>
            <FieldRow label="Logo">
              <button
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                style={{ color: ACCENT, border: `1px solid ${ACCENT}`, background: 'transparent' }}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </button>
            </FieldRow>
            <FieldRow label="Notification Intensity">
              <div className="flex rounded-lg overflow-hidden border border-border">
                {intensityOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setNotificationIntensity(opt)}
                    className="text-xs font-semibold px-3 py-1.5 transition-colors"
                    style={{
                      background: notificationIntensity === opt ? ACCENT : 'transparent',
                      color: notificationIntensity === opt ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </FieldRow>
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="mb-8">
          <SectionHeader title="Preferences" />
          <div className="rounded-xl bg-card p-4">
            <FieldRow label="Dark Mode">
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </FieldRow>
            <FieldRow label="Radar Density">
              <div className="flex rounded-lg overflow-hidden border border-border">
                {densityOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setRadarDensity(opt)}
                    className="text-xs font-semibold px-3 py-1.5 transition-colors"
                    style={{
                      background: radarDensity === opt ? ACCENT : 'transparent',
                      color: radarDensity === opt ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </FieldRow>
          </div>
        </section>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default Settings;
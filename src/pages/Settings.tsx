import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { ArrowLeft, Upload, Plus, Edit2, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSessionData, useSession } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ACCENT = '#2dd4bf';
const LOCATION_TYPES = ['Office', 'Studio', 'Clinic', 'Venue', 'Home', 'Other'];

interface SavedLocation {
  location_id: string;
  hat_id: string;
  name: string;
  address: string | null;
  type: string;
  is_active: boolean;
}

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
  const { setThemePreference } = useSession();
  const session = useSessionData();
  const role = session.role;
  const canManageLocations = role === 'OWNER' || role === 'ADMIN';

  const [name, setName] = useState(session.full_name ?? '');
  const [email, setEmail] = useState(session.email ?? '');
  const [practiceName, setPracticeName] = useState(session.workspace_name ?? 'Clarity Counseling Group');
  const [notificationIntensity, setNotificationIntensity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const darkMode = session.theme_preference === 'dark';
  const [radarDensity, setRadarDensity] = useState<'Compact' | 'Comfortable'>('Comfortable');

  // LOG-103: Location management
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [addingLocation, setAddingLocation] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [locName, setLocName] = useState('');
  const [locAddress, setLocAddress] = useState('');
  const [locType, setLocType] = useState('Office');

  useEffect(() => {
    if (!canManageLocations) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('hat_locations')
        .select('*')
        .eq('hat_id', 'w1')
        .order('name');
      if (data) setLocations(data as unknown as SavedLocation[]);
    };
    fetch();
  }, [canManageLocations]);

  const handleSaveLocation = async () => {
    const n = locName.trim();
    if (!n) return;
    if (editingId) {
      const { error } = await supabase
        .from('hat_locations')
        .update({ name: n, address: locAddress.trim() || null, type: locType.toLowerCase() })
        .eq('location_id', editingId);
      if (!error) {
        setLocations(prev => prev.map(l => l.location_id === editingId ? { ...l, name: n, address: locAddress.trim() || null, type: locType.toLowerCase() } : l));
        toast({ title: 'Location updated' });
      }
    } else {
      const { data, error } = await supabase
        .from('hat_locations')
        .insert({ hat_id: 'w1', name: n, address: locAddress.trim() || null, type: locType.toLowerCase(), created_by: session.user_id })
        .select()
        .single();
      if (!error && data) {
        setLocations(prev => [...prev, data as unknown as SavedLocation]);
        toast({ title: 'Location added' });
      }
    }
    resetLocForm();
  };

  const handleDeactivate = async (loc: SavedLocation) => {
    const newActive = !loc.is_active;
    const { error } = await supabase
      .from('hat_locations')
      .update({ is_active: newActive })
      .eq('location_id', loc.location_id);
    if (!error) {
      setLocations(prev => prev.map(l => l.location_id === loc.location_id ? { ...l, is_active: newActive } : l));
      toast({ title: newActive ? 'Location reactivated' : 'Location deactivated' });
    }
  };

  const startEdit = (loc: SavedLocation) => {
    setEditingId(loc.location_id);
    setLocName(loc.name);
    setLocAddress(loc.address ?? '');
    setLocType(loc.type.charAt(0).toUpperCase() + loc.type.slice(1));
    setAddingLocation(true);
  };

  const resetLocForm = () => {
    setAddingLocation(false);
    setEditingId(null);
    setLocName('');
    setLocAddress('');
    setLocType('Office');
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setThemePreference(checked ? 'dark' : 'light');
  };

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
                className="text-xs font-semibold px-3 py-1.5 rounded-md"
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

        {/* LOCATIONS — LOG-103 (Owner/Admin only) */}
        {canManageLocations && (
          <section className="mb-8">
            <SectionHeader title="Locations" />
            <div className="rounded-xl bg-card p-4">
              {/* Location list */}
              {locations.length > 0 ? (
                <div className="space-y-0">
                  {locations.map(loc => (
                    <div
                      key={loc.location_id}
                      className={`flex items-center justify-between py-3 border-b border-border last:border-b-0 ${!loc.is_active ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MapPin size={14} className="text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{loc.name}</p>
                          <div className="flex items-center gap-2">
                            {loc.address && (
                              <p className="text-[11px] text-muted-foreground truncate">{loc.address}</p>
                            )}
                            <span className="text-[10px] text-muted-foreground capitalize px-1.5 py-0.5 rounded border border-border">
                              {loc.type}
                            </span>
                            {!loc.is_active && (
                              <span className="text-[10px] text-muted-foreground italic">Inactive</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => startEdit(loc)}
                          className="p-1.5 rounded-md hover:bg-accent/10 transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeactivate(loc)}
                          className="p-1.5 rounded-md hover:bg-accent/10 transition-colors text-muted-foreground hover:text-foreground"
                          title={loc.is_active ? 'Deactivate' : 'Reactivate'}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No saved locations yet.</p>
              )}

              {/* Add / Edit form */}
              {addingLocation ? (
                <div className="mt-3 space-y-2 rounded-lg border border-border p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {editingId ? 'Edit Location' : 'New Location'}
                  </p>
                  <Input
                    value={locName}
                    onChange={e => setLocName(e.target.value)}
                    placeholder="Location name *"
                    className="text-sm"
                    autoFocus
                  />
                  <Input
                    value={locAddress}
                    onChange={e => setLocAddress(e.target.value)}
                    placeholder="Address (optional)"
                    className="text-sm"
                  />
                  <Select value={locType} onValueChange={setLocType}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATION_TYPES.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveLocation}
                      disabled={!locName.trim()}
                      className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-40"
                      style={{ border: `1px solid ${ACCENT}`, color: ACCENT, background: 'transparent' }}
                    >
                      {editingId ? 'Save' : 'Add'}
                    </button>
                    <button
                      onClick={resetLocForm}
                      className="px-3 py-1.5 text-muted-foreground text-xs border border-border rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingLocation(true)}
                  className="mt-3 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                  style={{ color: ACCENT, border: `1px solid ${ACCENT}`, background: 'transparent' }}
                >
                  <Plus size={13} /> Add Location
                </button>
              )}
            </div>
          </section>
        )}

        {/* PREFERENCES */}
        <section className="mb-8">
          <SectionHeader title="Preferences" />
          <div className="rounded-xl bg-card p-4">
            <FieldRow label="Dark Mode">
              <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
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

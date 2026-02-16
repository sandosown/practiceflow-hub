import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProfileSetup: React.FC = () => {
  const { user, completeProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    notifications: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeProfile();
    navigate('/hub');
  };

  return (
    <div className="min-h-screen pf-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">Let's get you set up, {user?.full_name?.split(' ')[0]}</p>
        </div>

        <div className="glass-panel rounded-xl card-shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Full Name</Label>
              <Input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled className="mt-1 opacity-60" />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.notifications}
                onChange={e => setForm(p => ({ ...p, notifications: e.target.checked }))}
                className="rounded border-border"
              />
              <Label>Enable in-app notifications</Label>
            </div>
            <Button type="submit" className="w-full">Continue to Role Hub</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;

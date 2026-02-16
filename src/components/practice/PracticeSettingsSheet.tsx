import React from 'react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { Users, Route, Clock, Bell } from 'lucide-react';

interface PracticeSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sections = [
  {
    icon: <Users className="w-5 h-5 text-pf-upcoming" />,
    title: 'Team',
    description: 'Manage clinicians, interns, and their availability.',
    placeholder: 'Invite new staff member',
  },
  {
    icon: <Route className="w-5 h-5 text-pf-focus" />,
    title: 'Routing Rules',
    description: 'Automatically assign referrals based on specialty, availability, or round-robin.',
    placeholder: 'Default routing: Round Robin',
  },
  {
    icon: <Clock className="w-5 h-5 text-pf-info" />,
    title: 'Deadlines',
    description: 'Set acknowledge and contact deadlines for new referrals.',
    placeholder: 'Acknowledge within: 24 hours',
  },
  {
    icon: <Bell className="w-5 h-5 text-pf-waiting" />,
    title: 'Notifications',
    description: 'Configure how and when your team gets alerted.',
    placeholder: 'Email digest: Daily',
  },
];

const PracticeSettingsSheet: React.FC<PracticeSettingsSheetProps> = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="pf-app-bg border-l border-white/20 w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Practice Settings</SheetTitle>
          <SheetDescription>Configure your group practice preferences.</SheetDescription>
        </SheetHeader>

        <div className="space-y-5">
          {sections.map(s => (
            <div key={s.title} className="pf-glass p-4 space-y-2">
              <div className="flex items-center gap-2">
                {s.icon}
                <h3 className="font-semibold text-foreground">{s.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{s.description}</p>
              <div className="text-sm rounded-xl border border-white/40 bg-white/40 px-3 py-2 text-muted-foreground backdrop-blur-sm">
                {s.placeholder}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PracticeSettingsSheet;

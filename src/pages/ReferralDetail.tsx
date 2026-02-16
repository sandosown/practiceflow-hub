import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import IntakeChecklist from '@/components/IntakeChecklist';
import { MOCK_REFERRALS, MOCK_USERS, MOCK_CHECKLISTS } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ReferralChecklist, ReferralStatus } from '@/types/models';
import { Phone, Mail, Calendar, ArrowLeft } from 'lucide-react';

const statusFlow: ReferralStatus[] = ['NEW', 'ACKNOWLEDGED', 'CONTACT_IN_PROGRESS', 'APPT_SCHEDULED', 'INTAKE_BLOCKED', 'INTAKE_READY'];

const ReferralDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const referral = MOCK_REFERRALS.find(r => r.id === id);
  const [status, setStatus] = useState<ReferralStatus>(referral?.status || 'NEW');
  const [checklist, setChecklist] = useState<ReferralChecklist>(
    MOCK_CHECKLISTS[id || ''] || {
      referral_id: id || '',
      ack_done: false,
      contact_outcome: null,
      intake_ack_signed_in_ehr: false,
      intake_missing_payment_auth: false,
      intake_missing_consent: false,
      intake_missing_privacy: false,
    }
  );
  const [notification, setNotification] = useState<string | null>(null);

  if (!referral) {
    return <AppLayout title="Not Found"><p className="text-muted-foreground">Referral not found.</p></AppLayout>;
  }

  const assignee = MOCK_USERS.find(u => u.id === referral.assigned_to_profile_id);
  const isOwner = user?.role === 'OWNER';

  const handleAcknowledge = () => {
    setStatus('ACKNOWLEDGED');
    setChecklist(prev => ({ ...prev, ack_done: true }));
    setNotification('✓ Referral acknowledged — owner has been notified.');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleContactOutcome = (outcome: 'SCHEDULED' | 'PENDING' | 'NO_CONTACT') => {
    setChecklist(prev => ({ ...prev, contact_outcome: outcome }));
    if (outcome === 'SCHEDULED') {
      setStatus('APPT_SCHEDULED');
    } else {
      setStatus('CONTACT_IN_PROGRESS');
    }
  };

  const nextAction = () => {
    if (status === 'NEW') return { label: 'Acknowledge Referral', action: handleAcknowledge };
    if (status === 'ACKNOWLEDGED') return { label: 'Record Contact Outcome', action: () => setStatus('CONTACT_IN_PROGRESS') };
    return null;
  };

  const action = nextAction();

  return (
    <AppLayout
      title={referral.client_name}
      breadcrumbs={[
        { label: 'Role Hub', path: '/hub' },
        { label: 'Transfer Portal', path: isOwner ? '/practice/transfers' : '/practice/my-transfers' },
        { label: referral.client_name },
      ]}
    >
      {notification && (
        <div className="mb-4 p-3 rounded-lg bg-success/10 text-success text-sm font-medium animate-fade-in">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-xl card-shadow-md p-6">
            <h2 className="font-semibold text-foreground text-lg mb-4">Client Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{referral.client_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground">{referral.client_phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Contact By</p>
                  <p className="text-sm text-foreground">{referral.contact_by}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Assigned To</p>
                <p className="text-sm text-foreground">{assignee?.full_name || 'Unassigned'}</p>
              </div>
            </div>
          </div>

          {/* Status tracker */}
          <div className="bg-card rounded-xl card-shadow-md p-6">
            <h2 className="font-semibold text-foreground text-lg mb-4">Referral Progress</h2>
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {statusFlow.map((s, i) => {
                const isActive = statusFlow.indexOf(status) >= i;
                return (
                  <React.Fragment key={s}>
                    <div className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {s.replace(/_/g, ' ')}
                    </div>
                    {i < statusFlow.length - 1 && <div className={`w-4 h-0.5 flex-shrink-0 ${isActive ? 'bg-primary' : 'bg-border'}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Contact outcome */}
          {(status === 'ACKNOWLEDGED' || status === 'CONTACT_IN_PROGRESS') && (
            <div className="bg-card rounded-xl card-shadow-md p-6">
              <h2 className="font-semibold text-foreground text-lg mb-4">Contact Outcome</h2>
              <div className="flex gap-3 flex-wrap">
                {(['SCHEDULED', 'PENDING', 'NO_CONTACT'] as const).map(outcome => (
                  <Button
                    key={outcome}
                    variant={checklist.contact_outcome === outcome ? 'default' : 'outline'}
                    onClick={() => handleContactOutcome(outcome)}
                  >
                    {outcome.replace(/_/g, ' ')}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {action && (
            <Button onClick={action.action} size="lg" className="w-full sm:w-auto">
              {action.label}
            </Button>
          )}
        </div>

        {/* Sidebar: checklist */}
        <div>
          {(status === 'APPT_SCHEDULED' || status === 'INTAKE_BLOCKED' || status === 'INTAKE_READY') && (
            <IntakeChecklist
              checklist={checklist}
              onUpdate={(updates) => setChecklist(prev => ({ ...prev, ...updates }))}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ReferralDetail;

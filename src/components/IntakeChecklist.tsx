import React from 'react';
import { ReferralChecklist as ChecklistType } from '@/types/models';
import { CheckCircle2, XCircle } from 'lucide-react';

interface IntakeChecklistProps {
  checklist: ChecklistType;
  onUpdate: (updates: Partial<ChecklistType>) => void;
}

const CheckItem: React.FC<{ label: string; checked: boolean; missing?: boolean; onToggle: () => void }> = ({ label, checked, missing, onToggle }) => (
  <button onClick={onToggle} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-accent/50 transition-colors text-left">
    {checked && !missing ? (
      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
    ) : (
      <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
    )}
    <span className={`text-sm ${checked && !missing ? 'text-foreground' : 'text-destructive font-medium'}`}>{label}</span>
  </button>
);

const IntakeChecklist: React.FC<IntakeChecklistProps> = ({ checklist, onUpdate }) => {
  return (
    <div className="bg-card rounded-lg card-shadow p-4">
      <h3 className="font-semibold text-foreground mb-3">Intake Checklist</h3>
      <div className="space-y-1">
        <CheckItem
          label="Acknowledgment completed"
          checked={checklist.ack_done}
          onToggle={() => onUpdate({ ack_done: !checklist.ack_done })}
        />
        <CheckItem
          label="ACK signed in EHR"
          checked={checklist.intake_ack_signed_in_ehr}
          onToggle={() => onUpdate({ intake_ack_signed_in_ehr: !checklist.intake_ack_signed_in_ehr })}
        />
        <CheckItem
          label="Payment authorization"
          checked={!checklist.intake_missing_payment_auth}
          missing={checklist.intake_missing_payment_auth}
          onToggle={() => onUpdate({ intake_missing_payment_auth: !checklist.intake_missing_payment_auth })}
        />
        <CheckItem
          label="Consent forms"
          checked={!checklist.intake_missing_consent}
          missing={checklist.intake_missing_consent}
          onToggle={() => onUpdate({ intake_missing_consent: !checklist.intake_missing_consent })}
        />
        <CheckItem
          label="Privacy notice"
          checked={!checklist.intake_missing_privacy}
          missing={checklist.intake_missing_privacy}
          onToggle={() => onUpdate({ intake_missing_privacy: !checklist.intake_missing_privacy })}
        />
      </div>
      {(checklist.intake_missing_payment_auth || checklist.intake_missing_consent || checklist.intake_missing_privacy || !checklist.intake_ack_signed_in_ehr) && (
        <div className="mt-3 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
          ⚠ Intake blocked — missing items must be resolved before first session.
        </div>
      )}
    </div>
  );
};

export default IntakeChecklist;

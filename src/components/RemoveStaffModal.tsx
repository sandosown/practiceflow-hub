import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const TEAL = '#2dd4bf';

interface BlockingItem {
  label: string;
  detail: string;
}

interface StaffMember {
  name: string;
  firstName: string;
  role: string;
  id?: string;
}

interface RemoveStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember | null;
  /** Returns blocking items. Empty array = no blocks. */
  checkBlocks: (staff: StaffMember) => BlockingItem[];
  onConfirmRemoval: (staff: StaffMember, endDate: Date) => void;
}

type RemovalMode = 'immediate' | 'scheduled';

const RemoveStaffModal: React.FC<RemoveStaffModalProps> = ({
  open,
  onOpenChange,
  staff,
  checkBlocks,
  onConfirmRemoval,
}) => {
  const [mode, setMode] = useState<RemovalMode>('immediate');
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [blocks, setBlocks] = useState<BlockingItem[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (open && staff) {
      setMode('immediate');
      setEndDate(undefined);
      setChecked(false);
      const b = checkBlocks(staff);
      setBlocks(b);
      setChecked(true);
    }
  }, [open, staff, checkBlocks]);

  if (!staff) return null;

  const isBlocked = checked && blocks.length > 0;

  const handleConfirm = () => {
    if (!staff || isBlocked) return;
    const resolvedDate = mode === 'immediate' ? new Date() : (endDate ?? new Date());
    onConfirmRemoval(staff, resolvedDate);
  };

  const canConfirm = !isBlocked && (mode === 'immediate' || (mode === 'scheduled' && endDate));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            {isBlocked
              ? `Cannot remove ${staff.firstName} yet`
              : `Remove ${staff.firstName} from this practice?`}
          </DialogTitle>
        </DialogHeader>

        {isBlocked ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This team member has active responsibilities that must be resolved before they can be removed:
            </p>
            <ul className="space-y-2">
              {blocks.map((b, i) => (
                <li key={i} className="text-sm">
                  <span className="font-semibold text-foreground">{b.label}</span>
                  <span className="text-muted-foreground"> — {b.detail}</span>
                </li>
              ))}
            </ul>
            <div className="flex pt-2">
              <button
                onClick={() => onOpenChange(false)}
                className="text-sm text-muted-foreground px-4 py-2 rounded-md hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will remove their access to SympoFlo. Their records and history will be preserved.
            </p>

            {/* Radio options */}
            <div className="space-y-3 pt-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="removal-mode"
                  checked={mode === 'immediate'}
                  onChange={() => setMode('immediate')}
                  className="accent-[#2dd4bf]"
                />
                <span className="text-sm text-foreground">Remove immediately</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="removal-mode"
                  checked={mode === 'scheduled'}
                  onChange={() => setMode('scheduled')}
                  className="accent-[#2dd4bf]"
                />
                <span className="text-sm text-foreground">Set an end date</span>
              </label>
            </div>

            {/* Date picker for scheduled */}
            {mode === 'scheduled' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-[220px] justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn('p-3 pointer-events-auto')}
                  />
                </PopoverContent>
              </Popover>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="text-sm font-semibold px-4 py-2 rounded-md disabled:opacity-40"
                style={{ color: TEAL, border: `1px solid ${TEAL}`, background: 'transparent' }}
              >
                Confirm Removal
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="text-sm text-muted-foreground px-4 py-2 rounded-md hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RemoveStaffModal;

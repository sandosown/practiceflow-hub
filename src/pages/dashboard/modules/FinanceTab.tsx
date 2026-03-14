import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { ArrowLeft, ShieldAlert, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cardStyle } from '@/lib/cardStyle';
import { useSessionData, useSession } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useCustomCategories } from './finance/useCustomCategories';
import { CategorySelect } from './finance/CategorySelect';

const ACCENT = '#059669';
const HAT_ID = 'w1';

type TimePeriod = 'Day' | 'Week' | 'Month';
type ModalType = 'income' | 'expense' | 'due' | null;

interface FinanceEntry {
  entry_id: string;
  type: string;
  amount: number;
  category: string;
  date: string;
  notes: string | null;
  source: string;
}

interface DueItem {
  due_id: string;
  name: string;
  amount: number;
  due_date: string;
  category: string | null;
}

const INCOME_CATEGORIES = ['Insurance', 'Private / Out of Pocket', 'Group Sessions', 'Workshops', 'Other'];
const EXPENSE_CATEGORIES = ['Payroll & Contractors', 'Office Lease', 'Software Subscriptions', 'Insurance', 'Other'];

function fmt(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getDateRange(period: TimePeriod): { from: string; to: string } {
  const now = new Date();
  let s: Date, e: Date;
  switch (period) {
    case 'Day':
      s = startOfDay(now); e = endOfDay(now); break;
    case 'Week':
      s = startOfWeek(now, { weekStartsOn: 0 }); e = endOfWeek(now, { weekStartsOn: 0 }); break;
    case 'Month':
    default:
      s = startOfMonth(now); e = endOfMonth(now); break;
  }
  return { from: format(s, 'yyyy-MM-dd'), to: format(e, 'yyyy-MM-dd') };
}

const FinanceTab: React.FC = () => {
  const navigate = useNavigate();
  const session = useSessionData();
  const { isDemoMode } = useSession();
  const [period, setPeriod] = useState<TimePeriod>('Month');
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [dueItems, setDueItems] = useState<DueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);

  const allowed = session.role === 'OWNER' || session.role === 'ADMIN';

  const fetchData = useCallback(async () => {
    if (!allowed) return;
    setLoading(true);
    const { from, to } = getDateRange(period);

    const [entriesRes, dueRes] = await Promise.all([
      supabase
        .from('finance_entries')
        .select('entry_id, type, amount, category, date, notes, source')
        .eq('hat_id', HAT_ID)
        .gte('date', from)
        .lte('date', to),
      supabase
        .from('finance_due_items')
        .select('due_id, name, amount, due_date, category')
        .eq('hat_id', HAT_ID)
        .gte('due_date', from)
        .lte('due_date', to),
    ]);

    if (entriesRes.data) setEntries(entriesRes.data as FinanceEntry[]);
    if (dueRes.data) setDueItems(dueRes.data as DueItem[]);
    setLoading(false);
  }, [period, allowed]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const { incomeTotal, expenseTotal, profit, incomeByCategory, expenseByCategory } = useMemo(() => {
    const inc = entries.filter(e => e.type === 'income');
    const exp = entries.filter(e => e.type === 'expense');
    const incTotal = inc.reduce((s, e) => s + Number(e.amount), 0);
    const expTotal = exp.reduce((s, e) => s + Number(e.amount), 0);

    const groupBy = (arr: FinanceEntry[]) => {
      const map: Record<string, number> = {};
      arr.forEach(e => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
      return Object.entries(map).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);
    };

    return {
      incomeTotal: incTotal,
      expenseTotal: expTotal,
      profit: incTotal - expTotal,
      incomeByCategory: groupBy(inc),
      expenseByCategory: groupBy(exp),
    };
  }, [entries]);

  if (!allowed) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavBar />
        <div className="max-w-5xl mx-auto px-6 py-6 pb-20">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShieldAlert className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-1">Access Restricted</h2>
            <p className="text-sm text-muted-foreground">Finance is available to practice owners and administrators only.</p>
          </div>
        </div>
        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <div className="max-w-5xl mx-auto px-6 py-6 pb-20">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/owner/group-practice')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground pl-3" style={{ borderLeft: `4px solid ${ACCENT}` }}>
              Finance
            </h1>
            <p className="text-sm text-muted-foreground pl-3 mt-0.5" style={{ marginLeft: 4 }}>Income, expenses & practice health.</p>
          </div>
        </div>

        {/* Time toggle + action buttons */}
        <div className="flex items-center justify-between mt-4 mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg w-fit" style={{ background: 'hsl(var(--muted))' }}>
            {(['Day', 'Week', 'Month'] as TimePeriod[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="text-xs font-semibold px-4 py-1.5 rounded-md transition-all"
                style={{
                  background: period === p ? 'hsl(var(--card))' : 'transparent',
                  color: period === p ? ACCENT : 'hsl(var(--muted-foreground))',
                  boxShadow: period === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline" size="sm"
              className="text-xs border-accent text-accent hover:bg-accent/10"
              style={{ borderColor: ACCENT, color: ACCENT }}
              onClick={() => setModal('income')}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Income
            </Button>
            <Button
              variant="outline" size="sm"
              className="text-xs border-accent text-accent hover:bg-accent/10"
              style={{ borderColor: ACCENT, color: ACCENT }}
              onClick={() => setModal('expense')}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Expense
            </Button>
            <Button
              variant="outline" size="sm"
              className="text-xs border-accent text-accent hover:bg-accent/10"
              style={{ borderColor: ACCENT, color: ACCENT }}
              onClick={() => setModal('due')}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> What's Due
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5" style={cardStyle(ACCENT)}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Income</p>
            <p className="text-2xl font-bold" style={{ color: '#059669' }}>{fmt(incomeTotal)}</p>
          </div>
          <div className="p-5" style={cardStyle('#1a2a5e')}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Expenses</p>
            <p className="text-2xl font-bold" style={{ color: '#2dd4bf' }}>{fmt(expenseTotal)}</p>
          </div>
          <div className="p-5" style={cardStyle('#2dd4bf')}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Profit</p>
            <p className="text-2xl font-bold" style={{ color: '#2dd4bf' }}>{fmt(profit)}</p>
          </div>
        </div>

        {/* What's Due */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: `4px solid ${ACCENT}` }}>
            WHAT'S DUE
          </h2>
          {dueItems.length === 0 ? (
            <p className="text-sm text-muted-foreground pl-3">No items due this {period.toLowerCase()}.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {dueItems.map(item => (
                <div key={item.due_id} className="p-4 flex items-center justify-between" style={cardStyle(ACCENT)}>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Due {format(new Date(item.due_date + 'T00:00:00'), 'MM/dd/yyyy')}</p>
                  </div>
                  <p className="text-sm font-bold text-foreground">{fmt(Number(item.amount))}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: '4px solid #059669' }}>
              INCOME BY CATEGORY
            </h2>
            {incomeByCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground pl-3">No income recorded this {period.toLowerCase()}.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {incomeByCategory.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
                    <span className="text-sm text-foreground">{cat.name}</span>
                    <span className="text-sm font-semibold" style={{ color: '#059669' }}>{fmt(cat.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: '4px solid #1a2a5e' }}>
              EXPENSES BY CATEGORY
            </h2>
            {expenseByCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground pl-3">No expenses recorded this {period.toLowerCase()}.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {expenseByCategory.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
                    <span className="text-sm text-foreground">{cat.name}</span>
                    <span className="text-sm font-semibold" style={{ color: '#1a2a5e' }}>{fmt(cat.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <BottomNavBar />

      {/* Entry modals */}
      {modal === 'income' && (
        <EntryModal
          title="Add Income"
          type="income"
          categories={INCOME_CATEGORIES}
          onClose={() => setModal(null)}
          onSaved={fetchData}
          userId={session.user_id}
          isDemoMode={isDemoMode}
        />
      )}
      {modal === 'expense' && (
        <EntryModal
          title="Add Expense"
          type="expense"
          categories={EXPENSE_CATEGORIES}
          onClose={() => setModal(null)}
          onSaved={fetchData}
          userId={session.user_id}
          isDemoMode={isDemoMode}
        />
      )}
      {modal === 'due' && (
        <DueModal
          onClose={() => setModal(null)}
          onSaved={fetchData}
          userId={session.user_id}
          isDemoMode={isDemoMode}
        />
      )}
    </div>
  );
};

/* ─── Income / Expense Modal ─── */
function EntryModal({ title, type, categories, onClose, onSaved, userId, isDemoMode }: {
  title: string; type: 'income' | 'expense'; categories: string[];
  onClose: () => void; onSaved: () => void; userId: string; isDemoMode: boolean;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const { customCategories, addCategory } = useCustomCategories(userId, type, isDemoMode);

  const handleSave = async () => {
    if (!date || !amount || !category) { toast.error('Please fill all required fields.'); return; }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) { toast.error('Enter a valid amount.'); return; }
    if (isDemoMode) { toast.info('Saving is not available in demo mode.'); onClose(); return; }
    setSaving(true);
    const { error } = await supabase.from('finance_entries').insert({
      hat_id: HAT_ID,
      engine_source: 'revenue',
      type,
      amount: parsed,
      category,
      date: format(date, 'yyyy-MM-dd'),
      notes: notes.trim() || null,
      source: 'manual',
      created_by: userId,
    } as any);
    setSaving(false);
    if (error) { toast.error('Failed to save entry.'); console.error(error); return; }
    toast.success(`${type === 'income' ? 'Income' : 'Expense'} added.`);
    onSaved();
    onClose();
  };

  return (
    <Dialog open onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          {/* Date */}
          <div>
            <Label className="text-sm font-medium">Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          {/* Amount */}
          <div>
            <Label className="text-sm font-medium">Amount *</Label>
            <Input type="number" min="0" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1" />
          </div>
          {/* Category */}
          <div>
            <Label className="text-sm font-medium">Category *</Label>
            <CategorySelect
              defaults={categories}
              custom={customCategories}
              value={category}
              onChange={setCategory}
              onAddCustom={addCategory}
            />
          </div>
          {/* Notes */}
          <div>
            <Label className="text-sm font-medium">Notes</Label>
            <Textarea placeholder="Optional notes…" value={notes} onChange={e => setNotes(e.target.value)} className="mt-1" rows={2} />
          </div>
          {/* Save */}
          <Button
            variant="outline" disabled={saving}
            className="w-full border-accent text-accent hover:bg-accent/10"
            style={{ borderColor: ACCENT, color: ACCENT }}
            onClick={handleSave}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── What's Due Modal ─── */
function DueModal({ onClose, onSaved, userId, isDemoMode }: { onClose: () => void; onSaved: () => void; userId: string; isDemoMode: boolean }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const { customCategories, addCategory } = useCustomCategories(userId, 'due', isDemoMode);

  const handleSave = async () => {
    if (!name.trim() || !amount || !dueDate) { toast.error('Please fill all required fields.'); return; }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) { toast.error('Enter a valid amount.'); return; }
    if (isDemoMode) { toast.info('Saving is not available in demo mode.'); onClose(); return; }
    setSaving(true);
    const { error } = await supabase.from('finance_due_items').insert({
      hat_id: HAT_ID,
      name: name.trim(),
      amount: parsed,
      due_date: format(dueDate, 'yyyy-MM-dd'),
      category: category.trim() || null,
      created_by: userId,
    } as any);
    setSaving(false);
    if (error) { toast.error('Failed to save item.'); console.error(error); return; }
    toast.success("What's Due item added.");
    onSaved();
    onClose();
  };

  return (
    <Dialog open onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add What's Due</DialogTitle></DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          {/* Name */}
          <div>
            <Label className="text-sm font-medium">Name *</Label>
            <Input placeholder="e.g. Office Lease — March" value={name} onChange={e => setName(e.target.value)} className="mt-1" />
          </div>
          {/* Amount */}
          <div>
            <Label className="text-sm font-medium">Amount *</Label>
            <Input type="number" min="0" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1" />
          </div>
          {/* Due Date */}
          <div>
            <Label className="text-sm font-medium">Due Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !dueDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          {/* Category */}
          <div>
            <Label className="text-sm font-medium">Category</Label>
            <CategorySelect
              defaults={[]}
              custom={customCategories}
              value={category}
              onChange={setCategory}
              onAddCustom={addCategory}
            />
          </div>
          {/* Save */}
          <Button
            variant="outline" disabled={saving}
            className="w-full border-accent text-accent hover:bg-accent/10"
            style={{ borderColor: ACCENT, color: ACCENT }}
            onClick={handleSave}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FinanceTab;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '@/components/TopNavBar';
import BottomNavBar from '@/components/BottomNavBar';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cardStyle } from '@/lib/cardStyle';
import { useSessionData } from '@/context/SessionContext';

const ACCENT = '#059669';

type TimePeriod = 'Day' | 'Week' | 'Month';

const MONTHLY_DATA = {
  income: 42750,
  expenses: 28320,
  whats_due: [
    { name: 'Office Lease — March', amount: 4200, due: '03/31/2026' },
    { name: 'SimplePractice Subscription', amount: 158, due: '03/28/2026' },
    { name: 'Liability Insurance Premium', amount: 620, due: '04/01/2026' },
    { name: 'Payroll — Biweekly', amount: 12400, due: '03/28/2026' },
  ],
  income_categories: [
    { name: 'Insurance Reimbursements', amount: 31200 },
    { name: 'Private Pay Sessions', amount: 8500 },
    { name: 'Group Therapy', amount: 2100 },
    { name: 'Supervision Fees', amount: 950 },
  ],
  expense_categories: [
    { name: 'Payroll & Contractors', amount: 18600 },
    { name: 'Office Lease', amount: 4200 },
    { name: 'Software & Tools', amount: 1850 },
    { name: 'Insurance & Compliance', amount: 2120 },
    { name: 'Marketing', amount: 750 },
    { name: 'Miscellaneous', amount: 800 },
  ],
};

function fmt(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

const FinanceTab: React.FC = () => {
  const navigate = useNavigate();
  const session = useSessionData();
  const [period, setPeriod] = useState<TimePeriod>('Month');

  // Role gate
  const allowed = session.role === 'OWNER' || session.role === 'ADMIN';

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

  const profit = MONTHLY_DATA.income - MONTHLY_DATA.expenses;

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

        {/* Time toggle */}
        <div className="flex items-center gap-1 mt-4 mb-6 p-1 rounded-lg w-fit" style={{ background: 'hsl(var(--muted))' }}>
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

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5" style={cardStyle(ACCENT)}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Income</p>
            <p className="text-2xl font-bold" style={{ color: '#059669' }}>{fmt(MONTHLY_DATA.income)}</p>
          </div>
          <div className="p-5" style={cardStyle('#1a2a5e')}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Expenses</p>
            <p className="text-2xl font-bold" style={{ color: '#1a2a5e' }}>{fmt(MONTHLY_DATA.expenses)}</p>
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
          <div className="flex flex-col gap-3">
            {MONTHLY_DATA.whats_due.map((item, i) => (
              <div key={i} className="p-4 flex items-center justify-between" style={cardStyle(ACCENT)}>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Due {item.due}</p>
                </div>
                <p className="text-sm font-bold text-foreground">{fmt(item.amount)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: '4px solid #059669' }}>
              INCOME BY CATEGORY
            </h2>
            <div className="flex flex-col gap-2">
              {MONTHLY_DATA.income_categories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
                  <span className="text-sm text-foreground">{cat.name}</span>
                  <span className="text-sm font-semibold" style={{ color: '#059669' }}>{fmt(cat.amount)}</span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 pl-3 text-muted-foreground" style={{ borderLeft: '4px solid #1a2a5e' }}>
              EXPENSES BY CATEGORY
            </h2>
            <div className="flex flex-col gap-2">
              {MONTHLY_DATA.expense_categories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
                  <span className="text-sm text-foreground">{cat.name}</span>
                  <span className="text-sm font-semibold" style={{ color: '#1a2a5e' }}>{fmt(cat.amount)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default FinanceTab;

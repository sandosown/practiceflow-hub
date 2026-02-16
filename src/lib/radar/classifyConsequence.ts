/**
 * V1 Consequence Classifier — keyword heuristics against referral fields.
 */

export type ConsequenceClass = 'critical' | 'operational' | 'stability' | 'maintenance' | 'personal';

const KEYWORD_MAP: { cls: ConsequenceClass; keywords: string[] }[] = [
  { cls: 'critical', keywords: ['license', 'credential', 'compliance', 'payroll', 'insurance', 'blocked'] },
  { cls: 'operational', keywords: ['client', 'referral', 'call back', 'intake', 'schedule', 'billing', 'contact', 'appointment', 'new referral'] },
  { cls: 'stability', keywords: ['note', 'documentation', 'paperwork', 'review', 'acknowledged'] },
  { cls: 'maintenance', keywords: ['cleanup', 'organize', 'update', 'template'] },
  { cls: 'personal', keywords: ['home', 'family', 'personal', 'mom', 'kids'] },
];

export const OBJECTIVE_WEIGHTS: Record<ConsequenceClass, number> = {
  critical: 100,
  operational: 75,
  stability: 50,
  maintenance: 30,
  personal: 20,
};

/**
 * Classify an item by scanning its text fields for keyword matches.
 * Accepts any object — uses common field names (client_name, status, title, label, type).
 */
export function classifyConsequence(item: Record<string, any>): ConsequenceClass {
  const text = [
    item.client_name,
    item.status,
    item.title,
    item.label,
    item.type,
    item.detail,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  for (const { cls, keywords } of KEYWORD_MAP) {
    if (keywords.some(kw => text.includes(kw))) {
      return cls;
    }
  }
  return 'stability';
}

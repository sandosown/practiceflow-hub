/**
 * Radar Interpretation Layer
 * DB/data → interpretRadarItems() → UI render
 *
 * Adds derived fields and sorts by display_weight DESC.
 */

import { classifyConsequence, OBJECTIVE_WEIGHTS, ConsequenceClass } from './classifyConsequence';
import type { ResolvedOperatingProfile } from '@/lib/profile/resolveOperatingProfile';

// ── Types ──────────────────────────────────────────────────────────

export interface InterpretedItem<T = Record<string, any>> {
  original: T;
  consequence_class: ConsequenceClass;
  objective_weight: number;
  stability_modifier: number;
  cognitive_tension: number;
  display_weight: number;
  role_responsibility: {
    canAct: boolean;
    waitingOnStaff: boolean;
  };
}

interface InterpretParams<T> {
  items: T[];
  viewerId: string;
  viewerRole: 'owner' | 'staff';
  operatingProfile: ResolvedOperatingProfile;
}

// ── localStorage helpers (owner-only) ──────────────────────────────

function getLastViewed(ownerId: string, itemId: string): number | null {
  try {
    const ts = localStorage.getItem(`pf_lastViewed:${ownerId}:${itemId}`);
    return ts ? new Date(ts).getTime() : null;
  } catch { return null; }
}

export function recordView(ownerId: string, itemId: string): void {
  localStorage.setItem(`pf_lastViewed:${ownerId}:${itemId}`, new Date().toISOString());
}

function getDrift(ownerId: string, itemId: string): number {
  try {
    const v = localStorage.getItem(`pf_drift:${ownerId}:${itemId}`);
    return v ? Math.min(parseInt(v, 10) || 0, 10) : 0;
  } catch { return 0; }
}

export function incrementDrift(ownerId: string, itemId: string): void {
  const current = getDrift(ownerId, itemId);
  if (current < 10) {
    localStorage.setItem(`pf_drift:${ownerId}:${itemId}`, String(current + 1));
  }
}

// ── Time decay helper ──────────────────────────────────────────────

function computeTimeDecay(item: Record<string, any>): number {
  const deadline = item.contact_by ?? item.due_date ?? item.acknowledge_by;
  if (!deadline) return 0;

  const now = Date.now();
  const due = new Date(deadline).getTime();
  const diff = due - now;
  const dayMs = 86_400_000;

  if (diff < 0) return 25; // overdue
  if (diff < dayMs) return 20;
  if (diff < 3 * dayMs) return 10;
  return 0;
}

// ── Main function ──────────────────────────────────────────────────

export function interpretRadarItems<T extends Record<string, any>>({
  items,
  viewerId,
  viewerRole,
  operatingProfile: _profile,
}: InterpretParams<T>): InterpretedItem<T>[] {
  const isOwner = viewerRole === 'owner';

  const interpreted = items.map((item): InterpretedItem<T> => {
    const itemId = item.id ?? '';

    // Consequence + objective weight
    const consequence_class = classifyConsequence(item);
    const objective_weight = OBJECTIVE_WEIGHTS[consequence_class];

    // Time decay
    const time_decay = computeTimeDecay(item);

    // Stability modifier (owner-only drift)
    let stability_modifier = 0;
    if (isOwner) {
      const drift = getDrift(viewerId, itemId);
      stability_modifier = drift * 3; // max 30
    }

    // Cognitive tension
    let cognitive_tension = objective_weight + time_decay + stability_modifier;

    // View relief (owner-only, last 30 min)
    let view_relief = 0;
    if (isOwner) {
      const lastViewed = getLastViewed(viewerId, itemId);
      if (lastViewed) {
        const minutesAgo = (Date.now() - lastViewed) / 60_000;
        if (minutesAgo < 30) {
          view_relief = -15;
        }
      }
    }
    cognitive_tension += view_relief;

    // Responsibility
    const assignedTo = item.assigned_to_profile_id ?? item.assigned_to_user_id ?? null;
    const canAct = assignedTo ? assignedTo === viewerId : isOwner;
    const waitingOnStaff = isOwner && !!assignedTo && assignedTo !== viewerId;

    let responsibility_adj = 0;
    if (waitingOnStaff) responsibility_adj = -10;
    if (!isOwner && canAct) responsibility_adj = 10;

    // Final display weight
    const display_weight = Math.max(
      0,
      objective_weight + stability_modifier + time_decay + responsibility_adj + view_relief,
    );

    return {
      original: item,
      consequence_class,
      objective_weight,
      stability_modifier,
      cognitive_tension,
      display_weight,
      role_responsibility: { canAct, waitingOnStaff },
    };
  });

  // Sort DESC by display_weight
  interpreted.sort((a, b) => b.display_weight - a.display_weight);
  return interpreted;
}

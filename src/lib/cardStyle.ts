import React from 'react';

/** Shared hex → rgb helper */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/**
 * LOG-071 — Asymmetric Accent Border card system
 * Left: 4px solid accent (full opacity)
 * Top/Bottom: 1px accent at 25%
 * Right: 1px accent at 15%
 * Interior: clean — no colored fills ever
 * Surface color: responds to light/dark via CSS var
 */
export function cardStyle(accent: string, opts?: { muted?: boolean }): React.CSSProperties {
  const [r, g, b] = hexToRgb(accent);
  const m = opts?.muted ? 0.45 : 1;

  return {
    background: 'hsl(var(--card))',
    borderLeft:   `4px solid rgba(${r},${g},${b},${m})`,
    borderTop:    `1px solid rgba(${r},${g},${b},${0.50 * m})`,
    borderBottom: `1px solid rgba(${r},${g},${b},${0.50 * m})`,
    borderRight:  `1px solid rgba(${r},${g},${b},${0.35 * m})`,
    borderRadius: '12px',
    boxShadow: `0 1px 4px rgba(0,0,0,0.06)`,
    opacity: opts?.muted ? 0.55 : 1,
    transition: 'all 0.2s ease',
  };
}

/**
 * Hover state — border intensifies, subtle lift
 */
export function cardHoverStyle(accent: string): React.CSSProperties {
  const [r, g, b] = hexToRgb(accent);
  return {
    background: 'hsl(var(--card))',
    borderLeft:   `4px solid rgb(${r},${g},${b})`,
    borderTop:    `1px solid rgba(${r},${g},${b},0.45)`,
    borderBottom: `1px solid rgba(${r},${g},${b},0.45)`,
    borderRight:  `1px solid rgba(${r},${g},${b},0.25)`,
    borderRadius: '12px',
    boxShadow: `0 4px 16px rgba(${r},${g},${b},0.18), 0 1px 4px rgba(0,0,0,0.08)`,
    transition: 'all 0.2s ease',
  };
}

/**
 * Icon square — unchanged, mode-aware background
 */
export function iconSquareStyle(accent: string): React.CSSProperties {
  const [r, g, b] = hexToRgb(accent);
  return {
    background: `rgba(${r},${g},${b},0.15)`,
    borderRadius: '10px',
    boxShadow: `0 0 8px rgba(${r},${g},${b},0.2)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}

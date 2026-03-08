/** Phase 4 — 5-layer card system helper */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

export function cardStyle(accent: string, opts?: { muted?: boolean }) {
  const [r, g, b] = hexToRgb(accent);
  const m = opts?.muted ? 0.45 : 1;

  return {
    background: `linear-gradient(135deg, rgba(${r},${g},${b},${0.08 * m}) 0%, #1a2a4a 60%)`,
    border: `1px solid rgba(${r},${g},${b},${0.45 * m})`,
    borderLeft: `4px solid rgba(${r},${g},${b},${m})`,
    borderRadius: '12px',
    boxShadow: `0 0 16px rgba(${r},${g},${b},${0.18 * m}), inset 0 1px 0 rgba(255,255,255,${0.04 * m})`,
    opacity: m,
    transition: 'all 0.2s ease',
  } as React.CSSProperties;
}

export function cardHoverStyle(accent: string) {
  const [r, g, b] = hexToRgb(accent);
  return {
    background: `linear-gradient(135deg, rgba(${r},${g},${b},0.13) 0%, #1a2a4a 60%)`,
    border: `1px solid rgba(${r},${g},${b},0.7)`,
    borderLeft: `4px solid rgb(${r},${g},${b})`,
    borderRadius: '12px',
    boxShadow: `0 0 24px rgba(${r},${g},${b},0.32), inset 0 1px 0 rgba(255,255,255,0.06)`,
    transition: 'all 0.2s ease',
  } as React.CSSProperties;
}

export function iconSquareStyle(accent: string) {
  const [r, g, b] = hexToRgb(accent);
  return {
    background: `rgba(${r},${g},${b},0.18)`,
    borderRadius: '10px',
    boxShadow: `0 0 8px rgba(${r},${g},${b},0.25)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties;
}

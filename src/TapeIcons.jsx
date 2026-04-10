// Tape-Cut Icon System — hand-crafted SVGs
// Style: thick strokes, square caps, angular paths, slight imperfections
// Inspired by tape-art / paper-cut aesthetic

import { useState } from 'react';

const TAPE = { strokeLinecap: 'square', strokeLinejoin: 'miter' };

// ── Cup Variations ─────────────────────────────

// V1: Classic Mug — angular trapezoid + blocky handle
export function TapeCup1({ size = 24, className = '', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" {...TAPE} className={className} {...props}>
      <path d="M5.2 7.3 L6.8 19.8 L16.2 20.1 L17.8 7" strokeWidth="2.8" />
      <path d="M17.8 10.2 L20.8 9.8 L21 15.3 L17.8 15" strokeWidth="2.8" />
    </svg>
  );
}

// V2: Espresso Demitasse — wide, short cup on saucer plate
export function TapeCup2({ size = 24, className = '', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" {...TAPE} className={className} {...props}>
      <path d="M4.5 9.5 L5.8 16.5 L17.2 16.8 L18.5 9.5" strokeWidth="2.5" />
      <path d="M18.5 11 L21 10.8 L21.2 14.5 L18.5 14.2" strokeWidth="2.5" />
      <path d="M2 18.5 L22 18.2" strokeWidth="2.8" />
    </svg>
  );
}

// V3: Paper To-Go Cup — tapered body with lid
export function TapeCup3({ size = 24, className = '', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" {...TAPE} className={className} {...props}>
      <path d="M7.5 20.5 L6 8.5 L18 8.2 L16.5 20.5" strokeWidth="2.5" />
      <path d="M5 8.5 L19 8.2" strokeWidth="3" />
      <path d="M8.5 5.5 L15.5 5.2" strokeWidth="2.5" />
      <path d="M8 14 L16 13.8" strokeWidth="2" />
    </svg>
  );
}

// V4: Camp Mug — wide, squat, big angular handle
export function TapeCup4({ size = 24, className = '', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" {...TAPE} className={className} {...props}>
      <path d="M3 7.5 L4.2 19.5 L16.8 19.8 L18 7.5" strokeWidth="2.8" />
      <path d="M18 9.5 L21.5 9.2 L21.8 16 L18 15.8" strokeWidth="2.8" />
      <path d="M3 7.5 L18 7.2" strokeWidth="2.5" />
    </svg>
  );
}

// V5: Handleless Cup — minimal, Japanese style, straight walls with steam
export function TapeCup5({ size = 24, className = '', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" {...TAPE} className={className} {...props}>
      <path d="M5.5 8.5 L6.5 20.5 L17.5 20.8 L18.5 8.5" strokeWidth="2.8" />
      <path d="M9.5 6 L9.2 3.5" strokeWidth="2.2" />
      <path d="M14.5 5.5 L14.2 3" strokeWidth="2.2" />
    </svg>
  );
}

// ── Active Nav Icons (aliased) ─────────────────

export const TapeCoffee = TapeCup1;

export function TapeSearch({ size = 24, strokeWidth = 2.5, className = '', ...props }) {
  const sw = strokeWidth > 2.2 ? 2.8 : 2.3;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" {...TAPE} className={className} {...props}>
      <path d="M10.5 3.5 L15.5 5.2 L17.5 10 L15.8 15.2 L10.5 17 L5.5 15.3 L3.5 10.5 L5.2 5.5 Z" strokeWidth={sw} />
      <path d="M15.5 15.5 L21 21" strokeWidth={sw * 1.3} />
    </svg>
  );
}

export function TapePlus({ size = 24, strokeWidth = 2.5, className = '', ...props }) {
  const sw = strokeWidth > 2.2 ? 3.2 : 2.7;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" {...TAPE} className={className} {...props}>
      <path d="M12.2 3.2 L11.8 20.8" strokeWidth={sw} />
      <path d="M3.2 12.2 L20.8 11.8" strokeWidth={sw} />
    </svg>
  );
}

// ── Roastery Monogram Marks ────────────────────

const ROASTERY_INITIALS = {
  'The Barn': 'TB',
  'Bonanza Coffee': 'BN',
  'Five Elephant': 'FE',
  'Father Carpenter': 'FC',
  'Hoppenworth & Ploch': 'HP',
  'Elbgold': 'EG',
  'Public Coffee Roasters': 'PC',
  'Nord Coast Coffee': 'NC',
  'Machhorndl': 'MH',
  'Röststätte': 'RÖ',
  'Coffee Circle': 'CC',
  '19grams': '19',
  'Heilandt': 'HL',
  'Martermühle': 'MM',
  'Supremo': 'SU',
  'Cross Coffee': 'XC',
  'Flying Roasters': 'FR',
  'Quijote Kaffee': 'QK',
  'SCHVARZ': 'SV',
  'RVTC': 'RV',
  'Carl Ferdinand': 'CF',
  'Röstzeit': 'RZ',
};

const ROASTERY_LOGO_SLUG = {
  'The Barn': 'the-barn',
  'Bonanza Coffee': 'bonanza',
  'Five Elephant': 'five-elephant',
  'Father Carpenter': 'father-carpenter',
  // Hoppenworth: only 40px available, monogram fallback looks better
  'Elbgold': 'elbgold',
  'Public Coffee Roasters': 'public-coffee',
  'Nord Coast Coffee': 'nord-coast',
  'Machhorndl': 'machhorndl',
  'Röststätte': 'roeststaette',
  'Coffee Circle': 'coffee-circle',
  '19grams': '19grams',
  'Heilandt': 'heilandt',
  'Martermühle': 'martermuehle',
  'Supremo': 'supremo',
  'Cross Coffee': 'cross-coffee',
  'Flying Roasters': 'flying-roasters',
  'Quijote Kaffee': 'quijote',
  'SCHVARZ': 'schvarz',
  'RVTC': 'rvtc',
  'Carl Ferdinand': 'carl-ferdinand',
  'Röstzeit': 'roestzeit',
};

const LOGO_EXT = { 'RVTC': 'svg' };

// Simple hash to deterministically pick a mark variant per roastery
function nameHash(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * RoasteryMark — Tape-cut monogram logo for each roastery
 * Three variants cycle deterministically: circle, square, diamond
 */
export function RoasteryMark({ name, size = 52, className = '' }) {
  const initials = ROASTERY_INITIALS[name]
    || name.split(/[\s&]+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const variant = nameHash(name) % 3;
  const half = size / 2;
  const fontSize = size * 0.36;

  const textEl = (
    <text
      x={half} y={half}
      textAnchor="middle"
      dominantBaseline="central"
      fill="#FFFFFF"
      fontSize={fontSize}
      fontWeight="800"
      fontFamily="'DM Sans', system-ui, sans-serif"
      letterSpacing="0.5"
    >
      {initials}
    </text>
  );

  // Variant 0: Circle
  if (variant === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
        <circle cx={half} cy={half} r={half - 1} fill="#000" />
        {textEl}
      </svg>
    );
  }

  // Variant 1: Rounded square
  if (variant === 1) {
    const r = size * 0.18;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
        <rect x="1" y="1" width={size - 2} height={size - 2} rx={r} fill="#000" />
        {textEl}
      </svg>
    );
  }

  // Variant 2: Diamond (rotated square)
  const inset = size * 0.06;
  const points = `${half},${inset} ${size - inset},${half} ${half},${size - inset} ${inset},${half}`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <polygon points={points} fill="#000" />
      {textEl}
    </svg>
  );
}

/**
 * RoasteryLogo — Real logo image with monogram fallback
 * Displays the roastery's actual logo in a consistent rounded container.
 * Falls back to RoasteryMark if the image fails to load.
 */
export function RoasteryLogo({ name, size = 48, className = '' }) {
  const [failed, setFailed] = useState(false);
  const slug = ROASTERY_LOGO_SLUG[name];
  const ext = LOGO_EXT[name] || 'png';

  if (!slug || failed) {
    return <RoasteryMark name={name} size={size} className={className} />;
  }

  const base = import.meta.env.BASE_URL || '/';
  const src = `${base}logos/${slug}.${ext}`;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        overflow: 'hidden',
        background: '#F5F5F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        style={{
          width: size * 0.78,
          height: size * 0.78,
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

// ── Preview Showcase ───────────────────────────

export function CupShowcase({ onSelect, onClose }) {
  const cups = [
    { id: 1, Icon: TapeCup1, label: 'Classic Mug', desc: 'Eckiger Henkelbecher' },
    { id: 2, Icon: TapeCup2, label: 'Espresso', desc: 'Demitasse mit Unterteller' },
    { id: 3, Icon: TapeCup3, label: 'To-Go', desc: 'Paper Cup mit Deckel' },
    { id: 4, Icon: TapeCup4, label: 'Camp Mug', desc: 'Breite Tasse, großer Henkel' },
    { id: 5, Icon: TapeCup5, label: 'Handleless', desc: 'Japanisch minimal, mit Dampf' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 16
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 24,
        maxWidth: 380, width: '100%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Cup-Stil wählen</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 24,
            cursor: 'pointer', padding: 4, lineHeight: 1
          }}>×</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {cups.map(({ id, Icon, label, desc }) => (
            <button
              key={id}
              onClick={() => onSelect(id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 8, padding: 16, border: '2px solid #E5E5E5',
                borderRadius: 12, background: '#FAFAFA', cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#000'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E5E5'}
            >
              <Icon size={64} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: 11, color: '#999', textAlign: 'center' }}>{desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

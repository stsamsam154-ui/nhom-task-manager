const branchShell = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '48px',
  zIndex: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
};

function Blossom({ x, y, size = 1, rotate = 0, isDark }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${size})`}>
      <ellipse cx="0" cy="-4.5" rx="3.4" ry="5.6" fill={isDark ? '#FFD1DC' : '#FF8FB4'} />
      <ellipse cx="4.3" cy="-0.8" rx="3.2" ry="5.1" fill={isDark ? '#FF9FBE' : '#EA4F86'} />
      <ellipse cx="2.4" cy="4" rx="3.2" ry="5" fill={isDark ? '#FFC1D0' : '#F56EA0'} />
      <ellipse cx="-2.4" cy="4" rx="3.2" ry="5" fill={isDark ? '#FFC8D6' : '#F479A7'} />
      <ellipse cx="-4.3" cy="-0.8" rx="3.2" ry="5.1" fill={isDark ? '#FFAEC8' : '#E95B90'} />
      <circle cx="0" cy="0" r="1.7" fill="#FFD86A" />
    </g>
  );
}

function MapleLeaf({ x, y, size = 1, rotate = 0, color }) {
  return (
    <path
      d={`M${x},${y + 9 * size}
        L${x - 4 * size},${y + 4 * size}
        L${x - 8 * size},${y + 5 * size}
        L${x - 6 * size},${y}
        L${x - 11 * size},${y - 3 * size}
        L${x - 4 * size},${y - 3 * size}
        L${x - 2 * size},${y - 9 * size}
        L${x + 1 * size},${y - 3 * size}
        L${x + 8 * size},${y - 6 * size}
        L${x + 5 * size},${y}
        L${x + 10 * size},${y + 2 * size}
        L${x + 4 * size},${y + 4 * size}
        Z`}
      fill={color}
      opacity="0.96"
      transform={`rotate(${rotate}, ${x}, ${y})`}
    />
  );
}

function Snowflake({ x, y, size = 1, isDark, opacity = 0.9 }) {
  const stroke = isDark ? '#F4FBFF' : '#4C9BDA';
  const soft = isDark ? '#D7F0FF' : '#8FC7ED';
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`} opacity={opacity}>
      <line x1="0" y1="-6" x2="0" y2="6" stroke={stroke} strokeWidth="1.55" strokeLinecap="round" />
      <line x1="-6" y1="0" x2="6" y2="0" stroke={stroke} strokeWidth="1.55" strokeLinecap="round" />
      <line x1="-4.5" y1="-4.5" x2="4.5" y2="4.5" stroke={soft} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="4.5" y1="-4.5" x2="-4.5" y2="4.5" stroke={soft} strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="0" cy="0" r="1" fill={stroke} />
    </g>
  );
}

function SpringBranch({ isDark }) {
  const blossoms = [
    [16, 25, 0.72, -22], [34, 16, 0.88, 18], [55, 18, 0.72, 42],
    [78, 12, 0.78, -36], [98, 21, 0.66, 28], [122, 18, 0.95, -12],
    [148, 12, 0.72, 36], [174, 21, 0.82, -30], [202, 15, 0.7, 16],
    [228, 20, 0.94, 34], [254, 13, 0.76, -24], [284, 18, 0.86, 8],
    [314, 11, 0.68, -34], [342, 20, 0.92, 24], [372, 15, 0.72, -14],
  ];
  const fallingPetals = [[62, 36], [116, 34], [186, 39], [276, 35], [328, 37]];

  return (
    <div style={branchShell}>
      <svg viewBox="0 0 400 58" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: isDark ? 0.9 : 0.98 }}>
        <path d="M-12,32 C38,5 79,34 124,16 C172,-2 207,36 256,16 C310,-2 345,28 414,7" stroke={isDark ? '#5D745F' : '#8CB98A'} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.22" />
        <path d="M-12,30 C38,6 78,31 124,15 C172,-1 208,34 256,15 C311,-1 344,27 414,8" stroke={isDark ? '#6FA16D' : '#86B982'} strokeWidth="4.4" fill="none" strokeLinecap="round" />
        <path d="M35,23 C24,10 12,9 2,13" stroke={isDark ? '#61895F' : '#77A873'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M126,16 C114,3 98,3 84,8" stroke={isDark ? '#61895F' : '#77A873'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M220,20 C207,7 190,7 177,12" stroke={isDark ? '#61895F' : '#77A873'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M334,18 C320,5 303,5 289,10" stroke={isDark ? '#61895F' : '#77A873'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {blossoms.map(([x, y, s, r]) => <Blossom key={`${x}-${y}`} x={x} y={y} size={s} rotate={r} isDark={isDark} />)}
        {fallingPetals.map(([x, y], i) => (
          <ellipse key={x} cx={x} cy={y} rx="3.2" ry="1.8" fill={isDark ? '#FFD1DC' : '#F58CB0'} opacity="0.78" transform={`rotate(${i * 31}, ${x}, ${y})`} />
        ))}
      </svg>
    </div>
  );
}

function SummerBranch({ isDark }) {
  const leaves = [
    [15, 22, 0.8, -52], [34, 13, 0.86, 40], [55, 21, 0.78, -42], [78, 11, 0.92, 36],
    [102, 18, 0.82, -48], [128, 10, 0.88, 34], [156, 20, 0.84, -36], [184, 12, 0.92, 44],
    [212, 21, 0.78, -44], [242, 12, 0.9, 36], [272, 19, 0.84, -48], [302, 10, 0.88, 38],
    [332, 20, 0.82, -36], [362, 13, 0.9, 42], [392, 19, 0.76, -34],
  ];
  const lights = [[28, 37, 2.5], [92, 34, 1.8], [146, 39, 2.9], [218, 34, 2.1], [286, 38, 2.7], [354, 35, 2]];

  return (
    <div style={branchShell}>
      <svg viewBox="0 0 400 58" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: isDark ? 0.92 : 0.98 }}>
        <path d="M-10,30 C34,7 75,22 118,13 C165,1 203,31 252,13 C306,-3 341,23 410,8" stroke={isDark ? '#325B37' : '#3E7E46'} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.24" />
        <path d="M-10,28 C34,8 75,21 118,13 C166,2 202,29 252,13 C306,-2 342,22 410,8" stroke={isDark ? '#4F9A55' : '#348348'} strokeWidth="4.2" fill="none" strokeLinecap="round" />
        {leaves.map(([x, y, s, r], i) => (
          <ellipse
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            rx={5.5 * s}
            ry={12 * s}
            fill={i % 2 ? (isDark ? '#97D06F' : '#3F9854') : (isDark ? '#6EB85F' : '#246F3B')}
            opacity="0.94"
            transform={`rotate(${r}, ${x}, ${y})`}
          />
        ))}
        {lights.map(([x, y, r]) => (
          <g key={x} opacity="0.92">
            <circle cx={x} cy={y} r={r + 4} fill={isDark ? '#FFE65C' : '#F5BD35'} opacity="0.14" />
            <circle cx={x} cy={y} r={r} fill={isDark ? '#FFF27A' : '#F4B531'} />
          </g>
        ))}
      </svg>
    </div>
  );
}

function AutumnBranch({ isDark }) {
  const colors = isDark ? ['#FF8A2D', '#F15A24', '#FFC35A', '#D9471B'] : ['#EA5A1C', '#C94316', '#F49B2D', '#D75F1F'];
  const leaves = [
    [18, 17, 0.58, -20], [42, 12, 0.7, 30], [70, 21, 0.56, -38], [98, 12, 0.66, 16],
    [126, 18, 0.62, 44], [158, 11, 0.72, -28], [188, 20, 0.58, 26], [222, 13, 0.7, -12],
    [254, 19, 0.6, 36], [288, 11, 0.72, -32], [320, 20, 0.58, 18], [352, 13, 0.66, -22], [384, 20, 0.55, 34],
  ];

  return (
    <div style={branchShell}>
      <svg viewBox="0 0 400 58" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: isDark ? 0.92 : 0.99 }}>
        <path d="M-12,27 C45,7 86,28 135,15 C184,3 220,30 270,13 C322,0 352,22 412,10" stroke={isDark ? '#7D4022' : '#A96A37'} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.24" />
        <path d="M-12,26 C45,8 86,26 135,15 C184,4 220,28 270,13 C322,1 352,21 412,10" stroke={isDark ? '#B66A34' : '#D28548'} strokeWidth="4.4" fill="none" strokeLinecap="round" />
        <path d="M58,21 C44,8 30,9 16,13" stroke={isDark ? '#9E5630' : '#B36A38'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M180,16 C166,4 150,5 136,10" stroke={isDark ? '#9E5630' : '#B36A38'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M318,15 C302,4 286,6 272,10" stroke={isDark ? '#9E5630' : '#B36A38'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {leaves.map(([x, y, s, r], i) => (
          <MapleLeaf key={`${x}-${y}`} x={x} y={y} size={s} rotate={r} color={colors[i % colors.length]} />
        ))}
        {[82, 206, 298, 368].map((x, i) => (
          <MapleLeaf key={x} x={x} y={37 + (i % 2) * 3} size={0.38} rotate={i * 36} color={colors[(i + 1) % colors.length]} />
        ))}
      </svg>
    </div>
  );
}

function WinterBranch({ isDark }) {
  const snowflakes = [
    [20, 19, 0.58], [54, 12, 0.46], [88, 23, 0.5], [126, 11, 0.62], [164, 22, 0.44],
    [204, 12, 0.58], [244, 21, 0.46], [286, 11, 0.62], [326, 22, 0.48], [366, 12, 0.56],
  ];

  return (
    <div style={branchShell}>
      <svg viewBox="0 0 400 58" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: isDark ? 0.93 : 0.99 }}>
        <path d="M-12,22 C42,5 88,17 132,13 C184,6 220,26 270,12 C326,-3 356,18 412,8" stroke={isDark ? '#5B8BB2' : '#93C7EA'} strokeWidth="7.5" fill="none" strokeLinecap="round" opacity="0.28" />
        <path d="M-12,21 C42,6 88,16 132,13 C184,7 220,25 270,12 C326,-2 356,17 412,8" stroke={isDark ? '#BFE5FF' : '#67AEE0'} strokeWidth="3.7" fill="none" strokeLinecap="round" />
        <path d="M50,18 C36,7 22,8 8,12" stroke={isDark ? '#D9F0FF' : '#7DBBE7'} strokeWidth="2.1" fill="none" strokeLinecap="round" />
        <path d="M142,13 C132,2 119,3 106,7" stroke={isDark ? '#D9F0FF' : '#7DBBE7'} strokeWidth="2.1" fill="none" strokeLinecap="round" />
        <path d="M218,17 C205,6 190,7 176,11" stroke={isDark ? '#D9F0FF' : '#7DBBE7'} strokeWidth="2.1" fill="none" strokeLinecap="round" />
        <path d="M340,14 C324,3 309,5 294,9" stroke={isDark ? '#D9F0FF' : '#7DBBE7'} strokeWidth="2.1" fill="none" strokeLinecap="round" />
        {snowflakes.map(([x, y, s], i) => (
          <Snowflake key={`${x}-${y}`} x={x} y={y} size={s} isDark={isDark} opacity={i % 2 ? 0.82 : 0.96} />
        ))}
        {[72, 176, 260, 348].map((x, i) => (
          <circle key={x} cx={x} cy={36 + (i % 2) * 3} r="1.6" fill={isDark ? '#F4FBFF' : '#7DBBE7'} opacity="0.78" />
        ))}
      </svg>
    </div>
  );
}

export default function SeasonBranch({ season, isDark }) {
  if (season === 'todo') return <SpringBranch isDark={isDark} />;
  if (season === 'inprogress') return <SummerBranch isDark={isDark} />;
  if (season === 'review') return <AutumnBranch isDark={isDark} />;
  if (season === 'done') return <WinterBranch isDark={isDark} />;
  return null;
}

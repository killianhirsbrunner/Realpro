import { useTheme } from '../../contexts/ThemeContext';

interface RealProLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function RealProLogo({ className = '', width = 180, height = 60 }: RealProLogoProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 180 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        <linearGradient id="realproGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? "#60a5fa" : "#2563eb"} />
          <stop offset="100%" stopColor={isDark ? "#3b82f6" : "#1d4ed8"} />
        </linearGradient>
      </defs>

      <rect
        x="8"
        y="12"
        width="36"
        height="36"
        rx="8"
        fill="url(#realproGradient)"
      />

      <path
        d="M20 24 L26 30 L32 22"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <text
        x="54"
        y="38"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="24"
        fontWeight="700"
        letterSpacing="-0.02em"
        fill={isDark ? "#f4f4f4" : "#1b1b1b"}
      >
        Real
      </text>

      <text
        x="105"
        y="38"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="24"
        fontWeight="400"
        letterSpacing="-0.02em"
        fill={isDark ? "#a3a3a3" : "#737373"}
      >
        Pro
      </text>

      <rect
        x="54"
        y="44"
        width="50"
        height="2"
        rx="1"
        fill="url(#realproGradient)"
        opacity="0.5"
      />
    </svg>
  );
}

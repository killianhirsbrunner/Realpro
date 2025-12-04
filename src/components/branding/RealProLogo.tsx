interface RealProLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function RealProLogo({ className = '', width = 120, height = 36 }: RealProLogoProps) {
  return (
    <img
      src="/logos/realpro_bleu copy.svg"
      alt="RealPro"
      className={`realpro-logo ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        objectFit: 'contain',
        display: 'block'
      }}
    />
  );
}

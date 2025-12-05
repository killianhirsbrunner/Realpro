import { useRef, useEffect, useState } from 'react';
import { Eraser, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface SignatureCanvasProps {
  onSignatureChange?: (dataUrl: string | null) => void;
  width?: number;
  height?: number;
  penColor?: string;
  backgroundColor?: string;
}

export function SignatureCanvas({
  onSignatureChange,
  width = 600,
  height = 200,
  penColor = '#000000',
  backgroundColor = '#ffffff',
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }, [width, height, backgroundColor]);

  function startDrawing(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    setIsEmpty(false);
    if (onSignatureChange) {
      onSignatureChange(canvas.toDataURL('image/png'));
    }
  }

  function stopDrawing() {
    setIsDrawing(false);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    setIsEmpty(true);
    if (onSignatureChange) {
      onSignatureChange(null);
    }
  }

  function getSignatureData(): string | null {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return null;
    return canvas.toDataURL('image/png');
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg cursor-crosshair touch-none"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <div className="absolute top-2 right-2 text-xs text-neutral-400 dark:text-neutral-500 pointer-events-none">
          Signez ici
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={clearCanvas}
          disabled={isEmpty}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Effacer
        </Button>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Dessinez votre signature avec la souris ou le doigt
        </p>
      </div>
    </div>
  );
}

export default SignatureCanvas;

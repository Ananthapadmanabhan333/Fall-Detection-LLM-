import React, { useRef, useState, useEffect } from 'react';
import { Maximize2 } from 'lucide-react';

interface ScaledScreenFrameProps {
  title: string;
  onExpand?: () => void;
  aspectRatio?: string; // e.g. "16/10" or "16/10.5"
  children: React.ReactNode;
}

export const ScaledScreenFrame: React.FC<ScaledScreenFrameProps> = ({
  title,
  onExpand,
  aspectRatio = '16/10',
  children
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number>(0.38);

  const NATIVE_WIDTH = 1320;
  const NATIVE_HEIGHT = 840;

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      setScale(width / NATIVE_WIDTH);
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', updateScale);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={onExpand}
      className="relative w-full rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-[#0e1626] group cursor-pointer hover:border-emerald-500/60 transition-all duration-200"
      style={{
        aspectRatio: aspectRatio,
        height: `${NATIVE_HEIGHT * scale}px`
      }}
    >
      {/* Native Resolution Content Container scaled down */}
      <div
        style={{
          width: `${NATIVE_WIDTH}px`,
          height: `${NATIVE_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        className="absolute top-0 left-0 pointer-events-none select-none overflow-hidden bg-slate-50"
      >
        {children}
      </div>

      {/* Hover Overlay with Expand Action */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-105 bg-slate-900/90 text-white px-3.5 py-1.5 rounded-lg border border-slate-700 shadow-xl flex items-center gap-2 text-xs font-semibold backdrop-blur-xs">
          <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Expand {title}</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface BrutalShadowProps {
  children: React.ReactNode;
  color?: string;
  offsetX?: number;
  offsetY?: number;
  className?: string;
}

export default function BrutalShadow({
  children,
  color = '#19191b',
  offsetX = 8,
  offsetY = 8,
  className = '',
}: BrutalShadowProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <div 
        className="absolute -z-10"
        style={{
          top: `${offsetY}px`,
          left: `${offsetX}px`,
          right: `-${offsetX}px`,
          bottom: `-${offsetY}px`,
          backgroundColor: color,
        }}
      />
    </div>
  );
} 
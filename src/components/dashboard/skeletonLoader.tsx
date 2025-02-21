'use client';
import React from 'react';

export default function IOSSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-white">
      {/* Spinner container with relative positioning */}
      <div className="relative w-12 h-12">
        {/* Generate 12 bars in a loop */}
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute block w-2 h-5 bg-gray-500 left-5 top-0 rounded"
            style={{
              transformOrigin: 'center bottom',
              transform: `rotate(${(360 / 12) * i}deg)`,
              animation: 'ios-spinner 1.2s linear infinite',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Inline style for the keyframes (Next.js style JSX) */}
      <style jsx>{`
        @keyframes ios-spinner {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
}

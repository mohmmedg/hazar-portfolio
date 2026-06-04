/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  variant?: 'full' | 'emblem' | 'light';
  className?: string;
  lang?: 'en' | 'ar';
}

export default function Logo({ variant = 'full', className = 'w-64 h-64', lang = 'en' }: LogoProps) {
  if (variant === 'emblem') {
    // Elegant central Emblem: 'H' columns and calligraphic wave
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="100 100 300 200" 
        className={className}
      >
        <g strokeLinecap="round">
          {/* H Roman columns */}
          <path 
            d="M 180,120 L 210,120 M 195,120 L 195,280 M 180,280 L 210,280
               M 290,120 L 320,120 M 305,120 L 305,280 M 290,280 L 320,280" 
            stroke="currentColor" 
            strokeWidth="8" 
            strokeLinecap="square"
            className="text-gold"
          />
          
          {/* Calligraphic flow stroke */}
          <path 
            d="M 150,230 Q 210,150 280,235 Q 320,250 340,220 Q 360,190 340,190 Q 320,195 315,220" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="7" 
            className="text-white"
          />
        </g>
      </svg>
    );
  }

  if (variant === 'light') {
    // Full vector logo but with transparent background (uses text-white/gold)
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 500 500" 
        className={className}
      >
        <g fontFamily="'Times New Roman', Times, serif" textAnchor="middle">
          {/* H Columns */}
          <path 
            d="M 180,120 L 210,120 M 195,120 L 195,280 M 180,280 L 210,280
               M 290,120 L 320,120 M 305,120 L 305,280 M 290,280 L 320,280" 
            stroke="url(#goldGradient)" 
            strokeWidth="8" 
            strokeLinecap="square" 
          />
          
          {/* Wave */}
          <path 
            d="M 150,230 Q 210,150 280,235 Q 320,250 340,220 Q 360,190 340,190 Q 320,195 315,220" 
            fill="none" 
            stroke="#FFFFFF" 
            strokeWidth="7" 
            strokeLinecap="round" 
          />

          {/* Texts */}
          <text x="250" y="340" fill="#FFFFFF" fontSize="28" letterSpacing="4" fontWeight="bold">
            {lang === 'ar' ? 'هزار الغانم' : 'HAZAR ALGHANEM'}
          </text>
          
          <line x1="110" y1="360" x2="390" y2="360" stroke="#C9A84C" strokeWidth="2" />
          
          <text x="250" y="390" fill="#C9A84C" fontSize="14" letterSpacing="3" fontWeight="normal">
            {lang === 'ar' ? 'تصميم داخلي وخارجي' : 'INTERIOR & EXTERIOR DESIGN'}
          </text>
        </g>
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#A88934" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Full Circle Logo Badge - Selected as primary luxury badge by user's request
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 500 500" 
      className={className}
    >
      <circle cx="250" cy="250" r="240" fill="#0B132B" stroke="#C9A84C" strokeWidth="4" />

      <g fontFamily="'Times New Roman', Times, serif" textAnchor="middle">
        {/* Gradients defs */}
        <defs>
          <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFDF00" />
            <stop offset="50%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#967724" />
          </linearGradient>
        </defs>

        {/* H Roman columns */}
        <path 
          d="M 180,120 L 210,120 M 195,120 L 195,280 M 180,280 L 210,280
             M 290,120 L 320,120 M 305,120 L 305,280 M 290,280 L 320,280" 
          stroke="url(#logoGoldGrad)" 
          strokeWidth="8" 
          strokeLinecap="square" 
        />
        
        {/* Calligraphic wave path */}
        <path 
          d="M 150,230 Q 210,150 280,235 Q 320,250 340,220 Q 360,190 340,190 Q 320,195 315,220" 
          fill="none" 
          stroke="#FFFFFF" 
          strokeWidth="7" 
          strokeLinecap="round" 
        />

        {/* Brand texts */}
        <text 
          x="250" 
          y="340" 
          fill="#FFFFFF" 
          fontSize="28" 
          letterSpacing="4" 
          fontWeight="bold"
          className="tracking-[0.15em]"
        >
          {lang === 'ar' ? 'هزار الغانم' : 'HAZAR ALGHANEM'}
        </text>
        
        <line x1="110" y1="360" x2="390" y2="360" stroke="url(#logoGoldGrad)" strokeWidth="2" />
        
        <text 
          x="250" 
          y="390" 
          fill="url(#logoGoldGrad)" 
          fontSize="13" 
          letterSpacing="3" 
          fontWeight="medium"
        >
          {lang === 'ar' ? 'لتصاميم الديكور الداخلي والخارجي' : 'INTERIOR & EXTERIOR DESIGN'}
        </text>
      </g>
    </svg>
  );
}

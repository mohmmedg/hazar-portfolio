/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import logoSrc from './logo.svg';

interface LogoProps {
  variant?: 'full' | 'emblem' | 'light';
  className?: string;
  lang?: 'en' | 'ar';
  imageUrl?: string;
}

/**
 * Brand Logo.
 *
 * Renders the main logo (src/components/logo.svg) by default. If an
 * `imageUrl` is supplied (e.g. a custom logo uploaded by the admin via the
 * CMS), that takes priority over the default logo asset.
 */
const Logo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  className = 'w-12 h-12', 
  imageUrl 
}) => {
  const src = imageUrl || logoSrc;

  return (
    <img
      src={src}
      alt="Logo"
      className={className}
      draggable={false}
    />
  );
};

export default Logo;

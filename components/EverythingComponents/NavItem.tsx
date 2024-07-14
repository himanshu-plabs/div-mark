'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils'; // Adjust the path if necessary

interface NavItemProps {
  href: string;
  label: string;
}

const getBasePath = (path: string) => {
  const segments = path.split('/');
  return segments.length > 1 ? `/${segments[1]}` : path;
};

const NavItem: React.FC<NavItemProps> = ({ href, label }) => {
  const pathname = usePathname();
  const isActive = getBasePath(pathname) === getBasePath(href);

  return (
    <div className="relative">
      <div
        className={cn(
          'absolute top-[-50px] right-[-20px] bg-[#ff5924] h-[45px] w-[calc(100%+10px)] rounded-b-[20px] z-10 transition-all duration-300',
          isActive ? 'opacity-100' : 'opacity-0'
        )}
      ></div>
      <Link href={href} className={cn('ml-[30px] cursor-pointer', isActive ? 'text-[#cee2ff]' : 'text-[#748297]')}>
        {label}
      </Link>
    </div>
  );
};

export default NavItem;

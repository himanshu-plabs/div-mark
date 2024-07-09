// components/Navbar.tsx
import React from 'react';
import NavItem from './NavItem'; // Adjust the path if necessary

const navItems = [
  { href: '/everything', label: 'Everything' },
  { href: '/spaces', label: 'Spaces' },
  { href: '/serendipity', label: 'Serendipity' },
];

const Navbar: React.FC = () => {
  return (
    <div className="h-9 flex justify-end w-full font-nunito font-light text-lg text-[19px] pt-[10px]">
      {navItems.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </div>
  );
};

export default Navbar;
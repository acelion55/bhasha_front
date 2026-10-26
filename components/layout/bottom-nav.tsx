'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Layers, Info } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Classes', path: '/classes', icon: Layers }, 
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[var(--ceramic)] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-[100] pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-[7vh] min-h-[65px]">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? 'text-[var(--starbucks-green)]' : 'text-[var(--text-black-soft)]'
              }`}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              <span className="text-[1.2rem] font-bold tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

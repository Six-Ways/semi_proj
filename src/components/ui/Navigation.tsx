"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
}

export type { NavItem };

interface NavigationProps {
  items: NavItem[];
  className?: string;
}

export function Navigation({ items, className = "" }: NavigationProps) {
  const pathname = usePathname();
  
  return (
    <nav className={`flex flex-col space-y-1 ${className}`}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-link ${
            pathname === item.href ? "active" : ""
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
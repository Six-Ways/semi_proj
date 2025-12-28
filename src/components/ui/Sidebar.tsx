"use client";

import React from "react";
import { Navigation, NavItem } from "./Navigation";

interface SidebarProps {
  chapters: NavItem[];
  className?: string;
}

export function Sidebar({ chapters, className = "" }: SidebarProps) {
  return (
    <aside className={`sidebar ${className}`}>
      <div className="p-4">
        <h2 className="text-lg font-serif font-semibold mb-4 text-foreground">
          目录
        </h2>
        <Navigation items={chapters} />
      </div>
    </aside>
  );
}
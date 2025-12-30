"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { 
  BookOpen, 
  Home, 
  Menu, 
  X, 
  ChevronDown,
  Atom,
  Cpu,
  Microscope,
  Layers,
  TrendingUp,
  Settings,
  Zap
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

interface MainNavigationProps {
  className?: string;
}

export function MainNavigation({ className = "" }: MainNavigationProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navigationItems: NavItem[] = [
    {
      name: "首页",
      href: "/",
      icon: <Home size={18} />
    },
    {
      name: "课程大纲",
      href: "/chapters",
      icon: <BookOpen size={18} />,
      children: [
        {
          name: "序言",
          href: "/chapters/preface",
          icon: <BookOpen size={16} />
        },
        {
          name: "第一部分：微观基石",
          href: "/chapters/part0/ch0",
          icon: <Atom size={16} />
        },
        {
          name: "第二部分：载流子动力学",
          href: "/chapters/part1/ch1",
          icon: <Zap size={16} />
        }
      ]
    },
    {
      name: "实验室",
      href: "/lab",
      icon: <Microscope size={18} />
    },
    {
      name: "进度追踪",
      href: "/progress",
      icon: <TrendingUp size={18} />
    },
    {
      name: "设置",
      href: "/settings",
      icon: <Settings size={18} />
    }
  ];

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className={`bg-white shadow-md ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Cpu className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">半导体学习平台</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive(item.href)
                          ? "text-indigo-700 bg-indigo-50"
                          : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.name}
                      <ChevronDown 
                        size={16} 
                        className={`ml-1 transition-transform ${
                          openDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    {openDropdown === item.name && (
                      <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`flex items-center px-4 py-2 text-sm ${
                                pathname === child.href
                                  ? "text-indigo-700 bg-indigo-50"
                                  : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
                              }`}
                              onClick={() => setOpenDropdown(null)}
                            >
                              {child.icon && <span className="mr-2">{child.icon}</span>}
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(item.href)
                        ? "text-indigo-700 bg-indigo-50"
                        : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium ${
                        isActive(item.href)
                          ? "text-indigo-700 bg-indigo-50"
                          : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.name}
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${
                          openDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    {openDropdown === item.name && (
                      <div className="pl-6 pr-2 py-2 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                              pathname === child.href
                                ? "text-indigo-700 bg-indigo-50"
                                : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
                            }`}
                            onClick={() => {
                              setOpenDropdown(null);
                              setIsMenuOpen(false);
                            }}
                          >
                            {child.icon && <span className="mr-2">{child.icon}</span>}
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                      isActive(item.href)
                        ? "text-indigo-700 bg-indigo-50"
                        : "text-gray-700 hover:text-indigo-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
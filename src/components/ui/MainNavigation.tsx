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
  TrendingUp,
  Settings,
  Beaker,
  BrainCircuit,
  Zap,
  Activity
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

  // 知识体系结构，与chapters页面保持一致
  const knowledgeStructure = [
    {
      id: 'part0',
      title: '序章——半导体技术的发展历程',
      description: '认知：从"历史"到"现状"',
      chapters: [
        { number: 'CH.00', title: '半导体技术的发展历程与摩尔定律' },
      ]
    },
    {
      id: 'part1',
      title: '微观基石——材料、量子与载流子',
      description: '认知：从"是什么"到"为什么"',
      chapters: [
        { number: 'CH.01', title: '半导体材料与晶体结构（具象入门：认识"载体"）' },
        { number: 'CH.02', title: '量子力学基础与固体能带（抽象深入：电子的"能量规则"）' },
        { number: 'CH.03', title: '载流子统计与热平衡（量化描述：电荷的"数量规则"）' },
      ]
    },
    {
      id: 'part2',
      title: '载流子动力学——输运与非平衡',
      description: '认知：从"静态"到"动态"',
      chapters: [
        { number: 'CH.04', title: '载流子输运：漂移与扩散（基础运动：场与浓度梯度驱动）' },
        { number: 'CH.05', title: '非平衡载流子与复合动力学（生死规律：偏离平衡后的行为）' },
        { number: 'CH.06', title: '高场与量子输运（极端条件：偏离欧姆定律的行为）' },
      ]
    },
    {
      id: 'part3',
      title: '界面物理与能带调控',
      description: '认知：从"被动描述"到"主动设计"',
      chapters: [
        { number: 'CH.07', title: 'PN结物理（基础界面：最简单的"控电单元"）' },
        { number: 'CH.08', title: 'MOS结构物理（核心界面：MOSFET的"心脏"）' },
        { number: 'CH.09', title: '异质结与能带工程（进阶界面：定制化"能带结构"）' },
      ]
    },
    {
      id: 'part4',
      title: '核心器件物理',
      description: '认知：从"物理效应"到"功能器件"',
      chapters: [
        { number: 'CH.10', title: 'MOSFET：主流逻辑器件（核心重点）' },
        { number: 'CH.11', title: '双极与特种器件（补充扩展）' },
        { number: 'CH.12', title: '光电子与量子器件（功能扩展）' },
      ]
    },
    {
      id: 'part5',
      title: '制造工艺技术',
      description: '认知：从"设计图纸"到"实物芯片"',
      chapters: [
        { number: 'CH.13', title: '衬底与薄膜制备（基础准备：材料成型）' },
        { number: 'CH.14', title: '图形化与掺杂技术（核心工艺：器件成型）' },
        { number: 'CH.15', title: '工艺集成与后端互连（系统整合：芯片成型）' },
      ]
    },
    {
      id: 'part6',
      title: '表征、模型与设计',
      description: '认知：从"实物"到"应用"',
      chapters: [
        { number: 'CH.16', title: '材料与器件表征（性能验证）' },
        { number: 'CH.17', title: '紧凑模型与仿真（抽象建模）' },
        { number: 'CH.18', title: 'VLSI与SoC设计基础（工程应用）' },
      ]
    },
    {
      id: 'part7',
      title: '系统挑战与未来趋势',
      description: '认知：从"现有"到"未来"',
      chapters: [
        { number: 'CH.19', title: '系统级挑战：互连、功耗与可靠性' },
        { number: 'CH.20', title: '后摩尔时代的技术探索' },
      ]
    }
  ];

  // 生成导航项
  const generateNavigationItems = () => {
    // 创建五大知识项目模块的子菜单
    const courseOutlineChildren = [
      {
        name: "半导体器件与工艺全景",
        href: "/chapters",
        icon: <Beaker size={16} />,
        children: knowledgeStructure.map(section => {
          // 为每个半导体部分创建子菜单，包含该部分的所有章节
          const sectionChildren = section.chapters.map(chapter => {
            // 确定章节ID
            const chapterId = `ch${parseInt(chapter.number.slice(3))}`;
            return {
              name: chapter.title,
              href: `/chapters/${section.id}/${chapterId}`,
              icon: <BookOpen size={16} />
            };
          });

          return {
            name: section.title,
            href: `/chapters/${section.id}/${section.chapters[0] ? `ch${parseInt(section.chapters[0].number.slice(3))}` : ''}`,
            icon: <Atom size={16} />,
            children: sectionChildren
          };
        })
      },
      {
        name: "计算机体系结构",
        href: "#",
        icon: <Cpu size={16} />,
        children: [
          {
            name: "敬请期待",
            href: "#",
            icon: <BookOpen size={16} />
          }
        ]
      },
      {
        name: "人工智能",
        href: "#",
        icon: <BrainCircuit size={16} />,
        children: [
          {
            name: "敬请期待",
            href: "#",
            icon: <BookOpen size={16} />
          }
        ]
      },
      {
        name: "先进材料科学",
        href: "#",
        icon: <Zap size={16} />,
        children: [
          {
            name: "敬请期待",
            href: "#",
            icon: <BookOpen size={16} />
          }
        ]
      },
      {
        name: "生物信息学",
        href: "#",
        icon: <Activity size={16} />,
        children: [
          {
            name: "敬请期待",
            href: "#",
            icon: <BookOpen size={16} />
          }
        ]
      }
    ];

    // 完整导航项
    return [
      {
        name: "首页",
        href: "/",
        icon: <Home size={18} />
      },
      {
        name: "课程大纲",
        href: "/chapters",
        icon: <BookOpen size={18} />,
        children: courseOutlineChildren
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
  };

  const navigationItems: NavItem[] = generateNavigationItems();

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
                      <div className="absolute z-500 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
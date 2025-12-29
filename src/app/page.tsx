"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AccessibleButton } from "@/components/ui/AccessibleButton";
import { AccessibleCard } from "@/components/ui/AccessibleCard";
import { BlockMath } from "@/components/math/MathFormula";
import { ChevronRight, BookOpen, Microscope, Cpu, Zap, Atom, Layers, TrendingUp, Settings, Activity, Beaker } from "lucide-react";
import { ChapterConnectionMap } from "@/components/ui/ChapterConnectionMap";
import { LaboratoryDrawer } from "@/components/ui/LaboratoryDrawer";
import { VerticalTimeline, KnowledgeChainProgress } from "@/components/ui/VerticalTimeline";
import { DefaultSkipLinks } from "@/components/ui/SkipLink";
import { 
  useFocusManagement, 
  useKeyboardNavigation, 
  useScreenReaderAnnouncement, 
  useReducedMotion,
  generateId
} from "@/utils/accessibility";

// 章节数据定义
const sectionsData = [
  {
    id: "preface",
    title: "序言",
    subtitle: "硅基文明的基石与演进",
    description: "从沙子到芯片，探索半导体如何改变世界",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    chapters: [
      {
        id: "preface",
        number: "00",
        title: "硅基文明的基石与演进",
        formula: "\\text{Moore's Law: } \\text{Transistors} \\propto 2^{\\text{years}/2}",
        description: "半导体技术如何定义信息时代",
        corePoints: [
          "回顾关键里程碑：晶体管发明→集成电路→摩尔定律迭代",
          "解析'尺度微缩'的核心驱动力与瓶颈",
          "预判后摩尔时代的技术范式"
        ],
        simulator: "timeline"
      }
    ]
  },
  {
    id: "part1",
    title: "第一部分",
    subtitle: "微观基石——材料、量子与载流子",
    description: "半导体材料、量子力学基础与载流子统计",
    icon: Atom,
    color: "from-purple-500 to-indigo-500",
    chapters: [
      {
        id: "ch1",
        number: "01",
        title: "半导体材料与晶体结构",
        formula: "a_{Si} = 5.43 \\text{Å}",
        description: "具象入门：认识'载体'",
        corePoints: [
          "硅的晶体结构：金刚石立方晶格",
          "晶向、晶面与密勒指数",
          "缺陷与杂质：位错、空位、替位/间隙杂质"
        ],
        simulator: "crystal"
      },
      {
        id: "ch2",
        number: "02",
        title: "量子力学基础与固体能带",
        formula: "E = \\hbar^2 k^2 / 2m^*",
        description: "抽象深入：电子的'能量规则'",
        corePoints: [
          "量子力学基本概念：波粒二象性、薛定谔方程",
          "固体能带理论：价带、导带与禁带",
          "有效质量与态密度"
        ],
        simulator: "band"
      },
      {
        id: "ch3",
        number: "03",
        title: "载流子统计与热平衡",
        formula: "n_i = \\sqrt{N_c N_v} e^{-E_g/2kT}",
        description: "量化描述：电荷的'数量规则'",
        corePoints: [
          "费米-狄拉克分布与费米能级",
          "本征载流子浓度与温度关系",
          "掺杂：施主/受主与载流子浓度计算"
        ],
        simulator: "fermi"
      }
    ]
  },
  {
    id: "part2",
    title: "第二部分",
    subtitle: "载流子动力学——输运与非平衡",
    description: "载流子输运、非平衡载流子与高场效应",
    icon: Activity,
    color: "from-green-500 to-emerald-500",
    chapters: [
      {
        id: "ch4",
        number: "04",
        title: "载流子输运：漂移与扩散",
        formula: "J = q\\mu nE + qD\\frac{dn}{dx}",
        description: "基础运动：场与浓度梯度驱动",
        corePoints: [
          "漂移运动：迁移率与电导率",
          "扩散运动：菲克定律与爱因斯坦关系",
          "连续性方程与稳态解"
        ],
        simulator: "transport"
      },
      {
        id: "ch5",
        number: "05",
        title: "非平衡载流子与复合动力学",
        formula: "\\frac{\\Delta n}{dt} = G - R - \\frac{\\Delta n}{\\tau}",
        description: "生死规律：偏离平衡后的行为",
        corePoints: [
          "产生与复合机制：直接复合、间接复合",
          "载流子寿命与复合中心",
          "表面复合与俄歇复合"
        ],
        simulator: "recombination"
      },
      {
        id: "ch6",
        number: "06",
        title: "高场与量子输运",
        formula: "v_{sat} \\approx 10^7 \\text{ cm/s}",
        description: "极端条件：偏离欧姆定律的行为",
        corePoints: [
          "速度饱和效应：高场下迁移率下降",
          "强场效应：碰撞电离与雪崩击穿",
          "量子输运现象：隧穿效应与热电子发射"
        ],
        simulator: "highfield"
      }
    ]
  },
  {
    id: "part3",
    title: "第三部分",
    subtitle: "界面物理与能带调控",
    description: "PN结、MOS结构与异质结物理",
    icon: Layers,
    color: "from-orange-500 to-red-500",
    chapters: [
      {
        id: "ch7",
        number: "07",
        title: "PN结物理",
        formula: "V_{bi} = \\frac{kT}{q} \\ln\\left(\\frac{N_A N_D}{n_i^2}\\right)",
        description: "基础界面：最简单的'控电单元'",
        corePoints: [
          "PN结的形成：扩散与空间电荷区",
          "结电容与击穿特性",
          "PN结的温度特性"
        ],
        simulator: "pnjunction"
      },
      {
        id: "ch8",
        number: "08",
        title: "MOS结构物理",
        formula: "C_{ox} = \\frac{\\varepsilon_{ox}}{t_{ox}}",
        description: "核心界面：MOSFET的'心脏'",
        corePoints: [
          "MOS电容：积累、耗尽与反型",
          "阈值电压与平带电压",
          "界面态与固定电荷"
        ],
        simulator: "moscap"
      },
      {
        id: "ch9",
        number: "09",
        title: "异质结与能带工程",
        formula: "\\Delta E_c = \\chi_1 - \\chi_2",
        description: "进阶界面：定制化'能带结构'",
        corePoints: [
          "异质结能带对齐：I型、II型与III型",
          "量子阱与超晶格结构",
          "应变工程与能带调控"
        ],
        simulator: "heterojunction"
      }
    ]
  },
  {
    id: "part4",
    title: "第四部分",
    subtitle: "核心器件物理",
    description: "MOSFET、双极与特种器件",
    icon: Cpu,
    color: "from-pink-500 to-rose-500",
    chapters: [
      {
        id: "ch10",
        number: "10",
        title: "MOSFET：主流逻辑器件",
        formula: "I_D = \\frac{\\mu C_{ox} W}{2L}(V_{GS} - V_T)^2",
        description: "核心重点",
        corePoints: [
          "MOSFET工作原理：线性区与饱和区",
          "短沟道效应：阈值电压下降与漏致势垒降低",
          "MOSFET的尺寸缩放与性能限制"
        ],
        simulator: "mosfet"
      },
      {
        id: "ch11",
        number: "11",
        title: "双极与特种器件",
        formula: "\\beta = \\frac{I_C}{I_B}",
        description: "补充扩展",
        corePoints: [
          "BJT工作原理：放大区与饱和区",
          "GTR、IGBT与功率器件",
          "晶闸管与可控硅整流器"
        ],
        simulator: "bjt"
      },
      {
        id: "ch12",
        number: "12",
        title: "光电子与量子器件",
        formula: "E_g = \\frac{hc}{\\lambda}",
        description: "功能扩展",
        corePoints: [
          "LED与激光器：电致发光原理",
          "光电二极管与太阳能电池",
          "量子点与单电子晶体管"
        ],
        simulator: "optoelectronic"
      }
    ]
  },
  {
    id: "part5",
    title: "第五部分",
    subtitle: "制造工艺技术",
    description: "衬底制备、图形化与工艺集成",
    icon: Settings,
    color: "from-teal-500 to-cyan-500",
    chapters: [
      {
        id: "ch13",
        number: "13",
        title: "衬底与薄膜制备",
        formula: "t_{SiO_2} = 0.46 \\times t_{Si}",
        description: "基础准备：材料成型",
        corePoints: [
          "晶体生长：直拉法与区熔法",
          "外延生长：同质外延与异质外延",
          "薄膜沉积：CVD与PVD技术"
        ],
        simulator: "substrate"
      },
      {
        id: "ch14",
        number: "14",
        title: "图形化与掺杂技术",
        formula: "R_j = \\sqrt{2Dt}",
        description: "核心工艺：器件成型",
        corePoints: [
          "光刻技术：曝光、显影与刻蚀",
          "掺杂技术：离子注入与热扩散",
          "薄膜生长与金属化"
        ],
        simulator: "patterning"
      },
      {
        id: "ch15",
        number: "15",
        title: "工艺集成与后端互连",
        formula: "RC = \\rho \\frac{L}{A} \\times C",
        description: "系统整合：芯片成型",
        corePoints: [
          "CMOS工艺流程：前道与后道工艺",
          "互连技术：铝互连与铜互连",
          "封装与测试"
        ],
        simulator: "integration"
      }
    ]
  },
  {
    id: "part6",
    title: "第六部分",
    subtitle: "表征、模型与设计",
    description: "器件表征、紧凑模型与VLSI设计",
    icon: Microscope,
    color: "from-indigo-500 to-purple-500",
    chapters: [
      {
        id: "ch16",
        number: "16",
        title: "材料与器件表征",
        formula: "R_{sheet} = \\frac{\\pi}{\\ln 2} \\frac{V}{I}",
        description: "性能验证",
        corePoints: [
          "材料表征：四探针法、霍尔效应",
          "器件表征：I-V测试、C-V测试",
          "可靠性测试：HCI、NBTI"
        ],
        simulator: "characterization"
      },
      {
        id: "ch17",
        number: "17",
        title: "紧凑模型与仿真",
        formula: "I_{DS} = f(V_{GS}, V_{DS}, V_{BS}, T)",
        description: "抽象建模",
        corePoints: [
          "紧凑模型的意义与BSIM系列",
          "模型参数提取与物理意义",
          "SPICE仿真与PDK"
        ],
        simulator: "modeling"
      },
      {
        id: "ch18",
        number: "18",
        title: "VLSI与SoC设计基础",
        formula: "P = CV^2f",
        description: "工程应用",
        corePoints: [
          "从器件到电路：CMOS逻辑门",
          "数字设计流程：RTL到GDSII",
          "SoC异构集成与IP核"
        ],
        simulator: "vlsi"
      }
    ]
  },
  {
    id: "part7",
    title: "第七部分",
    subtitle: "系统挑战与未来趋势",
    description: "系统级挑战与后摩尔时代技术探索",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-500",
    chapters: [
      {
        id: "ch19",
        number: "19",
        title: "系统级挑战：互连、功耗与可靠性",
        formula: "P_{dyn} = \\alpha CV^2f",
        description: "现状-问题",
        corePoints: [
          "互连挑战：RC延迟与电迁移",
          "功耗挑战：动态功耗与静态功耗",
          "可靠性挑战：HCI、NBTI、EM"
        ],
        simulator: "challenges"
      },
      {
        id: "ch20",
        number: "20",
        title: "后摩尔时代的技术探索",
        formula: "\\lambda_{TFET} < 60 \\text{ mV/dec}",
        description: "解决方案",
        corePoints: [
          "新材料：二维材料、高迁移率材料",
          "新器件：TFET、NCFET、自旋电子器件",
          "新范式：Chiplet、硅光子学、存算一体"
        ],
        simulator: "future"
      }
    ]
  }
];



// 垂直进度条组件
function VerticalProgressBar({ currentSection, currentChapter }: { 
  currentSection: number, 
  currentChapter: number 
}) {
  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      <div className="bg-white rounded-full shadow-lg p-4">
        <div className="h-64 w-1 bg-gray-200 relative">
          <div 
            className="absolute top-0 left-0 w-1 bg-indigo-500 transition-all duration-300"
            style={{ height: `${(currentChapter / 20) * 100}%` }}
          ></div>
          
          <div className="absolute -right-16 top-0 text-xs font-mono text-gray-600 whitespace-nowrap">
            {String(currentSection).padStart(2, '0')}/07 Sections
          </div>
          
          <div className="absolute -right-16 bottom-0 text-xs font-mono text-gray-600 whitespace-nowrap">
            {String(currentChapter).padStart(2, '0')}/20 Chapters
          </div>
          
          <div 
            className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-1 transition-all duration-300"
            style={{ top: `${(currentChapter / 20) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// SVG连接线组件
function ConnectionLines() {
  return (
    <svg className="absolute inset-0 pointer-events-none z-10" width="100%" height="100%">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      {/* 这里可以添加章节之间的连接线 */}
      {/* 示例连接线 */}
      <path
        d="M 200 300 Q 400 350 600 300"
        stroke="#e2e8f0"
        strokeWidth="1"
        fill="none"
        strokeDasharray="5,5"
        className="animate-pulse"
      />
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chapterRefs = useRef<Map<string, HTMLElement>>(new Map());
  const focusAnnouncementRef = useRef<HTMLDivElement>(null);
  
  // Function to announce focus changes
  const announceFocus = (chapterNumber: number) => {
    if (focusAnnouncementRef.current) {
      const chapter = sectionsData.flatMap(section => section.chapters).find(ch => ch.number === String(chapterNumber).padStart(2, '0'));
      if (chapter) {
        focusAnnouncementRef.current.textContent = `当前聚焦：第${chapterNumber}章，${chapter.title}`;
      }
    }
  };
  
  // 无障碍功能
  const prefersReducedMotion = useReducedMotion();
  const { announce } = useScreenReaderAnnouncement();
  const { elementRef: mainContentRef } = useFocusManagement();
  
  // 生成唯一ID
  const mainContentId = generateId('main-content');
  const navigationId = generateId('navigation');
  const chapterIndexId = generateId('chapter-index');
  
  // 滚动监听，更新进度条
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const progress = scrollPosition / (documentHeight - windowHeight);
      const chapterProgress = Math.floor(progress * 20);
      const sectionProgress = Math.floor(progress * 7);
      
      setCurrentChapter(chapterProgress);
      setCurrentSection(sectionProgress);
      
      // 为屏幕阅读器公告当前浏览进度
      if (chapterProgress % 5 === 0 && chapterProgress !== 0) { // 每5章公告一次
        announce(`当前浏览进度：第${chapterProgress}章，共20章`);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [announce]);
  
  // 计算相关章节（前置和后续）
  const getRelatedChapters = (chapterId: string) => {
    const allChapters = sectionsData.flatMap(section => section.chapters);
    const currentIndex = allChapters.findIndex(ch => ch.id === chapterId);
    
    const related = [];
    if (currentIndex > 0) related.push(allChapters[currentIndex - 1].id);
    if (currentIndex < allChapters.length - 1) related.push(allChapters[currentIndex + 1].id);
    
    return related;
  };

  // Enhanced keyboard navigation for chapter cards
  const handleKeyDown = (e: React.KeyboardEvent, chapterNumber: number) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        announce(`正在进入第${chapterNumber}章`);
        const chapter = sectionsData.flatMap(section => section.chapters).find(ch => ch.number === String(chapterNumber).padStart(2, '0'));
        if (chapter) {
          // 如果是序言，直接导航到序言页面
          if (chapter.id === "preface" || chapter.number === "00") {
            router.push('/chapters/preface');
          } else {
            openDrawer(chapter);
          }
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        const nextCard = document.querySelector(`[data-chapter="${chapterNumber + 1}"]`);
        if (nextCard) {
          (nextCard as HTMLElement).focus();
          announceFocus(chapterNumber + 1);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        const prevCard = document.querySelector(`[data-chapter="${chapterNumber - 1}"]`);
        if (prevCard) {
          (prevCard as HTMLElement).focus();
          announceFocus(chapterNumber - 1);
        }
        break;
      case 'Home':
        e.preventDefault();
        const firstCard = document.querySelector('[data-chapter="1"]');
        if (firstCard) {
          (firstCard as HTMLElement).focus();
          announceFocus(1);
        }
        break;
      case 'End':
        e.preventDefault();
        const lastCard = document.querySelector('[data-chapter="20"]');
        if (lastCard) {
          (lastCard as HTMLElement).focus();
          announceFocus(20);
        }
        break;
    }
  };
  
  const openDrawer = (chapter: any) => {
    // 如果是序言，直接导航到序言页面
    if (chapter.id === "preface" || chapter.number === "00") {
      router.push('/chapters/preface');
      return;
    }
    
    setSelectedChapter(chapter);
    setIsDrawerOpen(true);
    announce(`已打开章节预览：${chapter.title}`);
  };
  
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    announce('章节预览已关闭');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white relative">
      {/* 跳转链接 */}
      <DefaultSkipLinks />
      
      {/* Keyboard navigation help */}
      <div className="sr-only" role="note" aria-label="键盘导航帮助">
        <p>使用Tab键导航到章节卡片，使用Enter或空格键选择章节，使用左右箭头键在章节间导航，使用Home键跳到第一章，使用End键跳到最后一章。</p>
      </div>
      
      {/* 英雄区域 */}
      <section 
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white"
        role="banner"
        aria-labelledby="hero-title"
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" aria-hidden="true"></div>
        <div className="relative container mx-auto px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 id="hero-title" className="text-4xl font-bold tracking-tight sm:text-6xl font-serif">
              半导体器件与工艺全景
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              认知驱动型知识大纲：从微观基石到未来趋势的完整学习路径
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/chapters" passHref legacyBehavior>
                <AccessibleButton
                  size="lg" 
                  className="bg-white text-slate-900 hover:bg-slate-100"
                  announceClick={true}
                  clickAnnouncement="导航到章节索引页面"
                  aria-label="开始学习半导体知识"
                  includeAnnouncement={false}
                >
                  开始学习
                  <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </AccessibleButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 七大区块 */}
      <main 
        ref={mainContentRef}
        id={mainContentId}
        className="container mx-auto px-6 py-12 lg:px-8"
        role="main"
        aria-label="半导体知识体系章节内容"
      >
        {sectionsData.map((section, sectionIndex) => {
          const IconComponent = section.icon;
          
          return (
            <section 
              key={section.id} 
              className="mb-16"
              ref={el => { 
                if (el) sectionRefs.current[sectionIndex] = el as HTMLDivElement; 
              }}
              aria-labelledby={`section-${sectionIndex}-title`}
            >
              {/* 区块标题 */}
              <header className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mb-4" aria-hidden="true">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h2 id={`section-${sectionIndex}-title`} className="text-3xl font-bold text-gray-900 font-serif">
                  {section.title}
                </h2>
                <h3 className="text-xl text-gray-600 font-serif mt-1">
                  {section.subtitle}
                </h3>
                <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                  {section.description}
                </p>
              </header>
              
              {/* 章节卡片网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label={`${section.title}章节列表`}>
                {section.chapters.map((chapter, chapterIndex) => {
                  const isHovered = hoveredChapter === chapter.id;
                  const relatedChapters = getRelatedChapters(chapter.id);
                  const isRelated = isHovered && relatedChapters.includes(chapter.id);
                  
                  return (
                    <AccessibleCard
                      key={chapter.id}
                      interactive={true}
                      heading={chapter.title}
                      headingLevel={3}
                      description={chapter.description}
                      announceSelection={true}
                      selectionAnnouncement={`选择章节 ${chapter.number}: ${chapter.title}`}
                      onSelectionChange={() => openDrawer(chapter)}
                      className={`relative transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isHovered ? "z-20 scale-105" : "z-10"
                      }`}
                      onMouseEnter={() => setHoveredChapter(chapter.id)}
                      onMouseLeave={() => setHoveredChapter(null)}
                      onKeyDown={(e) => handleKeyDown(e, parseInt(chapter.number))}
                      onFocus={() => announceFocus(parseInt(chapter.number))}
                      onBlur={() => {
                        if (focusAnnouncementRef.current) {
                          focusAnnouncementRef.current.textContent = '';
                        }
                      }}
                      data-chapter={chapter.number}
                      tabIndex={0}
                      role="button"
                      aria-label={`第${chapter.number}章：${chapter.title}`}
                      aria-describedby={`chapter-desc-${chapter.id}`}
                      ref={el => {
                        if (el) {
                          chapterRefs.current.set(chapter.id, el);
                        }
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-5`} aria-hidden="true"></div>
                      
                      <div className="relative pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono text-gray-500" aria-label={`章节编号 ${chapter.number}`}>
                            {chapter.number}
                          </span>
                          <div 
                            className={`w-8 h-8 rounded-full bg-gradient-to-r ${section.color} opacity-80 flex items-center justify-center`}
                            aria-hidden="true"
                          >
                            <span className="text-white text-xs font-bold">
                              {chapterIndex + 1}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-lg font-serif leading-tight">
                          {chapter.title}
                        </h3>
                      </div>
                      
                      <div className="relative pt-0">
                        <div className="bg-slate-50 p-3 rounded-lg mb-3" role="img" aria-label={`章节公式：${chapter.formula}`}>
                          <div className="text-center text-sm">
                            <BlockMath formula={chapter.formula} />
                          </div>
                        </div>
                        
                        <p 
                          id={`chapter-desc-${chapter.id}`}
                          className="text-sm text-gray-600 mb-3"
                        >
                          {chapter.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            点击查看详情
                          </span>
                          <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        </div>
                      </div>
                    </AccessibleCard>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* 知识链连接线 */}
      <div aria-hidden="true">
        <ChapterConnectionMap 
          hoveredChapter={hoveredChapter}
          chapterRefs={chapterRefs}
        />
      </div>

      {/* 垂直时间轴/进度条 */}
      <div aria-hidden="true">
        <VerticalTimeline 
          sectionRefs={sectionRefs}
          totalSections={7}
          totalChapters={20}
        />
      </div>

      {/* 底部知识链进度指示器 */}
      <div aria-hidden="true">
        <KnowledgeChainProgress 
          currentChapter={currentChapter}
          totalChapters={20}
        />
      </div>

      {/* 实验抽屉 */}
      {selectedChapter && (
        <LaboratoryDrawer 
          chapter={selectedChapter} 
          isOpen={isDrawerOpen} 
          onClose={closeDrawer} 
        />
      )}

      {/* 页脚 */}
      <footer className="bg-slate-900 text-white py-12 mt-16" role="contentinfo">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 半导体器件与工艺全景 - 认知驱动型知识大纲
            </p>
            <p className="mt-2 text-gray-500 text-sm">
              基于 Next.js 16、Tailwind CSS 和 KaTeX 构建
            </p>
          </div>
        </div>
      </footer>
      
      {/* Live region for chapter focus announcements */}
      <div 
        ref={focusAnnouncementRef}
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      />
    </div>
  );
}
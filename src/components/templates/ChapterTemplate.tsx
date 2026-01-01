"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Target, Lightbulb, CheckCircle, ArrowRight, Brain, Link, Zap } from "lucide-react";
import { ChapterNavigation } from "./ChapterNavigation";
import { 
  ScrollAnimationContainer, 
  ScrollText, 
  ScrollIndicator,
  ScrollProgressBar
} from "./ScrollAnimation";
import { SyncProvider, SyncableFormula, SyncableText, SyncableVisualization, SyncableKeyword } from "./SyncSystem";
import { 
  ChapterTransitionProvider, 
  ChapterTransitionContainer, 
  ChapterTransitionNavigation,
  useChapterTransition 
} from "./ChapterTransition";
import { DefaultSkipLinks } from "@/components/ui/SkipLink";
import { 
  useFocusManagement, 
  useKeyboardNavigation, 
  useScreenReaderAnnouncement, 
  useReducedMotion,
  ARIA_ROLES,
  generateId,
  generateHeadingId
} from "@/utils/accessibility";

// 目录项类型
interface TocItem {
  level: number;
  text: string;
  id: string;
}

// 章节模板组件的属性接口
interface ChapterTemplateProps {
  // 标题
  title: string;
  chapterNumber: string;
  
  // 本章逻辑位
  logicalPosition: string;
  
  // 章节目标
  objectives: string[];
  
  // 核心内容
  coreContent: string[];
  
  // 关键词
  keywords: string[];
  
  // 前置认知提示
  prerequisitePrompt: string;
  
  // 起手式
  openingLine: string;
  
  // 正文
  mainContent: Array<{
    title?: string;
    content: string;
    visualIndex?: string;
  }>;
  
  // 章节逻辑链
  logicalChain: string;
  
  // 本章小结
  chapterSummary: string;
  
  // 欲知后事如何且听下回分解
  nextChapterPreview: string;
  
  // 宗门心法
  sectMentality: {
    overview: string;
    breakthrough: string[];
    corePrinciple: string;
  };
  
  // 目录
  toc: TocItem[];
  
  // 子组件（用于MDX内容）
  children?: React.ReactNode;
  
  // 导航回调
  onPreviousChapter?: () => void;
  onNextChapter?: () => void;
  onChapterSelect?: (chapter: number) => void;
}

export function ChapterTemplate({
  title,
  chapterNumber,
  logicalPosition,
  objectives,
  coreContent,
  keywords,
  prerequisitePrompt,
  openingLine,
  mainContent,
  logicalChain,
  chapterSummary,
  nextChapterPreview,
  sectMentality,
  toc,
  children,
  onPreviousChapter,
  onNextChapter,
  onChapterSelect,
}: ChapterTemplateProps) {
  // 状态管理
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isContentFocused, setIsContentFocused] = useState(false);
  // 目录显示状态（用于小屏幕）
  const [isTocOpen, setIsTocOpen] = useState(false);
  // 滚动方向和位置状态
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  
  // 无障碍功能
  const prefersReducedMotion = useReducedMotion();
  const { announce, AnnouncementComponent } = useScreenReaderAnnouncement();
  const { elementRef: mainContentRef, trapFocus } = useFocusManagement();
  
  // 滚动相关
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, [0, 1000], [0, 1]);
  
  // 滚动进度更新和header显示控制
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      // 计算滚动方向
      const direction = latest > lastScrollY ? 'down' : 'up';
      setScrollDirection(direction);
      
      // 计算滚动进度
      const progress = Math.min(latest / 1000, 1);
      setScrollProgress(progress);
      
      // 当滚动到正文区域时，让固定模板略微半透明
      setIsContentFocused(progress > 0.2 && progress < 0.8);
      
      // 为屏幕阅读器公告当前阅读进度
      if (Math.round(progress * 100) % 25 === 0) { // 每25%公告一次
        const progressPercent = Math.round(progress * 100);
        announce(`章节阅读进度：${progressPercent}%`);
      }
      
      // 控制header显示/隐藏
      // 只有当滚动距离超过50px且方向向下时才隐藏
      // 当方向向上时显示
      if (direction === 'down' && latest - lastScrollY > 2 && latest > 50) {
        setIsHeaderVisible(false);
      } else if (direction === 'up' && lastScrollY - latest > 2) {
        setIsHeaderVisible(true);
      }
      
      // 更新上次滚动位置
      setLastScrollY(latest);
    });
    
    return unsubscribe;
  }, [scrollY, lastScrollY, announce]);
  
  // 生成唯一ID
  const mainContentId = generateId('main-content');
  const navigationId = generateId('navigation');
  
  return (
    <ChapterTransitionProvider>
      <ChapterTransitionContainer chapterKey={`chapter-${chapterNumber}`}>
        <SyncProvider>
          {/* 跳转链接 */}
          <DefaultSkipLinks />
          
          <div ref={containerRef} className="min-h-screen bg-[#f8fafc] text-[#1e293b]">
            {/* 滚动进度条 */}
            <ScrollProgressBar color="#007AFF" height={3} />
            
            {/* 章首导航 Header */}
            <motion.header 
              className="sticky top-0 z-40 bg-[#f8fafc]/95 backdrop-blur-sm border-b border-gray-200"
              initial={{ y: -20, opacity: 0 }}
              animate={{ 
                y: isHeaderVisible ? 0 : -100, 
                opacity: isHeaderVisible ? 1 : 0 
              }}
              transition={{ 
                duration: 0.3, 
                ease: "easeInOut",
                delay: 0.1
              }}
              role="banner"
              id={navigationId}
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* 章节编号 */}
                    <div className="font-mono text-sm font-bold text-[#007AFF]" aria-label={`章节编号 ${chapterNumber}`}>
                      {chapterNumber}
                    </div>
                    
                    {/* 章节标题 */}
                    <h1 className="font-serif text-2xl font-bold text-[#1e293b]">
                      {title}
                    </h1>
                  </div>
                  
                  {/* 导航按钮 */}
                  <nav className="flex items-center space-x-2" aria-label="章节导航">
                    {/* 返回上级页面按钮 */}
                    <Link
                      href="/chapters"
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                      aria-label="返回章节列表"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Link>
                    
                    {onPreviousChapter && (
                      <button
                        onClick={onPreviousChapter}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                        aria-label="上一章"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                    )}
                    
                    {onNextChapter && (
                      <button
                        onClick={onNextChapter}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                        aria-label="下一章"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    )}
                  </nav>
                </div>
              </div>
            </motion.header>
            
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              {/* 小屏幕目录切换按钮 */}
              {toc.length > 1 && (
                <div className="lg:hidden mb-6 flex justify-end">
                  <button
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                    aria-expanded={isTocOpen}
                    aria-label={isTocOpen ? "关闭目录" : "打开目录"}
                  >
                    <BookOpen className="h-4 w-4 text-[#007AFF]" />
                    <span className="text-sm font-medium">{isTocOpen ? "关闭目录" : "章节目录"}</span>
                  </button>
                </div>
              )}
              
              {/* 小屏幕可折叠目录 */}
              {toc.length > 1 && isTocOpen && (
                <motion.div
                  className="lg:hidden mb-6 bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  aria-label="章节目录"
                >
                  <h2 className="font-serif text-lg font-semibold mb-4 text-[#1e293b] flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#007AFF]" />
                    章节目录
                  </h2>
                  <nav className="space-y-1">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm transition-colors hover:text-[#007AFF] py-1.5 ${item.level === 2 ? 'font-medium text-gray-800' : `text-gray-600 pl-${(item.level - 2) * 4}`}`}
                        aria-label={`跳转到 ${item.text}`}
                        onClick={() => setIsTocOpen(false)}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </motion.div>
              )}
              
              {/* 主内容区域：左侧目录 + 右侧内容 */}
              <div className="lg:flex lg:gap-8">
                {/* 左侧：目录（仅在大屏幕显示） */}
                {toc.length > 1 && (
                  <motion.aside
                    className="hidden lg:block sticky top-24 w-64"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    aria-label="章节目录"
                  >
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                      <h2 className="font-serif text-lg font-semibold mb-4 text-[#1e293b] flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-[#007AFF]" />
                        章节目录
                      </h2>
                      <nav className="space-y-1">
                        {toc.map((item) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            className={`block text-sm transition-colors hover:text-[#007AFF] py-1.5 ${item.level === 2 ? 'font-medium text-gray-800' : `text-gray-600 pl-${(item.level - 2) * 4}`}`}
                            aria-label={`跳转到 ${item.text}`}
                          >
                            {item.text}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </motion.aside>
                )}
                
                {/* 右侧：主要内容 */}
                <main className="lg:flex-1">
                  {/* 本章逻辑位 */}
                  <motion.section
                    className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Link className="h-5 w-5 text-[#007AFF]" />
                      <h2 className="font-serif text-xl font-semibold">本章逻辑位</h2>
                    </div>
                    <p className="font-serif text-lg text-gray-700 italic">
                      {logicalPosition}
                    </p>
                  </motion.section>
                  
                  {/* 章节目标 */}
                  <motion.section
                    className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Target className="h-5 w-5 text-[#007AFF]" />
                      <h2 className="font-serif text-xl font-semibold">章节目标</h2>
                    </div>
                    <ul className="space-y-3">
                      {objectives.map((objective, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-[#007AFF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-[#007AFF]"></div>
                          </div>
                          <p className="text-gray-700">{objective}</p>
                        </li>
                      ))}
                    </ul>
                  </motion.section>
                  
                  {/* 核心内容 */}
                  <motion.section
                    className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <BookOpen className="h-5 w-5 text-[#007AFF]" />
                      <h2 className="font-serif text-xl font-semibold">核心内容</h2>
                    </div>
                    <div className="space-y-4">
                      {coreContent.map((content, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-[#007AFF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-[#007AFF]"></div>
                          </div>
                          <p className="text-gray-700">{content}</p>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                  
                  {/* 关键词 */}
                  <motion.section
                    className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Zap className="h-5 w-5 text-[#007AFF]" />
                      <h2 className="font-serif text-xl font-semibold">关键词</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {keywords.map((keyword, index) => (
                        <SyncableKeyword
                          key={index}
                          id={`keyword-${index}`}
                          term={keyword}
                          definition={`${keyword}的定义和解释`}
                          relatedIds={[]}
                        />
                      ))}
                    </div>
                  </motion.section>
                  
                  {/* 前置认知提示 */}
                  <motion.section
                    className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 shadow-sm border border-amber-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                      <h2 className="font-serif text-xl font-semibold text-amber-800">前置认知提示</h2>
                    </div>
                    <p className="font-serif text-lg text-gray-700 italic">
                      {prerequisitePrompt}
                    </p>
                  </motion.section>
                  
                  {/* 起手式 */}
                  <motion.section
                    className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 shadow-sm border border-blue-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Brain className="h-5 w-5 text-[#007AFF]" />
                      <h2 className="font-serif text-xl font-semibold">起手式</h2>
                    </div>
                    <blockquote className="font-serif text-lg leading-relaxed italic text-gray-700 border-l-4 border-[#007AFF] pl-4">
                      {openingLine}
                    </blockquote>
                  </motion.section>
                  
                  {/* 正文 */}
                  <motion.section
                    className="mb-8 space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <BookOpen className="h-5 w-5 text-[#007AFF]" />
                      <h2 className="font-serif text-xl font-semibold">正文</h2>
                    </div>
                    
                    <div className="space-y-8">
                      {mainContent.map((section, index) => (
                        <div 
                          key={index} 
                          className="mb-12"
                          id={`section-${index}`}
                        >
                          <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 transition-all hover:shadow-lg">
                            {section.title && (
                              <h3 className="font-serif text-2xl font-semibold mb-6 text-[#1e293b] pb-2 border-b-2 border-[#007AFF]">
                                {section.title}
                              </h3>
                            )}
                            
                            <div className="prose max-w-none">
                              <p className="text-gray-700 leading-relaxed mb-6">
                                {section.content}
                              </p>
                            </div>
                            
                            {section.visualIndex && (
                              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                                <p className="text-sm text-blue-700 italic">
                                  <span className="font-medium">视觉索引：</span> {section.visualIndex}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                  
                  {/* 章节逻辑链 */}
                  <motion.section
                    className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Link className="h-5 w-5 text-[#007AFF]" />
                      <h2 className="font-serif text-xl font-semibold">章节逻辑链</h2>
                    </div>
                    <p className="font-serif text-lg text-gray-700">
                      {logicalChain}
                    </p>
                  </motion.section>
                  
                  {/* 本章小结 */}
                  <motion.section
                    className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle className="h-5 w-5 text-[#007AFF]" />
                      <h2 className="font-serif text-xl font-semibold">本章小结</h2>
                    </div>
                    <p className="font-serif text-lg text-gray-700">
                      {chapterSummary}
                    </p>
                  </motion.section>
                  
                  {/* 欲知后事如何且听下回分解 */}
                  <motion.section
                    className="mb-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <ArrowRight className="h-5 w-5 text-[#007AFF]" />
                      <h2 className="font-serif text-xl font-semibold">欲知后事如何且听下回分解</h2>
                    </div>
                    <p className="font-serif text-lg text-gray-700 italic">
                      {nextChapterPreview}
                    </p>
                    
                    {onNextChapter && (
                      <button
                        onClick={onNextChapter}
                        className="mt-4 flex items-center space-x-2 text-[#007AFF] hover:text-blue-600 transition-colors"
                      >
                        <span className="text-sm font-medium">继续学习</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </motion.section>
                  
                  {/* 宗门心法 */}
                  <motion.section
                    className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 shadow-sm border-2 border-purple-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <h2 className="font-serif text-xl font-semibold text-purple-800">宗门心法</h2>
                    </div>
                    
                    <div className="font-serif text-gray-700">
                      {sectMentality.overview}
                    </div>
                  </motion.section>
                  
                  {/* MDX内容渲染区域 */}
                  {children && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      {children}
                    </motion.div>
                  )}
                </main>
                

              </div>
            </div>
          </div>
        </SyncProvider>
      </ChapterTransitionContainer>
    </ChapterTransitionProvider>
);
}

export default ChapterTemplate;
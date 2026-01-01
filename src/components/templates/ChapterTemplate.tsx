"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Target, Lightbulb, CheckCircle, ArrowRight, Brain, Zap, Link as LinkIcon, X } from "lucide-react";
import Link from "next/link";
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
  // 目录显示状态
  const [isTocOpen, setIsTocOpen] = useState(false);
  // 滚动方向和位置状态
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  // 字数统计状态
  const [totalWords, setTotalWords] = useState(0);
  const [currentWordCount, setCurrentWordCount] = useState(0);
  // 内容引用，用于计算字数
  const contentRef = useRef<HTMLDivElement>(null);
  // 滑动状态
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  // 目录位置状态 - 靠近页面顶部，间距不超过20px
  const [tocTop, setTocTop] = useState(20); // 默认靠近顶部，间距20px
  
  // 无障碍功能
  const prefersReducedMotion = useReducedMotion();
  const { announce, AnnouncementComponent } = useScreenReaderAnnouncement();
  const { elementRef: mainContentRef, trapFocus } = useFocusManagement();
  
  // 滚动相关
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, [0, 1000], [0, 1]);
  
  // 计算总字数
  useEffect(() => {
    if (contentRef.current) {
      const textContent = contentRef.current.textContent || '';
      // 简单的字数统计，实际项目中可能需要更精确的算法
      const wordCount = textContent.trim().split(/\s+/).length;
      setTotalWords(wordCount);
    }
  }, [children]);

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
      
      // 计算当前阅读字数
      if (contentRef.current && totalWords > 0) {
        const currentWord = Math.round(progress * totalWords);
        setCurrentWordCount(currentWord);
      }
      
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
      
      // 固定目录位置在靠近顶部区域，间距不超过20px
      // 移除根据滚动位置调整top值的逻辑，确保目录始终靠近顶部
      setTocTop(20); // 固定距离顶部20px
      
      // 阅读正文时自动隐藏目录
      // 当滚动时隐藏目录
      if (Math.abs(latest - lastScrollY) > 10) {
        setIsTocOpen(false);
      }
      
      // 更新上次滚动位置
      setLastScrollY(latest);
    });
    
    return unsubscribe;
  }, [scrollY, lastScrollY, announce, contentRef, totalWords]);
  
  // 点击正文区域时隐藏目录
  const handleMainContentClick = () => {
    setIsTocOpen(false);
  };
  
  // 生成唯一ID
  const mainContentId = generateId('main-content');
  const navigationId = generateId('navigation');

  // 处理拖拽开始
  const handleDragStart = () => {
    setIsSwiping(true);
  };
  
  // 处理拖拽中
  const handleDrag = (event: any, info: any) => {
    // 只有水平滑动才响应，避免干扰垂直滚动
    if (Math.abs(info.delta.x) > Math.abs(info.delta.y * 2)) {
      // 限制滑动距离在 -100 到 100 之间
      const progress = Math.max(-100, Math.min(100, info.delta.x));
      setSwipeProgress(progress);
    }
  };
  
  // 处理拖拽结束
  const handleDragEnd = (event: any, info: any) => {
    setIsSwiping(false);
    
    // 如果滑动距离超过阈值，触发导航
    const threshold = 50;
    if (info.offset.x < -threshold && onNextChapter) {
      // 向左滑动，下一章
      onNextChapter();
    } else if (info.offset.x > threshold && onPreviousChapter) {
      // 向右滑动，上一章
      onPreviousChapter();
    }
    
    // 重置滑动进度
    setSwipeProgress(0);
  };
  
  return <ChapterTransitionProvider>
      <ChapterTransitionContainer chapterKey={`chapter-${chapterNumber}`}>
        <SyncProvider>
          <DefaultSkipLinks />
          
          <motion.div 
            ref={containerRef} 
            className="min-h-screen bg-[#f8fafc] text-[#1e293b]"
            style={{
              x: swipeProgress,
              transition: isSwiping ? "none" : "x 0.3s ease-out"
            }}
            drag="x"
            dragConstraints={{ left: -100, right: 100 }}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            <ScrollProgressBar 
              color="#007AFF" 
              height={3} 
              totalWords={totalWords} 
              currentWordCount={currentWordCount} 
              showPercentage={true} 
              showWordCount={true} 
            />
            
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
                    <div className="font-mono text-sm font-bold text-[#007AFF]" aria-label={`章节编号 ${chapterNumber}`}>
                      {chapterNumber}
                    </div>
                    
                    <h1 className="font-serif text-2xl font-bold text-[#1e293b]">
                      {title}
                    </h1>
                  </div>
                  
                  <nav className="flex items-center space-x-2" aria-label="章节导航">
                    <Link
                      href="/chapters"
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                      aria-label="返回章节列表"
                    >
                      <BookOpen className="h-5 w-5" />
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
              {toc.length > 1 && (
                <div className="lg:hidden mb-6 flex justify-end">
                  <button
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#007AFF] z-50 relative"
                    aria-expanded={isTocOpen}
                    aria-label={isTocOpen ? "关闭目录" : "打开目录"}
                  >
                    <BookOpen className="h-4 w-4 text-[#007AFF]" />
                    <span className="text-sm font-medium">{isTocOpen ? "关闭目录" : "章节目录"}</span>
                  </button>
                </div>
              )}

              {(onPreviousChapter || onNextChapter) && (
                <div className="hidden md:flex justify-center items-center space-x-4 mb-8">
                  {onPreviousChapter && (
                    <motion.button
                      type="button"
                      onClick={onPreviousChapter}
                      className="flex items-center space-x-2 text-sm text-gray-500 hover:text-[#007AFF] hover:bg-gray-50 px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                      whileHover={{ scale: 1.05 }}
                      aria-label="上一章"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>上一章</span>
                    </motion.button>
                  )}
                  <div className="text-xs text-gray-400 px-4 py-1 bg-gray-100 rounded-full">
                    左右滑动切换章节
                  </div>
                  {onNextChapter && (
                    <motion.button
                      type="button"
                      onClick={onNextChapter}
                      className="flex items-center space-x-2 text-sm text-gray-500 hover:text-[#007AFF] hover:bg-gray-50 px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                      whileHover={{ scale: 1.05 }}
                      aria-label="下一章"
                    >
                      <span>下一章</span>
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  )}
                </div>
              )}
              
              {toc.length > 1 && isTocOpen && (
                <motion.div
                  className="lg:hidden mb-6 bg-white rounded-lg p-6 shadow-md border border-gray-100 z-50 relative"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  aria-label="章节目录"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-lg font-semibold text-[#1e293b] flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#007AFF]" />
                      章节目录
                    </h2>
                    <button
                        onClick={() => setIsTocOpen(false)}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#007AFF] rounded-full p-1 transition-all active:scale-95"
                        aria-label="关闭目录"
                      >
                        <X className="h-4 w-4" />
                      </button>
                  </div>
                  <nav className="space-y-1 max-h-60 overflow-y-auto pr-2">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm transition-all hover:text-[#007AFF] py-1.5 px-2 rounded-md hover:bg-blue-50 ${item.level === 2 ? 'font-medium text-gray-800' : `text-gray-600 pl-${(item.level - 2) * 4}`}`}
                        aria-label={`跳转到 ${item.text}`}
                        onClick={() => setIsTocOpen(false)}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </motion.div>
              )}
              
              {/* 目录切换按钮 - 仅在大屏幕显示 */}
              {toc.length > 1 && (
                <button
                  onClick={() => setIsTocOpen(!isTocOpen)}
                  className="fixed left-0 top-1/2 transform -translate-y-1/2 lg:block hidden z-40 bg-[#007AFF] text-white p-2 rounded-r-full hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                  aria-expanded={isTocOpen}
                  aria-label={isTocOpen ? "关闭目录" : "打开目录"}
                >
                  <BookOpen className="h-5 w-5" />
                </button>
              )}
              
              {/* 优化布局结构，避免目录显示/隐藏时内容区域宽度剧烈变化 */}
              <div className="relative lg:flex lg:justify-center">
                {/* 大屏幕目录 - 自动隐藏，悬停或点击显示 */}
                {toc.length > 1 && (
                  <motion.aside
                    className="hidden lg:block fixed left-4 z-50"
                    style={{ top: `${tocTop}px` }}
                    initial={{ opacity: 0, x: -300, transform: 'translateX(-100%)' }}
                    animate={{ 
                      opacity: isTocOpen ? 1 : 0, 
                      x: isTocOpen ? 0 : -300,
                      transform: isTocOpen ? 'translateX(0)' : 'translateX(-100%)',
                    }}
                    transition={{ 
                      duration: 0.3, 
                      ease: "easeInOut",
                      // 使用transform属性避免重排
                      type: "tween"
                    }}
                    aria-label="章节目录"
                    tabIndex={0}
                    onFocus={() => setIsTocOpen(true)}
                    onBlur={() => setIsTocOpen(false)}
                  >
                    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 w-64 backdrop-blur-sm bg-opacity-95 max-h-[300px]">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-serif text-lg font-semibold text-[#1e293b] flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-[#007AFF]" />
                          章节目录
                        </h2>
                        <button
                          onClick={() => setIsTocOpen(false)}
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#007AFF] rounded-full p-1 transition-all active:scale-95"
                          aria-label="关闭目录"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <nav className="space-y-1 max-h-[220px] overflow-y-auto pr-2">
                        {toc.map((item) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            className={`block text-sm transition-all hover:text-[#007AFF] py-1.5 px-2 rounded-md hover:bg-blue-50 ${item.level === 2 ? 'font-medium text-gray-800' : `text-gray-600 pl-${(item.level - 2) * 4}`}`}
                            aria-label={`跳转到 ${item.text}`}
                            onClick={() => setIsTocOpen(false)}
                          >
                            {item.text}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </motion.aside>
                )}
              
                {/* 主内容区域 - 固定宽度，避免目录显示/隐藏时宽度变化导致闪烁 */}
                <motion.main 
                  ref={contentRef} 
                  className="w-full lg:max-w-4xl"
                  onClick={handleMainContentClick}
                  initial={{ opacity: 1 }}
                  animate={{ 
                    opacity: 1,
                    // 添加轻微的transform动画，与目录动画同步
                    transform: isTocOpen && toc.length > 1 ? 'translateX(20px)' : 'translateX(0)',
                  }}
                  transition={{ 
                    duration: 0.3, 
                    ease: "easeInOut",
                    type: "tween"
                  }}
                >
                  <motion.section
                    className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <LinkIcon className="h-5 w-5 text-[#007AFF]" />
                      <h2 className="font-serif text-xl font-semibold">本章逻辑位</h2>
                    </div>
                    <p className="font-serif text-lg text-gray-700 italic">
                      {logicalPosition}
                    </p>
                  </motion.section>
                  
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
                  
                  <motion.section
                    className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <LinkIcon className="h-5 w-5 text-[#007AFF]" />
                      <h2 className="font-serif text-xl font-semibold">章节逻辑链</h2>
                    </div>
                    <p className="font-serif text-lg text-gray-700">
                      {logicalChain}
                    </p>
                  </motion.section>
                  
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
                    
                    <div className="flex justify-between mt-6">
                      {/* 上一章按钮 - 左下角 */}
                      {onPreviousChapter && (
                        <button
                          onClick={onPreviousChapter}
                          className="flex items-center space-x-2 text-[#007AFF] hover:text-blue-600 transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="text-sm font-medium">上一章</span>
                        </button>
                      )}
                      
                      {/* 下一章按钮 - 右下角 */}
                      {onNextChapter && (
                        <button
                          onClick={onNextChapter}
                          className="flex items-center space-x-2 text-[#007AFF] hover:text-blue-600 transition-colors"
                        >
                          <span className="text-sm font-medium">下一章</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </motion.section>
                  
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
                  
                  {children && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      {children}
                    </motion.div>
                  )}
                </motion.main>
              </div>
            </div>
          </motion.div>
        </SyncProvider>
      </ChapterTransitionContainer>
    </ChapterTransitionProvider>
}

export default ChapterTemplate;
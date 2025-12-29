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
  children,
  onPreviousChapter,
  onNextChapter,
  onChapterSelect,
}: ChapterTemplateProps) {
  // 状态管理
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isContentFocused, setIsContentFocused] = useState(false);
  
  // 无障碍功能
  const prefersReducedMotion = useReducedMotion();
  const { announce, AnnouncementComponent } = useScreenReaderAnnouncement();
  const { elementRef: mainContentRef, trapFocus } = useFocusManagement();
  
  // 滚动相关
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // 滚动进度更新
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      setScrollProgress(latest);
      
      // 当滚动到正文区域时，让固定模板略微半透明
      setIsContentFocused(latest > 0.2 && latest < 0.8);
      
      // 为屏幕阅读器公告当前阅读进度
      if (latest % 0.25 < 0.01) { // 每25%公告一次
        const progressPercent = Math.round(latest * 100);
        announce(`章节阅读进度：${progressPercent}%`);
      }
    });
    
    return unsubscribe;
  }, [scrollYProgress, announce]);
  
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
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
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
            
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              {/* 标题 */}
              <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="font-serif text-4xl font-bold text-[#1e293b] mb-4 text-center">
                  {title}
                </h1>
                <div className="text-center font-mono text-lg text-[#007AFF]">
                  {chapterNumber}
                </div>
              </motion.section>
              
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
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-mono text-gray-500">{index + 1}</span>
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
                    <ScrollAnimationContainer key={index}>
                      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                        {section.title && (
                          <h3 className="font-serif text-xl font-semibold mb-4 text-[#1e293b]">
                            {section.title}
                          </h3>
                        )}
                        
                        <ScrollText>
                          <p className="text-gray-700 leading-relaxed mb-4">
                            {section.content}
                          </p>
                        </ScrollText>
                        
                        {section.visualIndex && (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4">
                            <p className="text-sm text-gray-600 italic">
                              <span className="font-medium">视觉索引：</span> {section.visualIndex}
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollAnimationContainer>
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
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-sans text-lg font-semibold mb-2 text-purple-700">心法总览</h3>
                    <p className="font-serif text-gray-700">
                      {sectMentality.overview}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-sans text-lg font-semibold mb-2 text-purple-700">突破要点</h3>
                    <ul className="space-y-2">
                      {sectMentality.breakthrough.map((point, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-4 h-4 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                          </div>
                          <p className="text-gray-700">{point}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-sans text-lg font-semibold mb-2 text-purple-700">核心心法</h3>
                    <p className="font-serif text-gray-700 italic">
                      {sectMentality.corePrinciple}
                    </p>
                  </div>
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
            </div>
          </div>
        </SyncProvider>
      </ChapterTransitionContainer>
    </ChapterTransitionProvider>
  );
}

export default ChapterTemplate;
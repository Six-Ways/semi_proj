"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Target, Lightbulb, CheckCircle, ArrowRight } from "lucide-react";
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

// 章节布局组件的属性接口
interface ChapterLayoutProps {
  // 章节基本信息
  chapterNumber: string; // 章节编号，如 "CH.04"
  chapterTitle: string; // 章节标题
  chapterPosition: {
    current: number; // 当前章节在20章中的位置
    total: number; // 总章节数
    part: string; // 所属部分，如 "第一部分：微观基石"
  };
  
  // 章节内容
  learningObjectives: string[]; // 章节学习目标
  coreContent: {
    summary: string; // 核心内容简介
    visualIndex: string; // 知识的视觉索引描述
  };
  
  // 关键词
  keywords: Array<{
    term: string;
    definition: string;
  }>;
  
  // 前置知识
  prerequisites: Array<{
    title: string;
    description: string;
    isMet: boolean; // 是否已满足
  }>;
  
  // 起手式
  hook: {
    narrative: string; // 启发性叙事文字
    context: string; // 物理情境描述
  };
  
  // 宗门心法
  secretTechnique: {
    title: string;
    content: string;
    entertainment: string; // 娱乐模块内容
  };
  
  // 本章小结与逻辑链
  summary: {
    keyPoints: string[]; // 关键点
    logicChain: Array<{
      from: string;
      to: string;
      description: string;
    }>;
  };
  
  // 下一章预览
  nextChapterPreview: {
    title: string;
    connection: string; // 与本章的逻辑关联
    teaser: string; // 预告内容
  };
  
  // 正文内容（作为插槽）
  children: React.ReactNode;
  
  // 导航回调
  onPreviousChapter?: () => void;
  onNextChapter?: () => void;
  onChapterSelect?: (chapter: number) => void;
}

export function ChapterLayout({
  chapterNumber,
  chapterTitle,
  chapterPosition,
  learningObjectives,
  coreContent,
  keywords,
  prerequisites,
  hook,
  secretTechnique,
  summary,
  nextChapterPreview,
  children,
  onPreviousChapter,
  onNextChapter,
  onChapterSelect,
}: ChapterLayoutProps) {
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
  
  // 侧边栏透明度变换
  const sidebarOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.7, 0.8], [1, 0.7, 0.7, 1]);
  const sidebarScale = useTransform(scrollYProgress, [0.2, 0.3, 0.7, 0.8], [1, 0.95, 0.95, 1]);
  
  // 生成唯一ID
  const mainContentId = generateId('main-content');
  const navigationId = generateId('navigation');
  const chapterIndexId = generateId('chapter-index');
  
  return (
    <ChapterTransitionProvider>
      <ChapterTransitionContainer chapterKey={`chapter-${chapterPosition.current}`}>
        <SyncProvider>
          {/* 跳转链接 */}
          <DefaultSkipLinks />
          
          <div ref={containerRef} className="min-h-screen bg-[#f8fafc] text-[#1e293b]">
            {/* 滚动进度条 */}
            <ScrollProgressBar color="#007AFF" height={3} />
            
            {/* 章节滚动指示器 */}
            <ScrollIndicator 
              totalSections={5} 
              currentSection={Math.floor(scrollProgress * 5)}
              sectionLabels={["导航", "核心内容", "起手式", "正文", "小结"]}
            />
            
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
                {chapterTitle}
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
              
              <div className="font-mono text-sm text-gray-500" aria-label={`章节进度 ${chapterPosition.current} 共 ${chapterPosition.total} 章`}>
                {chapterPosition.current}/{chapterPosition.total}
              </div>
              
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
          
          {/* 逻辑面包屑导航 */}
          <nav className="mt-2 flex items-center space-x-2 text-xs text-gray-500 font-mono" aria-label="章节位置导航">
            <span>半导体知识体系</span>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span>{chapterPosition.part}</span>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span>第 {chapterPosition.current} 章</span>
          </nav>
          </div>
          </motion.header>
          
          <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* 左侧固定模板 */}
        <motion.aside 
          className="w-full lg:w-64 space-y-6"
          style={{ 
            opacity: sidebarOpacity,
            scale: sidebarScale,
            transition: "all 0.3s ease-out"
          }}
          role="complementary"
          aria-label="章节信息"
        >
          {/* 章节目标 Learning Objectives */}
          <motion.section 
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            aria-labelledby="learning-objectives-heading"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Target className="h-4 w-4 text-[#007AFF]" aria-hidden="true" />
              <h3 id="learning-objectives-heading" className="font-sans text-sm font-semibold">章节目标</h3>
            </div>
            
            <ul className="space-y-2">
              {learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  </div>
                  <p className="text-xs text-gray-600">{objective}</p>
                </li>
              ))}
            </ul>
          </motion.section>
          
          {/* 关键词 Index */}
          <motion.section 
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            aria-labelledby="keywords-heading"
          >
            <h3 id="keywords-heading" className="font-sans text-sm font-semibold mb-3">关键词</h3>
            
            <div className="flex flex-wrap gap-2" role="list" aria-label="章节关键词列表">
              {keywords.map((keyword, index) => (
                <SyncableKeyword
                  key={index}
                  id={`keyword-${index}`}
                  term={keyword.term}
                  definition={keyword.definition}
                  relatedIds={[]} // 可以根据需要添加相关ID
                />
              ))}
            </div>
          </motion.section>
          
          {/* 前置认知提示 */}
          <motion.section 
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            aria-labelledby="prerequisites-heading"
          >
            <h3 id="prerequisites-heading" className="font-sans text-sm font-semibold mb-3">前置认知</h3>
            
            <ul className="space-y-2">
              {prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className={`h-3 w-3 mt-0.5 flex-shrink-0 ${prereq.isMet ? 'text-green-500' : 'text-gray-300'}`} aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium">{prereq.title}</p>
                    <p className="text-xs text-gray-500">{prereq.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>
          </motion.aside>
          
          {/* 主内容区域 */}
        <main 
          ref={mainContentRef}
          id={mainContentId}
          className="flex-1 space-y-8"
          role="main"
          aria-label="章节主要内容"
        >
          {/* 核心内容简介 */}
          <motion.section
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            aria-labelledby="core-content-heading"
          >
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-5 w-5 text-[#007AFF]" aria-hidden="true" />
              <h2 id="core-content-heading" className="font-sans text-lg font-semibold">核心内容</h2>
            </div>
            
            <p className="font-serif text-base leading-relaxed mb-4">
              {coreContent.summary}
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600 italic">
                {coreContent.visualIndex}
              </p>
            </div>
          </motion.section>
          
          {/* 起手式 The Hook */}
          <motion.section
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 shadow-sm border border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="h-5 w-5 text-[#007AFF]" />
              <h2 className="font-sans text-lg font-semibold">起手式</h2>
            </div>
            
            <blockquote className="font-serif text-lg leading-relaxed italic text-gray-700 border-l-4 border-[#007AFF] pl-4">
              {hook.narrative}
            </blockquote>
            
            <p className="text-sm text-gray-600 mt-4">
              {hook.context}
            </p>
          </motion.section>
          
          {/* 宗门心法 */}
          <motion.section
            className="bg-white rounded-lg p-6 shadow-sm border-2 border-[#007AFF]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-sans text-lg font-semibold mb-4 text-[#007AFF]">
              宗门心法：{secretTechnique.title}
            </h2>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="font-serif text-base leading-relaxed">
                {secretTechnique.content}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-sans text-sm font-semibold mb-2 text-purple-700">娱乐模块</h3>
              <p className="text-sm text-gray-700">
                {secretTechnique.entertainment}
              </p>
            </div>
          </motion.section>
          
          {/* 正文区域 - 作为插槽 */}
          <motion.section
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {children}
          </motion.section>
          
          {/* 本章小结与逻辑链 */}
          <motion.section
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="font-sans text-lg font-semibold mb-4">本章小结</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-sans text-sm font-semibold mb-3">关键点</h3>
                <ul className="space-y-2">
                  {summary.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-4 h-4 rounded-full bg-[#007AFF] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>
                      <p className="text-sm text-gray-700">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-sans text-sm font-semibold mb-3">逻辑链</h3>
                <div className="space-y-3">
                  {summary.logicChain.map((link, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <ArrowRight className="h-4 w-4 text-[#007AFF] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{link.from} → {link.to}</p>
                        <p className="text-xs text-gray-500">{link.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
          
          {/* 下一章预览 */}
          <motion.section
            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="font-sans text-lg font-semibold mb-4">欲知后事如何</h2>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <h3 className="font-sans text-base font-semibold mb-2">{nextChapterPreview.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{nextChapterPreview.connection}</p>
              <p className="text-sm text-gray-700 italic">{nextChapterPreview.teaser}</p>
              
              {onNextChapter && (
                <button
                  onClick={onNextChapter}
                  className="mt-4 flex items-center space-x-2 text-[#007AFF] hover:text-blue-600 transition-colors"
                >
                  <span className="text-sm font-medium">继续学习</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.section>
          </main>
          
          {/* 右侧固定模板 */}
        <motion.aside 
          className="w-full lg:w-64 space-y-6"
          style={{ 
            opacity: sidebarOpacity,
            scale: sidebarScale,
            transition: "all 0.3s ease-out"
          }}
        >
          {/* 进度指示器 */}
          <motion.div 
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-sans text-sm font-semibold mb-3">阅读进度</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>本章进度</span>
                <span className="font-mono" aria-label={`本章阅读进度 ${Math.round(scrollProgress * 100)}%`}>{Math.round(scrollProgress * 100)}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={scrollProgress} aria-valuemin={0} aria-valuemax={1} aria-label="章节阅读进度条">
                <motion.div
                  className="bg-[#007AFF] h-2 rounded-full"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>整体进度</span>
                <span className="font-mono" aria-label={`整体进度 第${chapterPosition.current}章 共${chapterPosition.total}章`}>{chapterPosition.current}/{chapterPosition.total}</span>
              </div>
            </div>
          </motion.div>
          </motion.aside>
          </div>
          
          {/* 章节导航 */}
          <ChapterTransitionNavigation
            currentChapter={chapterPosition.current}
            totalChapters={chapterPosition.total}
            onPreviousChapter={onPreviousChapter}
            onNextChapter={onNextChapter}
            onChapterSelect={onChapterSelect}
          />
          
          {/* 屏幕阅读器公告组件 */}
          <AnnouncementComponent />
          </div>
          </SyncProvider>
    </ChapterTransitionContainer>
  </ChapterTransitionProvider>
  );
}
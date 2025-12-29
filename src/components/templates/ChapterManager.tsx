import React, { useState, useCallback } from "react";
import { ChapterTransition } from "./ChapterNavigation";

// 章节数据接口
interface ChapterData {
  id: number;
  number: string;
  title: string;
  part: string;
  component: React.ComponentType;
}

interface ChapterManagerProps {
  chapters: ChapterData[];
  initialChapter?: number;
}

export function ChapterManager({ chapters, initialChapter = 1 }: ChapterManagerProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(initialChapter - 1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<"forward" | "backward">("forward");

  const currentChapter = chapters[currentChapterIndex];
  const CurrentChapterComponent = currentChapter.component;

  const handlePreviousChapter = useCallback(() => {
    if (currentChapterIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTransitionDirection("backward");
      
      setTimeout(() => {
        setCurrentChapterIndex(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  }, [currentChapterIndex, isTransitioning]);

  const handleNextChapter = useCallback(() => {
    if (currentChapterIndex < chapters.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTransitionDirection("forward");
      
      setTimeout(() => {
        setCurrentChapterIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }
  }, [currentChapterIndex, chapters.length, isTransitioning]);

  const handleChapterSelect = useCallback((chapterNumber: number) => {
    const targetIndex = chapterNumber - 1;
    if (targetIndex !== currentChapterIndex && targetIndex >= 0 && targetIndex < chapters.length && !isTransitioning) {
      setIsTransitioning(true);
      setTransitionDirection(targetIndex > currentChapterIndex ? "forward" : "backward");
      
      setTimeout(() => {
        setCurrentChapterIndex(targetIndex);
        setIsTransitioning(false);
      }, 300);
    }
  }, [currentChapterIndex, chapters.length, isTransitioning]);

  return (
    <div className="relative w-full h-full">
      <ChapterTransition 
        isExiting={isTransitioning}
        direction={transitionDirection}
      >
        <div className="w-full h-full">
          <CurrentChapterComponent />
        </div>
      </ChapterTransition>
    </div>
  );
}
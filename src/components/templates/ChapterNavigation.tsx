import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface ChapterNavigationProps {
  currentChapter: number;
  totalChapters: 20;
  onPrevious: () => void;
  onNext: () => void;
  onChapterSelect?: (chapterNumber: number) => void;
  className?: string;
}

export function ChapterNavigation({
  currentChapter,
  totalChapters,
  onPrevious,
  onNext,
  onChapterSelect,
  className = ""
}: ChapterNavigationProps) {
  const chapters = Array.from({ length: totalChapters }, (_, i) => i + 1);
  
  return (
    <div className={`flex items-center justify-between p-6 bg-white border-t border-gray-100 ${className}`}>
      {/* 上一章按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={currentChapter <= 1}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        上一章
      </Button>
      
      {/* 章节选择器 */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-gray-500">章节:</span>
        <div className="flex items-center gap-1">
          {chapters.map((chapter) => (
            <button
              key={chapter}
              onClick={() => onChapterSelect?.(chapter)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-colors ${
                chapter === currentChapter
                  ? "bg-[#007AFF] text-white"
                  : chapter < currentChapter
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {chapter}
            </button>
          ))}
        </div>
      </div>
      
      {/* 下一章按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={currentChapter >= totalChapters}
        className="flex items-center gap-2"
      >
        下一章
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// 章节过渡动画组件
interface ChapterTransitionProps {
  isExiting: boolean;
  direction: "forward" | "backward";
  children: React.ReactNode;
}

export function ChapterTransition({ isExiting, direction, children }: ChapterTransitionProps) {
  const variants = {
    enter: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? "-100%" : "100%",
      opacity: 0
    })
  };
  
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={isExiting ? "exiting" : "entering"}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 }
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
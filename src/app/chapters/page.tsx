"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronRight, BookOpen, Clock, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { 
  ChapterTransitionProvider, 
  useChapterTransition 
} from "@/components/templates/ChapterTransition";

// 章节数据接口
interface ChapterItem {
  id: number;
  number: string;
  title: string;
  part: string;
  description: string;
  estimatedTime: string;
  isCompleted: boolean;
  isLocked: boolean;
  prerequisites: string[];
}

// 示例章节数据
const chaptersData: ChapterItem[] = [
  {
    id: 0,
    number: "序言",
    title: "硅基文明的基石与演进",
    part: "导论",
    description: "建立\"技术-社会-未来\"的宏观视野，认识半导体技术的发展历程与未来方向",
    estimatedTime: "30分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: []
  },
  {
    id: 1,
    number: "CH.01",
    title: "半导体的量子起源",
    part: "第一部分：微观基石",
    description: "从量子力学的基本原理出发，解释半导体材料的特殊性质",
    estimatedTime: "45分钟",
    isCompleted: true,
    isLocked: false,
    prerequisites: []
  },
  {
    id: 2,
    number: "CH.02",
    title: "晶体生长与缺陷",
    part: "第一部分：微观基石",
    description: "探讨半导体材料的制备工艺，包括晶体生长技术和缺陷工程",
    estimatedTime: "50分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.01"]
  },
  {
    id: 3,
    number: "CH.03",
    title: "载流子传输机制",
    part: "第一部分：微观基石",
    description: "深入理解电子和空穴在半导体中的运动规律",
    estimatedTime: "60分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.01", "CH.02"]
  },
  {
    id: 4,
    number: "CH.04",
    title: "PN结的形成与特性",
    part: "第一部分：微观基石",
    description: "研究半导体器件的基本结构——PN结的形成原理和电学特性",
    estimatedTime: "55分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.01", "CH.02", "CH.03"]
  },
  {
    id: 5,
    number: "CH.05",
    title: "二极管的物理原理",
    part: "第二部分：器件基础",
    description: "分析半导体二极管的工作原理和特性曲线",
    estimatedTime: "40分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.04"]
  },
  {
    id: 6,
    number: "CH.06",
    title: "双极型晶体管(BJT)",
    part: "第二部分：器件基础",
    description: "探讨BJT的结构、工作原理和放大特性",
    estimatedTime: "65分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.04", "CH.05"]
  },
  {
    id: 7,
    number: "CH.07",
    title: "MOSFET基础",
    part: "第二部分：器件基础",
    description: "介绍MOS场效应晶体管的结构和工作原理",
    estimatedTime: "70分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.04", "CH.05"]
  },
  {
    id: 8,
    number: "CH.08",
    title: "MOSFET的物理模型",
    part: "第二部分：器件基础",
    description: "深入分析MOSFET的电流-电压特性和物理模型",
    estimatedTime: "75分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.07"]
  },
  {
    id: 9,
    number: "CH.09",
    title: "CMOS逻辑电路",
    part: "第三部分：电路设计",
    description: "学习CMOS反相器、逻辑门和基本电路设计",
    estimatedTime: "80分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.08"]
  },
  {
    id: 10,
    number: "CH.10",
    title: "时序电路设计",
    part: "第三部分：电路设计",
    description: "探讨触发器、寄存器和时序逻辑电路的设计原理",
    estimatedTime: "85分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.09"]
  },
  {
    id: 11,
    number: "CH.11",
    title: "存储器电路",
    part: "第三部分：电路设计",
    description: "分析SRAM、DRAM和Flash存储器的电路结构",
    estimatedTime: "90分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.09", "CH.10"]
  },
  {
    id: 12,
    number: "CH.12",
    title: "模拟电路基础",
    part: "第三部分：电路设计",
    description: "介绍模拟电路设计的基本原理和MOS模拟电路",
    estimatedTime: "95分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.08", "CH.09"]
  },
  {
    id: 13,
    number: "CH.13",
    title: "集成电路制造工艺",
    part: "第四部分：工艺技术",
    description: "了解集成电路制造的全流程，从晶圆制备到封装测试",
    estimatedTime: "100分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.02", "CH.05"]
  },
  {
    id: 14,
    number: "CH.14",
    title: "光刻技术",
    part: "第四部分：工艺技术",
    description: "深入研究光刻技术的原理、设备和工艺参数",
    estimatedTime: "55分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.13"]
  },
  {
    id: 15,
    number: "CH.15",
    title: "刻蚀与薄膜沉积",
    part: "第四部分：工艺技术",
    description: "探讨干法刻蚀、湿法刻蚀和各种薄膜沉积技术",
    estimatedTime: "60分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.13", "CH.14"]
  },
  {
    id: 16,
    number: "CH.16",
    title: "互连与封装",
    part: "第四部分：工艺技术",
    description: "学习多层互连技术和芯片封装技术",
    estimatedTime: "65分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.15"]
  },
  {
    id: 17,
    number: "CH.17",
    title: "数字系统设计",
    part: "第五部分：系统设计",
    description: "从电路到系统，学习数字系统设计的基本方法",
    estimatedTime: "110分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.10", "CH.11", "CH.12"]
  },
  {
    id: 18,
    number: "CH.18",
    title: "处理器架构",
    part: "第五部分：系统设计",
    description: "分析CPU、GPU等处理器的架构设计原理",
    estimatedTime: "120分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.17"]
  },
  {
    id: 19,
    number: "CH.19",
    title: "专用集成电路设计",
    part: "第六部分：高级专题",
    description: "了解ASIC和FPGA的设计流程和方法",
    estimatedTime: "130分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.17", "CH.18"]
  },
  {
    id: 20,
    number: "CH.20",
    title: "新兴半导体技术",
    part: "第六部分：高级专题",
    description: "探索量子计算、宽禁带半导体等前沿技术",
    estimatedTime: "90分钟",
    isCompleted: false,
    isLocked: false,
    prerequisites: ["CH.01", "CH.13", "CH.19"]
  }
];

// 按部分分组章节数据
const chaptersByPart = chaptersData.reduce((acc, chapter) => {
  if (!acc[chapter.part]) {
    acc[chapter.part] = [];
  }
  acc[chapter.part].push(chapter);
  return acc;
}, {} as Record<string, ChapterItem[]>);

export default function ChapterIndexPage() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [hoveredChapter, setHoveredChapter] = useState<number | null>(null);
  const router = useRouter();
  const { startTransition } = useChapterTransition();

  const completedChapters = chaptersData.filter(ch => ch.isCompleted).length;
  const totalChapters = chaptersData.length;
  const progressPercentage = (completedChapters / totalChapters) * 100;
  
  // 处理章节选择
  const handleChapterSelect = (chapterId: number) => {
    const chapter = chaptersData.find(ch => ch.id === chapterId);
    if (chapter && !chapter.isLocked) {
      // 开始章节过渡动画
      startTransition(0, chapterId, () => {
        // 导航到对应章节
        if (chapterId === 0) {
          router.push('/chapters/preface');
        } else {
          router.push(`/chapters/chapter-${chapterId.toString().padStart(2, '0')}`);
        }
      });
    }
  };

  return (
    <ChapterTransitionProvider>
      <div className="min-h-screen bg-[#f8fafc] text-[#1e293b]">
      {/* 页面头部 */}
      <motion.header 
        className="sticky top-0 z-40 bg-[#f8fafc]/95 backdrop-blur-sm border-b border-gray-200"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#1e293b] mb-2">
                半导体知识体系
              </h1>
              <p className="text-gray-600">
                探索从量子物理到集成电路的完整知识链
              </p>
            </div>
            
            <div className="text-right">
              <div className="font-mono text-sm text-gray-500 mb-1">
                学习进度
              </div>
              <div className="font-mono text-lg font-bold text-[#007AFF]">
                {completedChapters}/{totalChapters}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                <motion.div
                  className="bg-[#007AFF] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* 部分选择器 */}
        <div className="mb-8">
          <h2 className="font-sans text-xl font-semibold mb-4">选择知识部分</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedPart(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPart === null
                  ? "bg-[#007AFF] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              全部章节
            </button>
            
            {Object.keys(chaptersByPart).map((part) => (
              <button
                key={part}
                onClick={() => setSelectedPart(part)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPart === part
                    ? "bg-[#007AFF] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {part}
              </button>
            ))}
          </div>
        </div>

        {/* 章节列表 */}
        <div className="space-y-6">
          {Object.entries(chaptersByPart)
            .filter(([part]) => selectedPart === null || part === selectedPart)
            .map(([part, chapters]) => (
              <div key={part} className="space-y-4">
                <h3 className="font-sans text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
                  {part}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chapters.map((chapter) => (
                    <motion.div
                      key={chapter.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: chapter.id * 0.05 }}
                      onMouseEnter={() => setHoveredChapter(chapter.id)}
                      onMouseLeave={() => setHoveredChapter(null)}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-mono text-sm font-bold text-[#007AFF] mb-1">
                              {chapter.number}
                            </div>
                            <h4 className="font-serif text-base font-semibold text-[#1e293b]">
                              {chapter.title}
                            </h4>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {chapter.isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : chapter.isLocked ? (
                              <Lock className="h-5 w-5 text-gray-400" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {chapter.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {chapter.estimatedTime}
                          </div>
                          
                          {chapter.prerequisites.length > 0 && (
                            <div className="text-xs text-gray-500">
                              前置: {chapter.prerequisites.join(", ")}
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className={`w-full ${
                            chapter.isLocked
                              ? "opacity-50 cursor-not-allowed"
                              : hoveredChapter === chapter.id
                              ? "bg-[#007AFF] text-white border-[#007AFF]"
                              : ""
                          }`}
                          disabled={chapter.isLocked}
                          onClick={() => handleChapterSelect(chapter.id)}
                        >
                          {chapter.isCompleted ? "复习" : chapter.isLocked ? "未解锁" : "开始学习"}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      </div>
    </ChapterTransitionProvider>
  );
}
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BlockMath } from '@/components/math/MathFormula';
import { useRouter } from 'next/navigation';

// 半导体知识体系概述页面
export default function SemiconductorOverviewPage() {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // 摩尔定律公式
  const mooreLaw = '\\text{Moore\'s Law: } \\text{Transistors} \\propto 2^{\\text{years}/2}';
  
  // 能带理论公式
  const bandTheory = `\\begin{aligned}
E_{\\text{gap}} &= E_{C} - E_{V} \\\\
E_{C} &= \\text{导带底能量} \\\\
E_{V} &= \\text{价带顶能量}
\\end{aligned}`;
  
  // 载流子浓度公式
  const carrierConcentration = `\\begin{aligned}
n &= N_{C} e^{-(E_{C}-E_{F})/(kT)} \\\\
p &= N_{V} e^{-(E_{F}-E_{V})/(kT)} \\\\
n \\cdot p &= n_{i}^2
\\end{aligned}`;

  // 知识体系结构
  const knowledgeStructure = [
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 页面头部 */}
      <motion.header 
        className="sticky top-0 z-40 bg-white/98 backdrop-blur-sm border-b border-slate-100"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-semibold text-[#0f172a] mb-1">
                半导体器件与工艺全景
              </h1>
              <p className="text-sm text-gray-500">
                从微观基石到未来趋势的完整学习路径
              </p>
            </div>
            
            <Button 
              variant="primary"
              size="md"
              onClick={() => router.push('/chapters/part0/ch0')}
            >
              开始学习
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* 知识体系概述 */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg p-6 border border-slate-100"
          >
            <h2 className="font-serif text-xl font-semibold text-[#0f172a] mb-4">
              半导体：硅基文明的基石
            </h2>
            
            <div className="space-y-5">
              <p className="text-gray-600 leading-relaxed text-sm">
                半导体技术是现代信息社会的核心，从智能手机到超级计算机，从人工智能到物联网，
                几乎所有的电子设备都依赖于半导体器件。本知识体系将带你从量子物理的微观世界出发，
                逐步探索半导体技术的完整知识链。
              </p>
              
              <div className="bg-slate-50 border-l-3 border-blue-500 p-4 rounded-r">
                <h3 className="font-medium text-blue-700 mb-2 text-sm">摩尔定律的延续</h3>
                <p className="text-blue-600 mb-3 text-sm">
                  摩尔定律预测晶体管数量每18-24个月翻一番，这一定律推动了半导体技术的快速发展。
                </p>
                <div className="bg-white p-3 rounded border border-slate-100">
                  <BlockMath formula={mooreLaw} />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border-l-3 border-blue-500 p-4 rounded-r">
                  <h3 className="font-medium text-blue-700 mb-2 text-sm">能带理论基础</h3>
                  <p className="text-blue-600 mb-3 text-sm">
                    能带理论解释了半导体为什么能够导电以及其独特的电学特性。
                  </p>
                  <div className="bg-white p-3 rounded border border-slate-100">
                    <BlockMath formula={bandTheory} />
                  </div>
                </div>
                
                <div className="bg-slate-50 border-l-3 border-blue-500 p-4 rounded-r">
                  <h3 className="font-medium text-blue-700 mb-2 text-sm">载流子浓度</h3>
                  <p className="text-blue-600 mb-3 text-sm">
                    载流子浓度决定了半导体的导电能力，是理解半导体器件工作原理的关键。
                  </p>
                  <div className="bg-white p-3 rounded border border-slate-100">
                    <BlockMath formula={carrierConcentration} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 知识体系结构 */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0f172a] mb-6 text-center">
            完整知识体系结构
          </h2>
          
          <div className="space-y-8">
            {knowledgeStructure.map((section, index) => (
              <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg overflow-hidden border border-slate-100"
                >
                <div 
                  className={`p-6 cursor-pointer transition-colors ${selectedSection === section.id ? 'bg-slate-50 border-l-4 border-blue-500' : 'hover:bg-slate-50'}`}
                  onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-[#0f172a]">
                          {section.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-0.5">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight 
                      className={`h-4 w-4 text-gray-400 transition-transform ${selectedSection === section.id ? 'transform rotate-90' : ''}`}
                    />
                  </div>
                </div>
                
                {selectedSection === section.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                      {section.chapters.map((chapter) => {
                        // 确定章节所在的部分
                        const chapterNum = parseInt(chapter.number.slice(3));
                        const partNumber = Math.floor((chapterNum - 1) / 3);
                        return (
                          <div 
                            key={chapter.number} 
                            className="bg-white rounded-md p-3 hover:bg-slate-50 border border-slate-100 cursor-pointer transition-all duration-200"
                            onClick={() => router.push(`/chapters/part${partNumber}/ch${Math.floor((chapterNum - 1) % 3)}`)}
                          >
                            <div className="font-mono text-xs font-medium text-blue-600 mb-1 opacity-80">
                              {chapter.number}
                            </div>
                            <div className="font-serif text-sm text-[#1e293b] leading-tight">
                              {chapter.title}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* 学习路径 */}
        <section className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-blue-50 rounded-lg p-6 border border-blue-100"
          >
            <h2 className="font-serif text-xl font-semibold text-[#0f172a] mb-4">
              推荐学习路径
            </h2>
            
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-white rounded-md p-4 border border-slate-100">
                <h3 className="font-medium text-blue-600 mb-2 text-sm">基础阶段</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  从量子物理和能带理论开始，建立半导体物理的基础概念
                </p>
              </div>
              
              <div className="bg-white rounded-md p-4 border border-slate-100">
                <h3 className="font-medium text-blue-600 mb-2 text-sm">进阶阶段</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  学习半导体器件的工作原理和电路设计方法
                </p>
              </div>
              
              <div className="bg-white rounded-md p-4 border border-slate-100">
                <h3 className="font-medium text-blue-600 mb-2 text-sm">高级阶段</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  探索集成电路制造工艺和系统设计，了解前沿技术
                </p>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-sm px-6 py-2"
                onClick={() => router.push('/chapters/preface')}
              >
                开始学习之旅
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
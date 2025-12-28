"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BlockMath } from "@/components/math/MathFormula";
import { MathVisualization } from "@/components/math/MathVisualization";
import { FermiDiracVisualization } from "@/components/math/FermiDiracVisualization";
import { ChevronRight, BookOpen, Microscope, Cpu, Zap } from "lucide-react";

export default function HomePage() {
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);

  // 定义章节列表
  const chapters = [
    {
      id: "preface",
      title: "序言：硅基文明的基石与演进",
      description: "从沙子到芯片，探索半导体如何改变世界",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      path: "/chapters/preface"
    },
    {
      id: "part1",
      title: "第一部分：半导体物理基础",
      description: "能带理论、载流子行为与掺杂机制",
      icon: Microscope,
      color: "from-purple-500 to-indigo-500",
      path: "/chapters/part1"
    },
    {
      id: "part2",
      title: "第二部分：半导体材料",
      description: "硅、锗及化合物半导体特性",
      icon: Cpu,
      color: "from-green-500 to-emerald-500",
      path: "/chapters/part2"
    },
    {
      id: "part3",
      title: "第三部分：半导体器件",
      description: "二极管、晶体管与集成电路原理",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      path: "/chapters/part3"
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 英雄区域 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        <div className="relative container mx-auto px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              半导体物理与器件
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              一个关于半导体物理与器件的交互式教育网站
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/chapters/preface">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  开始探索
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 核心逻辑主线 */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">核心逻辑主线</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              从量子物理到数字世界的桥梁
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">半导体物理的核心逻辑</CardTitle>
                <CardDescription>
                  从微观量子效应到宏观电子器件的完整知识体系
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-slate max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    半导体技术是现代电子工业的基石，其核心在于对材料电子行为的精确控制。
                    从能带理论出发，我们理解了半导体介于导体和绝缘体之间的独特性质；
                    通过掺杂工艺，我们能够调控载流子浓度，创造出P型和N型半导体；
                    结合这两种半导体，我们构建了PN结，这是几乎所有半导体器件的基本结构。
                  </p>
                  <div className="my-8 bg-slate-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">费米-狄拉克分布</h3>
                    <p className="text-gray-700 mb-4">
                      电子在能级中的分布遵循费米-狄拉克统计：
                    </p>
                    <div className="flex justify-center my-6">
                      <BlockMath formula="f(E) = \frac{1}{1 + e^{(E-E_F)/kT}}" />
                    </div>
                    <FermiDiracVisualization />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    从晶体管到集成电路，从简单的逻辑门到复杂的处理器，半导体技术的演进
                    推动了整个数字革命。理解半导体物理不仅是电子工程的基础，也是把握
                    现代科技发展趋势的关键。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 章节导航 */}
      <section className="py-24 sm:py-32 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">章节导航</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              探索半导体的世界
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {chapters.map((chapter) => {
              const IconComponent = chapter.icon;
              return (
                <Card
                  key={chapter.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-0 ${
                    hoveredChapter === chapter.id ? "ring-2 ring-indigo-500" : ""
                  }`}
                  onMouseEnter={() => setHoveredChapter(chapter.id)}
                  onMouseLeave={() => setHoveredChapter(null)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${chapter.color} opacity-5`}></div>
                  <CardHeader className="relative">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${chapter.color} flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{chapter.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {chapter.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative pt-0">
                    <Link href={chapter.path}>
                      <Button variant="outline" className="w-full group">
                        开始学习
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 交互式示例 */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">交互式学习</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              通过可视化理解抽象概念
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">能带结构可视化</CardTitle>
                <CardDescription>
                  交互式探索半导体、导体和绝缘体的能带结构差异
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    半导体的独特性质源于其能带结构。与导体和绝缘体不同，半导体的价带和导带之间存在适中大小的带隙，
                    这使得通过外部刺激（如温度、光照或电场）可以显著改变其导电性质。
                  </p>
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">载流子浓度与温度关系</h3>
                    <div className="flex justify-center my-6">
                      <BlockMath formula="n_i = \sqrt{N_c N_v} \cdot e^{-E_g/2kT}" />
                    </div>
                    <p className="text-gray-600 text-sm">
                      其中 n<sub>i</sub> 是本征载流子浓度，E<sub>g</sub> 是带隙宽度，k 是玻尔兹曼常数，T 是绝对温度。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 半导体物理与器件 - 可探索式解释
            </p>
            <p className="mt-2 text-gray-500 text-sm">
              基于 Next.js 15、Tailwind CSS 和 KaTeX 构建
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
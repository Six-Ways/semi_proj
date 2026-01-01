'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChevronRight, BookOpen, Cpu, BrainCircuit, Zap, Activity, Beaker } from "lucide-react";

// 项目数据接口
interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  isActive: boolean;
  path: string;
  progress?: number;
}

// 项目数据
const projects: Project[] = [
  {      id: "semiconductor",      title: "半导体器件与工艺全景",      subtitle: "从微观基石到未来趋势的完整学习路径",      description: "建立'技术-社会-未来'的宏观视野，认识半导体技术的发展历程与未来方向。涵盖量子物理、材料科学、器件原理、工艺技术和系统设计。",      icon: Beaker,      color: "from-blue-500 to-indigo-500",      isActive: true,      path: "/chapters",      progress: 0    },
  {
    id: "architecture",
    title: "计算机体系结构",
    subtitle: "从指令集到多核设计的完整架构知识",
    description: "探索计算机系统的核心架构原理，包括处理器设计、内存层次结构、并行计算和性能优化。",
    icon: Cpu,
    color: "from-purple-500 to-pink-500",
    isActive: false,
    path: "#"
  },
  {
    id: "ai",
    title: "人工智能",
    subtitle: "从基础算法到深度学习的智能系统设计",
    description: "学习人工智能的核心概念和技术，包括机器学习、神经网络、自然语言处理和计算机视觉。",
    icon: BrainCircuit,
    color: "from-green-500 to-emerald-500",
    isActive: false,
    path: "#"
  }
];

export default function HomePage() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* 英雄区域 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        {/* 背景图片 - 半导体芯片微观结构 */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70 z-0" 
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80")',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 to-slate-800/30 z-10" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] z-20" aria-hidden="true"></div>
        <div className="relative container mx-auto px-6 py-24 lg:px-8 z-30">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-serif leading-tight">
              硅基文明求索
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl">
              探索前沿技术领域的完整知识体系，从基础原理到应用实践
            </p>
          </div>
        </div>
      </section>

      {/* 项目导航 */}
      <main className="container mx-auto px-6 py-12 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 font-serif mb-12">
          知识项目
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const IconComponent = project.icon;
            const isHovered = hoveredProject === project.id;

            return (
              <Card
                key={project.id}
                className={`relative transition-all duration-300 hover:shadow-xl ${isHovered ? "scale-105" : ""} cursor-pointer`}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => project.isActive && router.push(project.path)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${project.color} opacity-5 pointer-events-none`}></div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${project.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    {project.progress !== undefined && (
                      <div className="text-sm font-medium text-gray-500">
                        进度: {project.progress}%
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-serif mt-4">
                    {project.title}
                  </CardTitle>
                  <CardDescription>
                    {project.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    {project.description}
                  </p>
                    {project.isActive ? (
                      <Link href={project.path} className="w-full">
                        <Button
                          className={`w-full ${project.color} hover:opacity-90`}
                        >
                          进入学习
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className={`w-full ${project.color} hover:opacity-90`}
                        disabled
                      >
                        即将上线
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 未来项目预告 */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 font-serif mb-8">
            即将上线
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-50 border-dashed">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-gray-600">
                  <Zap className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-serif mt-4">
                  先进材料科学
                </CardTitle>
                <CardDescription>
                  探索新型材料的设计、合成与应用
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  从二维材料到智能材料，了解材料科学的前沿进展和未来方向。
                </p>
                <Button variant="outline" className="w-full" disabled>
                  即将上线
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-gray-50 border-dashed">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-gray-600">
                  <Activity className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-serif mt-4">
                  生物信息学
                </CardTitle>
                <CardDescription>
                  利用计算机技术解决生物医学问题
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  学习基因组学、蛋白质组学和系统生物学的数据分析方法和工具。
                </p>
                <Button variant="outline" className="w-full" disabled>
                  即将上线
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-slate-900 text-white py-8 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm md:text-base">
            <p className="text-gray-400">
              © 2025 硅基文明求索 - 探索前沿技术的完整知识体系
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

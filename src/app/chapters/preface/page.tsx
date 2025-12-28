"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BlockMath, InlineMath } from "@/components/math/MathFormula";
import { MathVisualization } from "@/components/math/MathVisualization";
import { ChevronLeft, ChevronRight, BookOpen, Lightbulb, TrendingUp, Zap } from "lucide-react";

export default function PrefacePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // 摩尔定律可视化函数
  const mooresLaw = (x: number) => {
    // x代表年份，从1971年开始
    const startYear = 1971;
    const startTransistors = 2300; // 1971年第一个微处理器的晶体管数量
    const yearsElapsed = x - startYear;
    // 每2年晶体管数量翻倍
    return startTransistors * Math.pow(2, yearsElapsed / 2);
  };

  // 晶体管尺寸与功耗关系函数
  const powerScaling = (x: number) => {
    // x代表晶体管尺寸的缩小比例（原始尺寸的倍数）
    // 功耗与尺寸的平方成正比（简化模型）
    return Math.pow(x, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 章节标题区域 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        <div className="relative container mx-auto px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  返回首页
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              序言：硅基文明的基石与演进
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              从沙子到芯片，探索半导体如何改变世界
            </p>
          </div>
        </div>
      </section>

      {/* 章节导航 */}
      <section className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex space-x-8">
              {[
                { id: "intro", title: "引言", icon: BookOpen },
                { id: "revolution", title: "晶体管革命", icon: Lightbulb },
                { id: "scaling", title: "尺度微缩", icon: TrendingUp },
                { id: "future", title: "后摩尔时代", icon: Zap }
              ].map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{section.title}</span>
                  </button>
                );
              })}
            </div>
            <Link href="/chapters/part1">
              <Button variant="outline" size="sm">
                下一章
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 章节内容 */}
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-4xl">
          {/* 起手式 */}
          <Card className="mb-12 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Lightbulb className="mr-3 h-8 w-8 text-yellow-500" />
                起手式
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-lg leading-relaxed text-gray-700">
                你有没有试过一天不用任何含半导体的东西？早上醒来，手机的闹钟是它在工作；上班路上，导航的卫星、地铁的控制系统里藏着它；办公室里，电脑、打印机、路由器离不开它；甚至医院的 CT 机、天上的航天火箭、家里的智能家电 —— 几乎所有定义现代生活的设备，核心都嵌着一块小小的 "硅片"。
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                这不是魔法，而是 "硅基文明" 的力量。半导体，这个以硅为核心的神奇材料，就像信息时代的 "细胞"，支撑着从个人通信到人类探索宇宙的每一步。它没有钢铁坚硬，没有黄金珍贵，却凭借 "能导电又能控电" 的独特本领，彻底改变了世界的运行规则。
              </p>
            </CardContent>
          </Card>

          {/* 一场从 "单个零件" 到 "亿万器件" 的革命 */}
          <Card className={`mb-12 border-0 shadow-lg transition-all duration-300 ${activeSection === "revolution" ? "ring-2 ring-indigo-500" : ""}`}>
            <CardHeader>
              <CardTitle className="text-2xl">一场从 "单个零件" 到 "亿万器件" 的革命</CardTitle>
              <CardDescription>
                从晶体管到集成电路，开启技术革命的大门
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-slate max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  70 多年前，当贝尔实验室的科学家发明第一只晶体管时，没人想到这个指甲盖大小的元件，会开启一场技术革命。在此之前，电子设备靠笨重的真空管工作 —— 一台收音机比冰箱还大，一台计算机需要一间屋子才能装下。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  晶体管的出现，第一次让 "控制电流" 变得小巧又可靠。但真正的飞跃，来自 "集成电路" 的诞生。就像把分散的零件组装成一台完整的机器，科学家们把成千上万的晶体管、电阻、电容 "刻" 在同一块硅片上，让它们协同工作。
                </p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">摩尔定律：技术演进的"指南针"</h3>
                <p className="text-gray-700 mb-4">
                  1965 年，戈登・摩尔（Intel 创始人之一）做了个大胆预测：每隔 18-24 个月，一块硅片上的晶体管数量会翻倍，而成本会减半。这就是著名的 "摩尔定律"。
                </p>
                <div className="flex justify-center my-6">
                  <BlockMath formula="N(t) = N_0 \times 2^{(t-t_0)/T}" />
                </div>
                <p className="text-gray-600 text-sm mb-6">
                  其中 N(t) 是时间 t 的晶体管数量，N<sub>0</sub> 是初始时间 t<sub>0</sub> 的晶体管数量，T 是翻倍周期（约18-24个月）。
                </p>
                <MathVisualization
                  functions={[
                    {
                      fn: mooresLaw,
                      color: "#3b82f6",
                      domain: [1971, 2025]
                    }
                  ]}
                  xRange={[1970, 2030]}
                  yRange={[0, 100000000000]}
                  className="h-64"
                />
                <p className="text-gray-600 text-sm mt-4 text-center">
                  摩尔定律预测的晶体管数量增长曲线（注意Y轴为对数尺度）
                </p>
              </div>
              
              <div className="prose prose-slate max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  从 1971 年第一颗微处理器只有 2300 个晶体管，到如今一块高端芯片的晶体管数量突破 1000 亿个；从早期电脑每秒运算几千次，到现在超级计算机每秒运算百亿亿次 —— 摩尔定律的本质，是 "尺度微缩" 的艺术：把晶体管越做越小，让更多器件挤在同一块硅片上。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 越小越好？尺度微缩的甜蜜与烦恼 */}
          <Card className={`mb-12 border-0 shadow-lg transition-all duration-300 ${activeSection === "scaling" ? "ring-2 ring-indigo-500" : ""}`}>
            <CardHeader>
              <CardTitle className="text-2xl">越小越好？尺度微缩的甜蜜与烦恼</CardTitle>
              <CardDescription>
                为什么要把晶体管做得这么小？又面临哪些挑战？
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-slate max-w-none">
                <p className="text-lg font-semibold text-gray-800 mb-3">
                  为什么要把晶体管做得这么小？答案很简单：<span className="text-indigo-600">更小 = 更快、更省、更便宜</span>。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  想象一下，把晶体管比作 "电子开关" —— 开关越小，电子从一端跑到另一端的距离就越短，开关速度自然更快；同样大小的硅片上能放更多开关，就能实现更复杂的功能；而批量生产时，"挤下更多器件" 意味着每个器件的成本被摊薄，最终惠及每个人。
                </p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">尺度微缩的甜蜜</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-indigo-600 mb-2">更快</h4>
                    <p className="text-sm text-gray-600">电子传输距离缩短，开关速度提高</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-green-600 mb-2">更省</h4>
                    <p className="text-sm text-gray-600">单个晶体管功耗降低，能效提升</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-purple-600 mb-2">更便宜</h4>
                    <p className="text-sm text-gray-600">单位面积晶体管数量增加，成本摊薄</p>
                  </div>
                </div>
                <MathVisualization
                  functions={[
                    {
                      fn: powerScaling,
                      color: "#ef4444",
                      domain: [0.1, 1]
                    }
                  ]}
                  xRange={[0, 1.2]}
                  yRange={[0, 1.2]}
                  className="h-48"
                />
                <p className="text-gray-600 text-sm mt-4 text-center">
                  晶体管尺寸与功耗关系（简化模型）：功耗与尺寸的平方成正比
                </p>
              </div>
              
              <div className="prose prose-slate max-w-none">
                <p className="text-lg font-semibold text-gray-800 mb-3">
                  但天下没有免费的午餐。当晶体管的尺寸缩小到纳米级别，麻烦开始出现了：
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-700">短沟道效应</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">
                      就像把房子建得太小，邻居的声音会互相干扰 —— 晶体管的 "沟道"（电子流动的通道）太短，漏极的电场会穿透到源极，导致开关关不严，出现 "漏电"。
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-orange-700">功耗墙</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">
                      开关太小，电流通过时的电阻会变大，发热也会剧增 —— 一块芯片的功耗如果不控制，会像灯泡一样发烫，甚至烧毁。
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-yellow-700">物理极限</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">
                      晶体管不能无限小，最终会触及原子尺度的物理规律 —— 你总不能把开关做得比原子还小吧？
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="prose prose-slate max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  到了 21 世纪第二个十年，摩尔定律的脚步明显慢了下来。尺度微缩的边际效益越来越低，继续 "做小" 的成本越来越高。这不是技术的失败，而是提醒我们：该换一种思路了。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 后摩尔时代：从 "做小" 到 "做好" 的新范式 */}
          <Card className={`mb-12 border-0 shadow-lg transition-all duration-300 ${activeSection === "future" ? "ring-2 ring-indigo-500" : ""}`}>
            <CardHeader>
              <CardTitle className="text-2xl">后摩尔时代：从 "做小" 到 "做好" 的新范式</CardTitle>
              <CardDescription>
                摩尔定律的放缓，不是半导体技术的终点，而是新起点
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-slate max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  摩尔定律的放缓，不是半导体技术的终点，而是新起点。就像当平面的房子建到极限，人们会开始盖高楼、换建材 —— 半导体行业正在开启 "后摩尔时代" 的三大新方向：
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-700 flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      3D 集成
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-3">
                      不再执着于 "平面缩小"，而是把多块芯片像叠积木一样堆叠起来，用垂直互连替代平面互连，既提升集成度，又减少信号延迟。
                    </p>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">优势：</span>突破平面限制，提高集成密度
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-700 flex items-center">
                      <Zap className="mr-2 h-5 w-5" />
                      新材料革命
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-3">
                      用更优秀的材料替代传统硅，比如用氮化镓（GaN）做高压功率器件，用二维材料（如 MoS₂）做原子级薄的晶体管，突破硅的性能限制。
                    </p>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">优势：</span>突破硅材料物理性能限制
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-700 flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5" />
                      新器件原理
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-3">
                      不再依赖传统的 "场效应" 控制电流，而是利用量子力学的隧穿效应、自旋电子等新机制，制造更低功耗、更快速度的新型器件。
                    </p>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">优势：</span>突破传统器件工作原理限制
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="prose prose-slate max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  这些新方向，不再是单一技术的迭代，而是 "材料、器件、工艺、系统" 的协同创新 —— 这也正是我们打造这个网站的核心逻辑。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 本章小结 */}
          <Card className="mb-12 border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-2xl">本章小结</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-slate max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  半导体技术看似高深，但其本质是 "从原子到系统" 的逻辑链条：原子的排列决定材料特性，材料特性决定载流子行为，载流子行为决定器件功能，器件功能通过工艺实现，最终集成到系统中服务于人类。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  这个网站不会让你死记硬背公式，也不会堆砌晦涩的术语。我们会从 "硅原子的排列" 开始，一步步带你理解：电子如何在半导体中运动？PN 结为什么能 "单向导电"？MOSFET 如何成为 "电子开关之王"？芯片是怎么 "刻" 出来的？后摩尔时代的技术又在突破什么？
                </p>
                <p className="text-gray-700 leading-relaxed">
                  你不需要专业基础，只要具备初中物理的 "力、电、能量" 常识，就能跟着逻辑链探索。我们会用费曼式的通俗比喻，把量子力学、能带理论这些抽象概念变得直观；用交互式工具，让你亲手调整参数，看到 "结构变化如何影响性能"；用真实的工业案例，让你明白 "技术如何落地为产品"。
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-center">章节逻辑链：材料→性质→功能→用途</h3>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-indigo-600 font-bold">材料</span>
                    </div>
                    <p className="text-xs text-gray-600">原子排列</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 font-bold">性质</span>
                    </div>
                    <p className="text-xs text-gray-600">载流子行为</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-600 font-bold">功能</span>
                    </div>
                    <p className="text-xs text-gray-600">器件特性</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-purple-600 font-bold">用途</span>
                    </div>
                    <p className="text-xs text-gray-600">系统应用</p>
                  </div>
                </div>
              </div>
              
              <div className="prose prose-slate max-w-none">
                <p className="text-gray-700 leading-relaxed italic">
                  半导体的故事，是人类用智慧驯服微观世界的故事。它始于一块普通的硅石，却最终构建了我们的信息文明。现在，就让我们一起，从原子出发，揭开这个神奇世界的面纱。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 宗门心法 */}
          <Card className="mb-12 border-0 shadow-lg bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">宗门心法</CardTitle>
              <CardDescription className="text-slate-300">
                半导体修真之路，从灵根初成到飞升之道
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-700/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-yellow-300">【总纲（灵根篇）】</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-200 leading-relaxed">
                    半导体之道，始于灵根（晶体管）初成。昔者肖克利祖师以单根筑基，开创硅基修真之路。后有摩尔老祖传下天阶功法《微缩真经》，言明每十八月便可将灵根压缩一倍，晶体管如恒河沙数，聚于方寸硅片之上，终成改天换地之硅基文明。
                  </p>
                  <p className="text-slate-200 leading-relaxed">
                    然修炼一途，欲速则不达。当灵根凝练至纳米之境（金丹期），便遭遇天劫：短沟道心魔扰动，漏电不止；功耗烈焰焚身，热力反噬。此乃天道法则所限，非人力可强行突破。
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-700/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-green-300">【破劫三式（飞升篇）】</h3>
                <p className="text-slate-200 leading-relaxed mb-4">
                  大道五十，天衍四九。我辈修士当如何破劫飞升？有三条通天之路：
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h4 className="font-semibold text-blue-300">第一式·筑灵塔</h4>
                    <p className="text-slate-200 text-sm">
                      不再于平面苦修，而是层层叠立，以垂直之道突破空间桎梏，筑就3D集成灵塔，集成度倍增。
                    </p>
                  </div>
                  <div className="border-l-4 border-green-400 pl-4">
                    <h4 className="font-semibold text-green-300">第二式·换灵根</h4>
                    <p className="text-slate-200 text-sm">
                      舍弃凡体硅身，炼化氮化镓（GaN）之躯，得宽禁带之体，可耐高压、抗高温，肉身成圣。
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-400 pl-4">
                    <h4 className="font-semibold text-purple-300">第三式·悟天道</h4>
                    <p className="text-slate-200 text-sm">
                      不再拘泥于古法场效应之术，转而感悟量子隧穿、自旋大道等新法则，开辟前所未见之神通（量子器件）。
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-indigo-300">【心法要诀】</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-200 leading-relaxed">
                    此三条路皆非单一功法，乃材料、器件、工艺、系统之大融合。尔等初入仙门，无需惊才绝艳，只需掌握基础物理之常识，便可随本心法，从原子之境开始，一步步参透半导体大道，最终成就从原子到系统之真仙境界！修成道祖也非毫无希望！本功法窃取天机，切记谨慎外传。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 下一章预告 */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">欲知后事如何，且听下回分解</h3>
                <p className="text-lg mb-6 text-indigo-100">
                  接下来我们会从晶体结构开始，看芯片中最底层的打工人电子是在怎样的舞台上翩翩起舞。
                </p>
                <Link href="/chapters/part1">
                  <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
                    开始第一部分：半导体物理基础
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
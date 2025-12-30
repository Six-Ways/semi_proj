"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Beaker, 
  Zap, 
  Atom, 
  Cpu, 
  Microscope,
  Play,
  BookOpen,
  Settings
} from "lucide-react";

interface LabItem {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "初级" | "中级" | "高级";
  estimatedTime: string;
  icon: React.ReactNode;
  relatedChapter: string;
  chapterUrl: string;
}

export default function LabPage() {
  const [activeCategory, setActiveCategory] = useState("全部");

  const labItems: LabItem[] = [
    {
      id: "crystal-structure",
      title: "硅晶体结构可视化",
      description: "探索硅的金刚石立方晶格结构，了解晶向、晶面与密勒指数",
      category: "材料科学",
      difficulty: "初级",
      estimatedTime: "15分钟",
      icon: <Atom className="h-6 w-6" />,
      relatedChapter: "第01章",
      chapterUrl: "/chapters/part0/ch0"
    },
    {
      id: "band-structure",
      title: "能带结构交互式演示",
      description: "直观理解固体能带理论，探索价带、导带与禁带概念",
      category: "量子物理",
      difficulty: "中级",
      estimatedTime: "20分钟",
      icon: <Zap className="h-6 w-6" />,
      relatedChapter: "第02章",
      chapterUrl: "/chapters/part0/ch0"
    },
    {
      id: "carrier-transport",
      title: "载流子输运模拟器",
      description: "模拟载流子的漂移与扩散运动，理解电流形成的微观机制",
      category: "器件物理",
      difficulty: "中级",
      estimatedTime: "25分钟",
      icon: <Cpu className="h-6 w-6" />,
      relatedChapter: "第04章",
      chapterUrl: "/chapters/part0/ch0"
    },
    {
      id: "pn-junction",
      title: "PN结形成过程演示",
      description: "动态展示PN结的形成过程，理解空间电荷区与内建电场",
      category: "器件物理",
      difficulty: "高级",
      estimatedTime: "30分钟",
      icon: <Microscope className="h-6 w-6" />,
      relatedChapter: "第07章",
      chapterUrl: "/chapters/part0/ch0"
    },
    {
      id: "mosfet-operation",
      title: "MOSFET工作原理模拟",
      description: "交互式探索MOSFET的工作原理，理解栅极控制与沟道形成",
      category: "器件物理",
      difficulty: "高级",
      estimatedTime: "35分钟",
      icon: <Cpu className="h-6 w-6" />,
      relatedChapter: "第10章",
      chapterUrl: "/chapters/part0/ch0"
    },
    {
      id: "fabrication-process",
      title: "芯片制造工艺流程",
      description: "了解从硅片到芯片的完整制造流程，包括光刻、刻蚀等关键工艺",
      category: "制造工艺",
      difficulty: "中级",
      estimatedTime: "40分钟",
      icon: <Beaker className="h-6 w-6" />,
      relatedChapter: "第14章",
      chapterUrl: "/chapters/part0/ch0"
    }
  ];

  const categories = ["全部", "材料科学", "量子物理", "器件物理", "制造工艺"];

  const filteredItems = activeCategory === "全部" 
    ? labItems 
    : labItems.filter(item => item.category === activeCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "初级": return "bg-green-100 text-green-800";
      case "中级": return "bg-yellow-100 text-yellow-800";
      case "高级": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">半导体实验室</h1>
        <p className="mt-2 text-gray-600">通过交互式实验深入理解半导体物理与器件原理</p>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeCategory === category
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      {/* Lab Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  {item.icon}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(item.difficulty)}`}>
                  {item.difficulty}
                </span>
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="mr-4">
                    <BookOpen className="inline h-4 w-4 mr-1" />
                    {item.relatedChapter}
                  </span>
                  <span>
                    <Settings className="inline h-4 w-4 mr-1" />
                    {item.estimatedTime}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  <Play className="mr-2 h-4 w-4" />
                  开始实验
                </Button>
                <Button variant="outline" asChild>
                  <a href={item.chapterUrl}>
                    <BookOpen className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Beaker className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到实验</h3>
          <p className="mt-1 text-sm text-gray-500">尝试选择其他类别</p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-12 bg-indigo-50 rounded-lg p-6">
        <h2 className="text-lg font-medium text-indigo-900 mb-2">关于实验室</h2>
        <p className="text-indigo-700 mb-4">
          我们的交互式实验室帮助你通过动手实践深入理解半导体物理概念。每个实验都设计为与课程内容紧密结合，
          让你在理论学习的同时获得直观的体验。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">交互式学习</h3>
            <p className="text-sm text-gray-600">通过调整参数实时观察物理现象的变化</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">即时反馈</h3>
            <p className="text-sm text-gray-600">获得即时的视觉和数据反馈，加深理解</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">理论与实践结合</h3>
            <p className="text-sm text-gray-600">每个实验都与课程章节内容紧密关联</p>
          </div>
        </div>
      </div>
    </div>
  );
}
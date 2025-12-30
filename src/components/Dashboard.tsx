"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Award, 
  TrendingUp,
  BarChart3,
  Calendar,
  Target,
  Play
} from "lucide-react";
import Link from "next/link";

interface ChapterProgress {
  id: string;
  number: string;
  title: string;
  part: string;
  completed: boolean;
  timeSpent: number; // in minutes
  lastAccessed: Date | null;
  score?: number; // quiz score percentage
}

interface LearningStats {
  totalChapters: number;
  completedChapters: number;
  totalTimeSpent: number; // in minutes
  averageScore: number;
  streak: number; // consecutive days of learning
  lastStudyDate: Date | null;
}

export default function Dashboard() {
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([
    {
      id: "preface",
      number: "00",
      title: "硅基文明的基石与演进",
      part: "序言",
      completed: true,
      timeSpent: 45,
      lastAccessed: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      score: 95
    },
    {
      id: "ch0",
      number: "01",
      title: "半导体材料与晶体结构",
      part: "第一部分",
      completed: true,
      timeSpent: 60,
      lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      score: 88
    },
    {
      id: "ch1",
      number: "02",
      title: "量子力学基础与固体能带",
      part: "第一部分",
      completed: false,
      timeSpent: 30,
      lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: "ch2",
      number: "03",
      title: "载流子统计与热平衡",
      part: "第一部分",
      completed: false,
      timeSpent: 0,
      lastAccessed: null,
    },
    // Add more chapters as needed
  ]);

  const [stats, setStats] = useState<LearningStats>({
    totalChapters: 20,
    completedChapters: 2,
    totalTimeSpent: 135,
    averageScore: 91.5,
    streak: 3,
    lastStudyDate: new Date(Date.now() - 24 * 60 * 60 * 1000)
  });

  const [activeTab, setActiveTab] = useState("overview");

  // Calculate progress percentage
  const progressPercentage = Math.round((stats.completedChapters / stats.totalChapters) * 100);

  // Format time display
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  // Format date display
  const formatDate = (date: Date | null) => {
    if (!date) return "未开始";
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString("zh-CN");
  };

  // Get next chapter to study
  const getNextChapter = () => {
    return chapterProgress.find(ch => !ch.completed);
  };

  const nextChapter = getNextChapter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">学习仪表盘</h1>
        <p className="mt-2 text-gray-600">跟踪你的半导体学习进度</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总体进度</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressPercentage}%</div>
            <Progress value={progressPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.completedChapters}/{stats.totalChapters} 章节已完成
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">学习时长</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(stats.totalTimeSpent)}</div>
            <p className="text-xs text-muted-foreground mt-2">
              平均每章 {Math.round(stats.totalTimeSpent / stats.completedChapters)} 分钟
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均分数</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              测验平均得分
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">学习连续天数</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak}</div>
            <p className="text-xs text-muted-foreground mt-2">
              上次学习: {formatDate(stats.lastStudyDate)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next Chapter Recommendation */}
      {nextChapter && (
        <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-indigo-600" />
              下一步学习
            </CardTitle>
            <CardDescription>
              继续你的学习之旅
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  第{nextChapter.number}章: {nextChapter.title}
                </h3>
                <p className="text-gray-600">{nextChapter.part}</p>
              </div>
              <Link href={`/chapters/part0/ch0`}>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Play className="mr-2 h-4 w-4" />
                  继续学习
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            概览
          </button>
          <button
            onClick={() => setActiveTab("chapters")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "chapters"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            章节详情
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "analytics"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            学习分析
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>最近学习</CardTitle>
              <CardDescription>最近访问的章节</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chapterProgress
                  .filter(ch => ch.lastAccessed)
                  .sort((a, b) => (b.lastAccessed?.getTime() || 0) - (a.lastAccessed?.getTime() || 0))
                  .slice(0, 3)
                  .map((chapter) => (
                    <div key={chapter.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          chapter.completed 
                            ? "bg-green-100 text-green-600" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {chapter.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <BookOpen className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">第{chapter.number}章</p>
                          <p className="text-sm text-gray-500">{chapter.title}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{formatDate(chapter.lastAccessed)}</p>
                        <p className="text-sm font-medium">{formatTime(chapter.timeSpent)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>学习成就</CardTitle>
              <CardDescription>你已经获得的成就</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Award className="h-8 w-8 text-yellow-600 mb-2" />
                  <p className="font-medium">初学者</p>
                  <p className="text-sm text-gray-600">完成序言</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="font-medium">连续学习</p>
                  <p className="text-sm text-gray-600">3天连续</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                  <p className="font-medium">基础扎实</p>
                  <p className="text-sm text-gray-600">完成第一部分</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="font-medium">优秀学员</p>
                  <p className="text-sm text-gray-600">平均分90+</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "chapters" && (
        <Card>
          <CardHeader>
            <CardTitle>章节进度</CardTitle>
            <CardDescription>所有章节的学习状态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chapterProgress.map((chapter) => (
                <div key={chapter.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      chapter.completed 
                        ? "bg-green-100 text-green-600" 
                        : chapter.timeSpent > 0 
                          ? "bg-blue-100 text-blue-600" 
                          : "bg-gray-100 text-gray-600"
                    }`}>
                      {chapter.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <BookOpen className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">第{chapter.number}章: {chapter.title}</p>
                      <p className="text-sm text-gray-500">{chapter.part}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">学习时长</p>
                      <p className="font-medium">{formatTime(chapter.timeSpent)}</p>
                    </div>
                    {chapter.score && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">测验分数</p>
                        <p className="font-medium">{chapter.score}%</p>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-sm text-gray-500">最后访问</p>
                      <p className="font-medium">{formatDate(chapter.lastAccessed)}</p>
                    </div>
                    <Link href={`/chapters/part0/ch0`}>
                      <Button variant="outline" size="sm">
                        {chapter.completed ? "复习" : chapter.timeSpent > 0 ? "继续" : "开始"}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>学习时间分布</CardTitle>
              <CardDescription>按部分查看学习时间</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">序言</span>
                    <span className="text-sm text-gray-500">45分钟</span>
                  </div>
                  <Progress value={33} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">第一部分：微观基石</span>
                    <span className="text-sm text-gray-500">90分钟</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">第二部分：载流子动力学</span>
                    <span className="text-sm text-gray-500">0分钟</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>学习建议</CardTitle>
              <CardDescription>基于你的学习进度的个性化建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">完成量子力学基础章节</p>
                    <p className="text-sm text-gray-600">你已经开始了这一章，继续学习以保持进度</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">复习晶体结构章节</p>
                    <p className="text-sm text-gray-600">间隔复习有助于长期记忆</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">尝试相关测验</p>
                    <p className="text-sm text-gray-600">检验你的理解程度</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  User, 
  Bell, 
  Palette, 
  Globe, 
  BookOpen, 
  Download,
  Upload,
  Shield,
  HelpCircle,
  Volume2,
  Eye,
  Keyboard
} from "lucide-react";

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("zh-CN");
  const [fontSize, setFontSize] = useState("medium");
  // 无障碍设置状态
  const [keyboardNavigation, setKeyboardNavigation] = useState(true);
  const [screenReader, setScreenReader] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  
  // 应用高对比度模式
  React.useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);
  
  // 应用屏幕阅读器优化
  React.useEffect(() => {
    if (screenReader) {
      document.documentElement.setAttribute('aria-live', 'polite');
    } else {
      document.documentElement.removeAttribute('aria-live');
    }
  }, [screenReader]);
  
  // 应用键盘导航增强
  React.useEffect(() => {
    if (keyboardNavigation) {
      document.documentElement.classList.add('enhanced-keyboard');
    } else {
      document.documentElement.classList.remove('enhanced-keyboard');
    }
  }, [keyboardNavigation]);

  const settingsSections: SettingsSection[] = [
    {
      id: "profile",
      title: "个人资料",
      description: "管理你的个人信息和学习偏好",
      icon: <User className="h-5 w-5" />
    },
    {
      id: "notifications",
      title: "通知设置",
      description: "控制接收通知的方式和内容",
      icon: <Bell className="h-5 w-5" />
    },
    {
      id: "appearance",
      title: "外观设置",
      description: "自定义界面外观和显示选项",
      icon: <Palette className="h-5 w-5" />
    },
    {
      id: "accessibility",
      title: "无障碍设置",
      description: "调整界面以提高可访问性",
      icon: <Eye className="h-5 w-5" />
    },
    {
      id: "learning",
      title: "学习设置",
      description: "自定义学习体验和进度跟踪",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      id: "data",
      title: "数据管理",
      description: "导入、导出和管理你的学习数据",
      icon: <Download className="h-5 w-5" />
    },
    {
      id: "privacy",
      title: "隐私与安全",
      description: "管理隐私设置和账户安全",
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: "help",
      title: "帮助与支持",
      description: "获取帮助和支持资源",
      icon: <HelpCircle className="h-5 w-5" />
    }
  ];

  const renderSettingsContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">个人信息</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    用户名
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue="学习者"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    电子邮箱
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue="learner@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    个人简介
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue="对半导体物理与器件感兴趣的学习者"
                  />
                </div>
              </div>
            </div>
            <div className="pt-4">
              <Button>保存更改</Button>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">通知偏好</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">学习提醒</p>
                    <p className="text-sm text-gray-500">接收学习计划和进度提醒</p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">声音提醒</p>
                    <p className="text-sm text-gray-500">学习完成和成就解锁时播放声音</p>
                  </div>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      soundEnabled ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        soundEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">界面主题</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">主题模式</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setDarkMode(false)}
                      className={`p-4 border rounded-lg ${
                        !darkMode ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
                      }`}
                    >
                      <div className="w-full h-12 bg-white border border-gray-200 rounded mb-2"></div>
                      <p className="text-sm font-medium">浅色模式</p>
                    </button>
                    <button
                      onClick={() => setDarkMode(true)}
                      className={`p-4 border rounded-lg ${
                        darkMode ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
                      }`}
                    >
                      <div className="w-full h-12 bg-gray-800 border border-gray-700 rounded mb-2"></div>
                      <p className="text-sm font-medium">深色模式</p>
                    </button>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">字体大小</p>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="small">小</option>
                    <option value="medium">中</option>
                    <option value="large">大</option>
                  </select>
                </div>
                <div>
                  <p className="font-medium mb-2">语言</p>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="zh-CN">简体中文</option>
                    <option value="zh-TW">繁體中文</option>
                    <option value="en-US">English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "accessibility":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">无障碍选项</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Keyboard className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">键盘导航</p>
                      <p className="text-sm text-gray-500">启用增强的键盘导航支持</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setKeyboardNavigation(!keyboardNavigation)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${keyboardNavigation ? "bg-indigo-600" : "bg-gray-200"}`}
                    aria-label={keyboardNavigation ? "禁用键盘导航" : "启用键盘导航"}
                    aria-pressed={keyboardNavigation}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${keyboardNavigation ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Volume2 className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">屏幕阅读器</p>
                      <p className="text-sm text-gray-500">优化屏幕阅读器体验</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setScreenReader(!screenReader)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${screenReader ? "bg-indigo-600" : "bg-gray-200"}`}
                    aria-label={screenReader ? "禁用屏幕阅读器优化" : "启用屏幕阅读器优化"}
                    aria-pressed={screenReader}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${screenReader ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">高对比度</p>
                      <p className="text-sm text-gray-500">增加界面元素的对比度</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${highContrast ? "bg-indigo-600" : "bg-gray-200"}`}
                    aria-label={highContrast ? "禁用高对比度" : "启用高对比度"}
                    aria-pressed={highContrast}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${highContrast ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "learning":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">学习偏好</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="daily-goal" className="block text-sm font-medium text-gray-700 mb-1">
                    每日学习目标（分钟）
                  </label>
                  <input
                    type="number"
                    id="daily-goal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue="30"
                    min="5"
                    max="180"
                  />
                </div>
                <div>
                  <label htmlFor="reminder-time" className="block text-sm font-medium text-gray-700 mb-1">
                    学习提醒时间
                  </label>
                  <input
                    type="time"
                    id="reminder-time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue="19:00"
                  />
                </div>
                <div>
                  <p className="font-medium mb-2">学习模式</p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="learning-mode" defaultChecked className="mr-2" />
                      <span>引导式学习 - 按照推荐顺序学习</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="learning-mode" className="mr-2" />
                      <span>自由探索 - 自由选择学习内容</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "data":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">数据管理</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">导出学习数据</h4>
                  <p className="text-sm text-gray-500 mb-3">下载你的学习进度、笔记和成绩数据</p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    导出数据
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">导入学习数据</h4>
                  <p className="text-sm text-gray-500 mb-3">从备份文件恢复学习数据</p>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    导入数据
                  </Button>
                </div>
                <div className="border rounded-lg p-4 border-red-200 bg-red-50">
                  <h4 className="font-medium mb-2 text-red-800">清除所有数据</h4>
                  <p className="text-sm text-red-600 mb-3">永久删除所有学习数据，此操作不可撤销</p>
                  <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50">
                    清除数据
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">隐私设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">学习数据分析</p>
                    <p className="text-sm text-gray-500">允许分析学习数据以改进体验</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">学习进度分享</p>
                    <p className="text-sm text-gray-500">允许与他人分享学习进度</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">个性化推荐</p>
                    <p className="text-sm text-gray-500">基于学习行为提供个性化内容推荐</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">账户安全</h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  修改密码
                </Button>
                <Button variant="outline" className="w-full">
                  启用两步验证
                </Button>
                <Button variant="outline" className="w-full">
                  查看登录活动
                </Button>
              </div>
            </div>
          </div>
        );

      case "help":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">帮助资源</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">使用指南</h4>
                  <p className="text-sm text-gray-500 mb-3">了解如何使用平台的各种功能</p>
                  <Button variant="outline" className="w-full">
                    查看指南
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">常见问题</h4>
                  <p className="text-sm text-gray-500 mb-3">查找常见问题的解答</p>
                  <Button variant="outline" className="w-full">
                    浏览FAQ
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">联系支持</h4>
                  <p className="text-sm text-gray-500 mb-3">遇到问题？联系我们的支持团队</p>
                  <Button variant="outline" className="w-full">
                    获取帮助
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">关于</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  半导体物理与器件学习平台 v1.0.0
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  © 2023 半导体学习平台. 保留所有权利.
                </p>
                <div className="flex space-x-4 text-sm">
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">服务条款</a>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">隐私政策</a>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">许可协议</a>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>选择一个设置类别来查看选项</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">设置</h1>
        <p className="mt-2 text-gray-600">管理你的账户设置和偏好</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="md:col-span-1">
          <nav className="space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeSection === section.id
                    ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {section.icon}
                <span className="ml-3">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {settingsSections.find(s => s.id === activeSection)?.title}
              </CardTitle>
              <CardDescription>
                {settingsSections.find(s => s.id === activeSection)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSettingsContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
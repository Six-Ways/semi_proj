'use client';

import React from 'react';
import { MDXContentRenderer } from '@/components/MDXContentRenderer';
import { ChapterTheme } from '@/lib/chapterThemes';

// 模拟章节主题
const demoTheme: ChapterTheme = {
  name: 'demo',
  primaryColor: '#2563eb',
  secondaryColor: '#64748b',
  accentColor: '#10b981',
  backgroundColor: '#ffffff',
  cardBackgroundColor: '#ffffff',
  textColor: '#1e293b',
  textSecondaryColor: '#64748b',
  headingColor: '#1e293b',
  borderColor: '#e2e8f0',
  shadow: 'shadow-md',
  shadowHover: 'shadow-lg',
  contentStyles: {
    paragraph: {
      fontSize: 'base',
      lineHeight: 'relaxed',
      marginBottom: '4',
      color: '#1e293b'
    },
    list: {
      marginBottom: '4',
      paddingLeft: '4',
      color: '#1e293b'
    },
    blockquote: {
      padding: '2 4',
      margin: '4',
      backgroundColor: '#f8fafc',
      color: '#475569'
    },
    codeBlock: {
      backgroundColor: '#f1f5f9',
      color: '#1e293b',
      padding: '4',
      borderRadius: 'md',
      marginBottom: '4',
      fontSize: 'sm'
    },
    formula: {
      margin: '6',
      fontSize: 'lg',
      color: '#1e293b'
    }
  },
  contentLayout: {
    maxWidth: '7xl',
    align: 'left',
    padding: '0 1rem',
    margin: '0 auto'
  },
  decorations: {
    borderPattern: 'solid',
    backgroundPattern: 'none'
  },
  // 添加必填属性
  animation: 'fade',
  animationDuration: 300,
  cardVariant: 'default'
};

// 演示MDX内容
const demoMDXContent = `# 从晶体管到芯片：半导体产业的演进

## 一场从 "单个零件" 到 "亿万器件" 的革命

20世纪50年代，当第一只晶体管在贝尔实验室诞生时，没有人能预见到这个小小的半导体器件会彻底改变整个世界。在随后的几十年里，半导体产业经历了一场史诗般的革命，从最初的单个零件发展到如今包含数十亿个晶体管的复杂芯片。

## 半导体产业的里程碑

- 1947年：第一只晶体管在贝尔实验室诞生
- 1958年：第一块集成电路由德州仪器公司的杰克·基尔比发明
- 1965年：戈登·摩尔提出著名的摩尔定律
- 1971年：英特尔推出第一块微处理器4004
- 1980年代：个人电脑革命爆发，半导体需求激增
- 1990年代：互联网时代到来，推动半导体产业快速发展
- 2000年代：移动设备兴起，带来新的增长机遇
- 2010年代：人工智能和物联网技术推动半导体产业进入新时代

## 尺度微缩的挑战

随着晶体管尺寸的不断缩小，半导体产业面临着前所未有的挑战。量子效应开始显现，制造工艺变得越来越复杂，成本也呈指数级增长。

"当晶体管尺寸接近原子级别时，我们将面临量子隧穿效应等物理限制，这将彻底改变我们设计和制造芯片的方式。"

## 数据增长与半导体需求

根据最新数据，全球数据量正以每年40%的速度增长，这对半导体产业提出了巨大的需求。预计到2030年，全球半导体市场规模将达到1万亿美元。

## 后摩尔时代的挑战与机遇

随着摩尔定律逐渐接近物理极限，半导体产业正在进入后摩尔时代。在这个新时代，我们需要寻找新的技术路径和创新范式。

## 超越摩尔定律的新范式

- 3D封装技术：将多个芯片垂直堆叠，提高性能和集成度
- 特殊工艺：为特定应用优化的工艺，如射频、功率和传感器
- 新材料：如石墨烯、氮化镓等新型半导体材料
- 量子计算：利用量子力学原理的新型计算技术
- 神经形态计算：模拟人脑结构的新型计算架构

## 半导体产业的未来

尽管面临诸多挑战，半导体产业的未来仍然充满希望。随着人工智能、5G、自动驾驶等新兴技术的不断发展，半导体将继续扮演核心角色，推动人类社会向更加智能和互联的方向发展。`;

// 模拟章节sections
const sections = [
  {
    title: '从晶体管到芯片：半导体产业的演进',
    content: demoMDXContent,
    component: 'CoreContent',
    chapterSlug: 'part0/ch0-demo'
  }
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">内容映射系统演示</h1>
          <p className="mt-2 text-sm text-gray-600">
            演示新的内容映射系统如何工作
          </p>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 演示说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">演示说明</h2>
          <p className="text-blue-800 mb-3">
            本页面演示了新的内容映射系统如何工作。系统会根据内容特征自动匹配相应的UI组件，实现个性化的内容展示效果。
          </p>
          <p className="text-blue-800">
            配置文件：<code className="bg-blue-100 px-2 py-1 rounded text-sm">src/lib/chapterConfigs/part0/ch0-demo.ts</code>
          </p>
        </div>

        {/* 内容渲染 */}
        <div className="bg-white shadow-sm rounded-lg p-8">
          <MDXContentRenderer 
            sections={sections} 
            theme={demoTheme} 
            chapterSlug="part0/ch0-demo"
          />
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            内容映射系统演示 © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useChapterTransition } from "@/components/templates/ChapterTransition";
import ChapterTemplate from "@/components/templates/ChapterTemplate";
import { BentoGridCanvas } from "@/components/templates/BentoGridCanvas";
import { InteractiveSimulator } from "@/components/templates/InteractiveSimulator";
import { SyncableFormula, SyncableText, SyncableVisualization, SyncableKeyword } from "@/components/templates/SyncSystem";
import { ScrollAnimationContainer, ScrollText } from "@/components/templates/ScrollAnimation";

export default function ChapterExample() {
  const router = useRouter();
  const { startTransition } = useChapterTransition();
  
  // 处理上一章导航
  const handlePreviousChapter = () => {
    // 第一章没有上一章，可以导航到章节索引页
    router.push('/chapters');
  };
  
  // 处理下一章导航
  const handleNextChapter = () => {
    // 开始章节过渡动画，导航到第二章
    startTransition(1, 2, () => {
      router.push('/chapters/chapter-02');
    });
  };
  
  // 处理章节选择
  const handleChapterSelect = (chapterNumber: number) => {
    if (chapterNumber === 1) {
      // 当前章节，不做任何操作
      return;
    }
    
    // 开始章节过渡动画
    startTransition(1, chapterNumber, () => {
      router.push(`/chapters/chapter-${chapterNumber.toString().padStart(2, '0')}`);
    });
  };
  return (
    <ChapterTemplate
      title="半导体物理基础"
      chapterNumber="CH.01"
      logicalPosition="第一部分：微观基石 - 注入'灵根'"
      objectives={[
        "理解晶体结构与能带理论",
        "掌握载流子传输机制",
        "分析PN结的形成与特性"
      ]}
      coreContent={[
        "晶体结构决定了半导体的基本电子特性",
        "能带理论解释了导体、半导体和绝缘体的区别",
        "载流子浓度和迁移率是半导体性能的关键参数",
        "PN结是大多数半导体器件的基础结构"
      ]}
      keywords={["能带理论", "载流子", "PN结", "禁带宽度"]}
      prerequisitePrompt="了解量子力学基础（波函数、薛定谔方程等基本概念）和固体物理基础（晶体结构、晶格振动等概念）。"
      openingLine="想象一个微观世界，其中电子不再是自由运动的粒子，而是被约束在特定的能量轨道上。这就是半导体的奇妙世界——一个介于导体和绝缘体之间的特殊领域。"
      mainContent={[
        {
          title: "晶体结构与能带理论",
          content: "半导体材料的电子特性从根本上取决于其原子排列方式。在晶体结构中，原子按照周期性规律排列，形成规则的晶格。这种周期性势场导致电子能级分裂，形成能带结构。",
          visualIndex: "能带结构示意图、晶体结构模型"
        },
        {
          title: "载流子传输机制",
          content: "半导体中的电流主要由载流子的定向移动产生。载流子包括电子和空穴，它们的运动特性可以用迁移率来描述。载流子的漂移速度与电场强度成正比，直到达到速度饱和。"
        },
        {
          title: "PN结的形成与特性",
          content: "当P型半导体和N型半导体接触时，会形成PN结。PN结是大多数半导体器件的基础结构，其特性源于结区附近的耗尽区和内建电场。PN结的电流-电压特性遵循二极管方程。"
        }
      ]}
      logicalChain="晶体结构→能带形成→载流子行为→电流形成。原子周期性排列导致电子能级分裂形成能带，能带中的电子分布决定了载流子的产生和运动，载流子在电场作用下的定向移动形成电流。"
      chapterSummary="本章介绍了半导体材料的基本物理特性，包括晶体结构、能带理论和载流子传输机制。这些基础知识是理解后续半导体器件原理的基础。"
      nextChapterPreview="下一章将深入探讨晶体结构如何影响半导体特性，介绍不同类型的晶体结构和缺陷对半导体性能的影响。"
      sectMentality={{
        overview: "【能带心法】半导体之道，在于能带之分。导体之能带相连，绝缘体之能带相隔，半导体则介于其间，巧妙调控。能带之隙，称为禁带，其宽度决定材料之性。",
        breakthrough: [
          "第一式·观能带：洞察价带与导带之别，明辨载流子之源",
          "第二式·控载流：掌握电子与空穴之性，调控其浓度与迁移",
          "第三式·筑结界：运用PN结之理，构建半导体器件之基"
        ],
        corePrinciple: "禁带宽度为材料之本性，载流子浓度为可调之参数。通过掺杂之术，可改变半导体之导电特性，此乃半导体工艺之精髓。"
      }}
      onPreviousChapter={handlePreviousChapter}
      onNextChapter={handleNextChapter}
      onChapterSelect={handleChapterSelect}
    />
  );
}
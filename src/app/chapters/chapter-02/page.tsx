"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChapterTemplate from "@/components/templates/ChapterTemplate";
import { ChapterNavigation } from "@/components/templates/ChapterNavigation";

// 导航配置
const chapterNav = {
  previous: {
    number: 1,
    title: "半导体物理基础",
    path: "/chapters/chapter-01"
  },
  current: {
    number: 2,
    title: "晶体结构与能带理论",
    path: "/chapters/chapter-02"
  },
  next: {
    number: 3,
    title: "载流子输运",
    path: "/chapters/chapter-03"
  }
};

// 学习目标
const learningObjectives = [
  "理解晶体的基本结构和布拉菲格子",
  "掌握能带理论的基本概念和形成机制",
  "理解价带、导带和禁带的概念",
  "掌握半导体材料与金属、绝缘体的区别",
  "了解常见半导体材料的能带结构特点"
];

// 关键词
const keywords = [
  { id: "crystal-structure", term: "晶体结构", definition: "原子在三维空间中周期性排列形成的有序结构" },
  { id: "bravais-lattice", term: "布拉菲格子", definition: "14种基本的晶体格子类型，描述晶格的平移对称性" },
  { id: "band-theory", term: "能带理论", definition: "描述固体中电子能量状态的量子力学理论" },
  { id: "valence-band", term: "价带", definition: "被价电子填满的能量最高的能带" },
  { id: "conduction-band", term: "导带", definition: "未被电子填满或部分填充的能带，电子可在其中自由移动" },
  { id: "band-gap", term: "禁带/带隙", definition: "价带顶与导带底之间的能量差，决定材料的导电性" }
];

// 前置知识
const prerequisites = [
  {
    title: "量子力学基础知识",
    description: "理解量子力学的基本原理和概念",
    isMet: true
  },
  {
    title: "原子结构与电子排布",
    description: "了解原子的电子轨道和排布规律",
    isMet: true
  },
  {
    title: "波函数与薛定谔方程",
    description: "掌握波函数的概念和薛定谔方程的基本形式",
    isMet: false
  },
  {
    title: "第一章半导体物理基础内容",
    description: "已完成第一章的学习内容",
    isMet: true
  }
];

// 核心内容
const coreContent = [
  "晶体结构决定了半导体的基本电子特性",
  "能带理论解释了导体、半导体和绝缘体的区别",
  "载流子浓度和迁移率是半导体性能的关键参数",
  "PN结是大多数半导体器件的基础结构"
];

// 起手式
  const hook = {
    narrative: "想象一下，你手中握着的智能手机，其核心是数十亿个晶体管组成的集成电路。这些晶体管的工作原理，源于半导体材料的特殊性质。要理解这一切，我们必须从最基础的晶体结构开始探索。",
    context: "半导体材料是现代电子技术的基石，其独特的电学性质源于原子排列和能带结构。本章将带你深入探索这个微观世界。"
  };
  
  // 宗门心法
  const secretTechnique = {
    title: "能带理论心法",
    content: "能带理论是理解半导体材料性质的钥匙。当原子形成晶体时，电子的能级会分裂成能带，价带中的电子和导带中的空穴决定了材料的导电性质。",
    entertainment: "趣味知识：硅元素的名称来源于拉丁文'silex'，意为'燧石'。硅是地壳中含量第二丰富的元素，仅次于氧。"
  };
  
  // 本章小结
const chapterSummary = {
  keyPoints: [
    "晶体结构是半导体材料的基础，决定了其物理性质",
    "能带理论解释了固体中电子的行为，是理解半导体性质的关键",
    "价带、导带和禁带的概念是区分导体、半导体和绝缘体的基础",
    "半导体材料的带隙适中，使其电导率可通过多种方式调节"
  ],
  logicChain: [
    {
      from: "原子周期性排列",
      to: "形成晶体结构",
      description: "原子在三维空间中的周期性排列构成了晶体的基本结构"
    },
    {
      from: "原子相互作用",
      to: "能级分裂成能带",
      description: "原子间的相互作用导致离散能级分裂成连续的能带结构"
    },
    {
      from: "泡利不相容原理",
      to: "电子填充不同能态",
      description: "泡利不相容原理决定了电子在能带中的填充方式"
    },
    {
      from: "能带结构差异",
      to: "材料导电性不同",
      description: "不同的能带结构决定了材料的导电性质差异"
    }
  ]
};

// 下一章预览
  const nextChapterPreview = {
    title: "第三章：载流子输运机制",
    connection: "基于第二章的能带理论，第三章将深入探讨半导体中载流子的输运机制，包括漂移、扩散和散射过程。",
    teaser: "探索电子和空穴如何在半导体中运动，以及温度、电场和杂质浓度如何影响这种运动。"
  };



  export default function Chapter02() {
  const router = useRouter();
  
  // 处理上一章导航
  const handlePreviousChapter = () => {
    router.push('/chapters/chapter-01');
  };
  
  // 处理下一章导航
  const handleNextChapter = () => {
    router.push('/chapters/chapter-03');
  };
  
  // 处理章节选择
  const handleChapterSelect = (chapterNumber: number) => {
    if (chapterNumber === 2) {
      // 当前章节，不做任何操作
      return;
    }
    
    // 直接导航到选定的章节
    router.push(`/chapters/chapter-${chapterNumber.toString().padStart(2, '0')}`);
  };
  
  return (
    <ChapterTemplate
      title="晶体结构与能带理论"
      chapterNumber="CH.02"
      logicalPosition="第一部分：微观基石 - 晶体结构"
      objectives={learningObjectives}
      coreContent={coreContent}
      keywords={keywords.map(k => k.term)}
      prerequisitePrompt="了解量子力学基础知识、原子结构与电子排布，以及第一章半导体物理基础内容。波函数与薛定谔方程的知识有助于更深入理解。"
      openingLine={hook.narrative + " " + hook.context}
      mainContent={[
        {
          title: "晶体结构：半导体的骨架",
          content: "半导体材料的电子特性从根本上取决于其原子排列方式。硅和锗等半导体材料具有金刚石晶体结构，其中每个原子与四个相邻原子形成共价键，形成稳定的四面体结构。这种规整的原子排列为电子提供了特定的运动环境，决定了半导体的基本物理特性。",
          visualIndex: "金刚石晶体结构模型、硅晶格示意图"
        },
        {
          title: "能带理论：电子的\"高速公路\"",
          content: "在孤立原子中，电子只能占据特定的能级。当原子形成晶体时，这些能级会扩展成能带。价带包含被电子填满的能级，导带是电子可以自由移动形成电流的能带，两者之间的禁带宽度决定了材料的导电性质。半导体的禁带宽度适中（硅约1.1eV），使得电子可以通过热激发或光照从价带跃迁到导带，参与导电过程。",
          visualIndex: "能带结构示意图、导体半导体绝缘体对比"
        },
        {
          title: "载流子：电流的载体",
          content: "在半导体中，电流由两种载流子共同贡献：带负电的电子和带正电的空穴。电子是导带中的自由粒子，而空穴则是价带中电子离开后留下的\"空位\"，表现为等效的正电荷。载流子的浓度和迁移率是半导体性能的关键参数，它们决定了半导体器件的导电能力和工作速度。",
          visualIndex: "载流子运动动画、电子-空穴对示意图"
        },
        {
          title: "PN结：半导体器件的基础",
          content: "当P型半导体（多空穴）和N型半导体（多电子）接触时，它们之间会形成PN结。由于载流子浓度差，电子会从N区扩散到P区，空穴则从P区扩散到N区，在接触面附近形成耗尽层和内建电场。这个电场阻止进一步扩散，最终达到动态平衡。PN结具有单向导电性，是二极管、晶体管等大多数半导体器件的核心结构。",
          visualIndex: "PN结形成过程、耗尽层示意图"
        }
      ]}
      logicalChain="晶体结构决定原子排列→原子排列决定能带结构→能带结构决定载流子行为→载流子行为决定电流特性→电流特性决定器件功能"
      chapterSummary="本章介绍了半导体材料的晶体结构特性和能带理论。晶体结构是半导体材料的基础，决定了其物理性质。能带理论解释了固体中电子的行为，是理解半导体性质的关键。价带、导带和禁带的概念是区分导体、半导体和绝缘体的基础。半导体材料的带隙适中，使其电导率可通过多种方式调节。"
      nextChapterPreview="下一章将深入探讨半导体中载流子的输运机制，包括漂移、扩散和散射过程。探索电子和空穴如何在半导体中运动，以及温度、电场和杂质浓度如何影响这种运动。"
      sectMentality={{
        overview: "【晶体心法】半导体之道，在于晶体之序。原子排列如阵法，能带分层如天阶，载流子流动如气血，PN结界如关隘。悟透此道，可掌控硅基之灵力。",
        breakthrough: [
          "第一式·观晶格：洞察原子排列之阵法，理解共价键如何构建稳定结构",
          "第二式·悟能带：穿透价带导带之天阶，掌握禁带宽度决定材料本性",
          "第三式·御载流：驾驭电子空穴之气血，平衡浓度与迁移率",
          "第四式·筑结界：运用PN结之关隘，控制单向导电之妙用"
        ],
        corePrinciple: "晶体为体，能带为用，载流子为气，结界为门。四者合一，方成半导体之道。"
      }}
      onPreviousChapter={handlePreviousChapter}
      onNextChapter={handleNextChapter}
      onChapterSelect={handleChapterSelect}
    />
  );
}
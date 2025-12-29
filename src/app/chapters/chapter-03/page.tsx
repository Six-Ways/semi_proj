"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChapterTemplate from "@/components/templates/ChapterTemplate";

export default function Chapter03() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handlePreviousChapter = () => {
    router.push("/chapters/chapter-02");
  };
  
  const handleNextChapter = () => {
    router.push("/chapters/chapter-04");
  };
  
  const handleChapterSelect = (chapterNumber: number) => {
    if (chapterNumber === 3) {
      // 当前章节，不做任何操作
      return;
    }
    
    // 直接导航到选定的章节
    router.push(`/chapters/chapter-${chapterNumber.toString().padStart(2, '0')}`);
  };

  return (
    <ChapterTemplate
      title="载流子输运机制"
      chapterNumber="CH.03"
      logicalPosition="第一部分：微观基石 - 载流子流动"
      objectives={[
        "理解载流子输运的基本概念和机制",
        "掌握漂移和扩散过程的数学描述",
        "分析散射机制对载流子迁移率的影响",
        "理解连续性方程和泊松方程的应用"
      ]}
      coreContent={[
        "载流子输运是半导体器件工作的物理基础",
        "漂移和扩散是两种基本的载流子输运机制",
        "散射过程决定了载流子的迁移率和寿命",
        "连续性方程描述了载流子的产生、复合和输运"
      ]}
      keywords={["载流子输运", "漂移", "扩散", "散射", "迁移率", "连续性方程"]}
      prerequisitePrompt="掌握第二章的晶体结构与能带理论，了解电子和空穴的基本概念，熟悉电场和电势的基本物理知识。"
      openingLine="想象电子和空穴在半导体晶体中如同河流中的水流，它们在电场作用下的定向移动形成电流，这种运动过程就是载流子输运。"
      mainContent={[
        {
          title: "载流子漂移：电场驱动下的定向运动",
          content: "当半导体中施加电场时，载流子会受到电场力的作用，产生定向运动，这种现象称为漂移。漂移速度与电场强度成正比，比例系数即为载流子迁移率。电子和空穴的迁移率不同，这源于它们不同的有效质量和散射机制。",
          visualIndex: "载流子漂移动画、漂移速度与电场关系图"
        },
        {
          title: "载流子扩散：浓度梯度驱动的无规则运动",
          content: "当半导体中载流子浓度分布不均匀时，载流子会从高浓度区域向低浓度区域扩散，这种现象称为扩散。扩散流与浓度梯度成正比，比例系数为扩散系数。扩散系数与迁移率通过爱因斯坦关系相互关联，反映了热平衡状态下载流子的统计特性。",
          visualIndex: "载流子扩散动画、费克定律示意图"
        },
        {
          title: "散射机制：载流子运动的阻碍",
          content: "载流子在半导体中运动会受到各种散射机制的影响，包括晶格散射、杂质散射和载流子间散射。晶格散射源于晶格振动（声子），随温度升高而增强；杂质散射由电离杂质引起，随温度升高而减弱。这些散射机制共同决定了载流子的迁移率和温度依赖性。",
          visualIndex: "散射机制示意图、迁移率与温度关系图"
        },
        {
          title: "连续性方程：载流子输运的数学描述",
          content: "连续性方程是描述载流子浓度随时间和空间变化的基本方程，它考虑了载流子的产生、复合、漂移和扩散过程。结合泊松方程，可以完整描述半导体器件中的载流子行为和电场分布。这些方程是半导体器件物理的基础，也是器件模拟的核心。",
          visualIndex: "连续性方程推导、PN结载流子分布图"
        }
      ]}
      logicalChain="电场产生→载流子受力→漂移运动→电流形成；浓度梯度→载流子扩散→电流形成；散射过程→迁移率变化→输运特性改变"
      chapterSummary="本章介绍了半导体中载流子输运的基本机制，包括漂移和扩散两种基本过程，以及影响载流子运动的散射机制。通过连续性方程和泊松方程，可以定量描述载流子的输运行为，为理解半导体器件的工作原理奠定了基础。"
      nextChapterPreview="下一章将深入探讨PN结的形成原理和特性，这是大多数半导体器件的核心结构，也是理解二极管、晶体管等器件工作原理的关键。"
      sectMentality={{
        overview: "【输运心法】载流子之道，在于流动之理。电场如风，吹动电子前行；浓度如水，驱动载流子扩散；散射如阻，减缓运动速度。悟透此道，可掌控电流之流向。",
        breakthrough: [
          "第一式·御电场：运用电场之力，驾驭载流子漂移之方向",
          "第二式·顺浓度：顺应浓度之梯度，引导载流子扩散之流向",
          "第三式·破散射：洞察散射之机制，优化载流子迁移之效率",
          "第四式·立方程：建立连续性之方程，预测载流子输运之行为"
        ],
        corePrinciple: "漂移为定向之力，扩散为无序之动，散射为阻碍之因，方程为描述之器。四者合一，方成载流子输运之道。"
      }}
      onPreviousChapter={handlePreviousChapter}
      onNextChapter={handleNextChapter}
      onChapterSelect={handleChapterSelect}
    />
  );
}
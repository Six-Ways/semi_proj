"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChapterTemplate from "@/components/templates/ChapterTemplate";

export default function Chapter04() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handlePreviousChapter = () => {
    router.push("/chapters/chapter-03");
  };
  
  const handleNextChapter = () => {
    router.push("/chapters/chapter-05");
  };
  
  const handleChapterSelect = (chapterNumber: number) => {
    if (chapterNumber === 4) {
      // 当前章节，不做任何操作
      return;
    }
    
    // 直接导航到选定的章节
    router.push(`/chapters/chapter-${chapterNumber.toString().padStart(2, '0')}`);
  };

  return (
    <ChapterTemplate
      title="PN结与二极管"
      chapterNumber="CH.04"
      logicalPosition="第一部分：微观基石 - 结界形成"
      objectives={[
        "理解PN结的形成过程和平衡状态",
        "掌握PN结的电流-电压特性",
        "分析PN结的电容效应和击穿机制",
        "了解二极管的基本应用和特性参数"
      ]}
      coreContent={[
        "PN结是半导体器件的基础结构，由P型和N型半导体接触形成",
        "PN结具有单向导电性，这是大多数半导体器件工作的基础",
        "PN结的电流-电压特性可以用二极管方程精确描述",
        "PN结的电容效应和击穿机制决定了器件的高频特性和功率极限"
      ]}
      keywords={["PN结", "耗尽区", "内建电场", "二极管方程", "击穿电压", "结电容"]}
      prerequisitePrompt="掌握第三章的载流子输运机制，了解漂移和扩散过程，熟悉电场和电势的基本概念，以及连续性方程的应用。"
      openingLine="当P型半导体和N型半导体相遇，它们之间会形成一个神奇的界面——PN结。这个看似简单的结构，却是现代电子技术的基石，它如同一个单向阀门，控制着电流的流向。"
      mainContent={[
        {
          title: "PN结的形成：平衡状态的建立",
          content: "当P型半导体（多空穴）和N型半导体（多电子）接触时，由于载流子浓度差，电子会从N区扩散到P区，空穴则从P区扩散到N区。这种扩散运动在接触面附近形成耗尽区，并产生内建电场。内建电场阻止进一步扩散，最终达到动态平衡状态。平衡时，漂移电流和扩散电流相互抵消，净电流为零。",
          visualIndex: "PN结形成过程动画、耗尽区和内建电场示意图"
        },
        {
          title: "PN结的电流-电压特性：二极管方程",
          content: "当PN结施加正向偏压时，外加电场削弱内建电场，使得多数载流子能够越过势垒，形成较大的正向电流。当施加反向偏压时，外加电场增强内建电场，耗尽区变宽，只有很小的反向饱和电流流过。这种非线性的电流-电压特性可以用二极管方程精确描述：I = Is(e^(qV/kT) - 1)，其中Is是反向饱和电流，q是电子电荷，V是施加电压，k是玻尔兹曼常数，T是绝对温度。",
          visualIndex: "PN结能带图、二极管I-V特性曲线"
        },
        {
          title: "PN结的电容效应：耗尽区电容和扩散电容",
          content: "PN结具有电容效应，主要由耗尽区电容和扩散电容两部分组成。耗尽区电容源于耗尽区宽度随外加电压变化，类似于平行板电容器；扩散电容则源于正向偏压下少数载流子在扩散区的存储效应。在高频应用中，这些电容效应会影响器件的性能。耗尽区电容在反向偏压下起主导作用，而扩散电容在正向偏压下更为显著。",
          visualIndex: "PN结电容模型、电容与电压关系图"
        },
        {
          title: "PN结的击穿机制：雪崩击穿和齐纳击穿",
          content: "当PN结施加足够高的反向电压时，会发生击穿现象，导致反向电流急剧增大。主要有两种击穿机制：雪崩击穿和齐纳击穿。雪崩击穿发生在轻掺杂PN结中，当载流子在强电场下加速获得足够能量，通过碰撞电离产生新的电子-空穴对，形成载流子倍增效应。齐纳击穿发生在重掺杂PN结中，强电场直接使电子从价带隧穿到导带，形成隧道电流。不同击穿机制决定了稳压二极管的不同特性和应用。",
          visualIndex: "击穿机制示意图、击穿特性曲线"
        }
      ]}
      logicalChain="P型与N型接触→载流子扩散→耗尽区形成→内建电场建立→平衡状态达成；外加偏压→势垒变化→载流子输运→电流形成"
      chapterSummary="本章详细介绍了PN结的形成过程、工作原理和特性参数。PN结作为半导体器件的基础结构，其单向导电性是大多数电子器件工作的基础。通过理解PN结的电流-电压特性、电容效应和击穿机制，可以为后续学习各种半导体器件奠定坚实基础。"
      nextChapterPreview="下一章将深入探讨双极型晶体管(BJT)的工作原理，这是在PN结基础上发展起来的三端器件，也是现代电子电路中的核心元件。"
      sectMentality={{
        overview: "【结界心法】PN结之道，在于界面之理。电子空穴如阴阳，扩散漂移如动静，耗尽区如结界，内建电场如屏障。悟透此道，可掌控电流之通断。",
        breakthrough: [
          "第一式·观结界：洞察PN结之形成，理解耗尽区与内建电场",
          "第二式·控电流：运用偏压之变化，控制单向导电之特性",
          "第三式·析电容：分析结电容之效应，优化高频应用之性能",
          "第四式·防击穿：预防击穿之机制，确保器件工作之稳定"
        ],
        corePrinciple: "扩散为动，漂移为衡，耗尽为界，电场为障。四者合一，方成PN结之道。"
      }}
      onPreviousChapter={handlePreviousChapter}
      onNextChapter={handleNextChapter}
      onChapterSelect={handleChapterSelect}
    />
  );
}
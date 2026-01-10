'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const SemiconductorRevolutionTimeline: React.FC = () => {
  // 从内容中提取的里程碑事件
  const timelineEvents: TimelineEvent[] = [
    {
      year: '1947年',
      title: '晶体管发明',
      description: '贝尔实验室发明点接触晶体管，终结真空管主导的电子设备时代，为集成电路的诞生奠定核心器件基础'
    },
    {
      year: '1958-1959年',
      title: '集成电路诞生',
      description: '杰克·基尔比与罗伯特·诺伊斯分别独立研制出集成电路（IC），实现"多元件集成于单硅片"的技术突破'
    },
    {
      year: '1961年',
      title: '平面型集成电路',
      description: '仙童半导体推出平面型集成电路，确立光刻工艺在器件制备中的核心地位'
    },
    {
      year: '1965年',
      title: '摩尔定律提出',
      description: '戈登·摩尔提出"摩尔定律"，预判硅片上的晶体管数量每18-24个月翻倍、成本减半'
    },
    {
      year: '1960年代',
      title: 'MOSFET发明',
      description: '金属-氧化物-半导体场效应晶体管（MOSFET）被发明，成为现代集成电路的核心基础器件'
    },
    {
      year: '1971年',
      title: '第一颗微处理器',
      description: 'Intel推出全球首款通用可编程微处理器4004，集成2300个晶体管'
    },
    {
      year: '1990年代',
      title: '深亚微米时代',
      description: 'CMOS工艺进入深亚微米时代，集成电路集成度实现量级提升'
    },
    {
      year: '1999年',
      title: 'FinFET结构提出',
      description: '胡正明提出鳍式场效应晶体管（FinFET）结构，为纳米尺度器件突破平面结构瓶颈提供解决方案'
    },
    {
      year: '2011年',
      title: '3D器件时代',
      description: 'Intel量产22nm FinFET工艺，标志着集成电路正式进入3D器件结构时代'
    },
    {
      year: '2020年代',
      title: '后摩尔时代',
      description: '全环绕栅极（GAA FET）结构开始商业化应用，芯粒（Chiplet）技术成为提升集成度的核心方向'
    }
  ];

  return (
    <div className="bg-white rounded-lg pt-4 pb-6 pl-6 pr-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
      {/* 标题部分 */}
      <motion.h3 
        className="font-serif text-2xl font-semibold mb-4 text-[#007AFF] pb-2 border-b-2 border-[#007AFF]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        一场从 “单个零件” 到 “亿万器件” 的革命
      </motion.h3>
      
      {/* 引言部分 */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-gray-600 leading-relaxed mb-4">
          70 多年前，当贝尔实验室的科学家发明第一只晶体管时，没人想到这个指甲盖大小的元件，会开启一场技术革命。在此之前，电子设备靠笨重的真空管工作 —— 一台收音机比冰箱还大，一台计算机需要一间屋子才能装下。晶体管的出现，第一次让 “控制电流” 变得小巧又可靠。
        </p>
        
        <p className="text-gray-600 leading-relaxed mb-4">
          但真正的飞跃，来自 <span className="font-bold text-[#007AFF]">“集成电路”</span> 的诞生。就像把分散的零件组装成一台完整的机器，科学家们把成千上万的晶体管、电阻、电容 “刻” 在同一块硅片上，让它们协同工作。这一下，电子设备的体积越做越小，性能却越来越强。
        </p>
        
        <p className="text-gray-600 leading-relaxed">
          <span className="font-bold text-[#007AFF]">1965 年</span>，戈登・摩尔（Intel 创始人之一）做了个大胆预测：每隔 18-24 个月，一块硅片上的晶体管数量会翻倍，而成本会减半。这就是著名的 <span className="font-bold text-[#007AFF]">“摩尔定律”</span>—— 它不是物理定律，却成了技术演进的 “指南针”，驱动着半导体行业狂奔了半个多世纪。
        </p>
      </motion.div>
      
      {/* 关键数据部分 */}
      <motion.div 
        className="grid md:grid-cols-3 gap-4 mb-10 bg-[#f8fafc] p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">1971年第一颗微处理器</p>
          <p className="text-3xl font-bold text-[#007AFF]">2,300</p>
          <p className="text-sm text-gray-500">晶体管数量</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">当前高端芯片</p>
          <p className="text-3xl font-bold text-[#007AFF]">1,000亿+</p>
          <p className="text-sm text-gray-500">晶体管数量</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">最先进工艺</p>
          <p className="text-3xl font-bold text-[#007AFF]">2nm</p>
          <p className="text-sm text-gray-500">工艺节点</p>
        </div>
      </motion.div>
      
      {/* 里程碑标题 */}
      <motion.h4 
        className="font-serif text-xl font-semibold mb-6 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        关键技术里程碑与工艺演进脉络
      </motion.h4>
      
      {/* 时间线部分 */}
      <div className="space-y-6">
        {timelineEvents.map((event, index) => (
          <motion.div 
            key={index}
            className="relative pl-8 pb-8 border-l-2 border-[#007AFF]/30 last:border-l-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
          >
            {/* 时间点标记 */}
            <div className="absolute left-[-9px] top-0 w-4 h-4 bg-[#007AFF] rounded-full border-2 border-white shadow-sm"></div>
            
            {/* 年份 */}
            <h5 className="font-mono font-bold text-[#007AFF] mb-1">{event.year}</h5>
            
            {/* 事件标题 */}
            <h6 className="font-semibold text-gray-800 mb-2">{event.title}</h6>
            
            {/* 事件描述 */}
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </motion.div>
        ))}
      </div>
      
      {/* 总结部分 */}
      <motion.div 
        className="mt-10 pt-6 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <p className="text-gray-700 leading-relaxed font-medium">
          上述里程碑事件串联起从器件发明、工艺升级到系统集成的完整演进链条，反映了半导体行业 <span className="text-[#007AFF] font-bold">“尺度微缩—结构创新—协同集成”</span> 的核心发展逻辑。
        </p>
      </motion.div>
    </div>
  );
};

export default SemiconductorRevolutionTimeline;
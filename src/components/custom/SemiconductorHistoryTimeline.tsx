'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface SemiconductorHistoryTimelineProps {
  content: string;
}

const SemiconductorHistoryTimeline: React.FC<SemiconductorHistoryTimelineProps> = ({ content }) => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [intro, setIntro] = useState<string>('');

  // 从Markdown内容中提取时间线事件
  useEffect(() => {
    // 提取引言部分（标题后、列表前的内容）
    const introMatch = content.match(/## 一场从 “单个零件” 到 “亿万器件” 的革命\n\n([\s\S]*?)\n\n集成电路的发展历程/);
    if (introMatch && introMatch[1]) {
      setIntro(introMatch[1]);
    }

    // 提取时间线事件
    const eventMatches = content.matchAll(/\- `(\d{4}年|\d{4}-\d{4}年|\d{4}年代)`：([^；]+)；(.*)/g);
    const events: TimelineEvent[] = [];
    
    for (const match of eventMatches) {
      const [, year, title, description] = match;
      events.push({
        year,
        title: title.trim(),
        description: description.trim()
      });
    }

    setTimelineEvents(events);
  }, [content]);

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
      {intro && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-gray-600 leading-relaxed mb-4">
            {intro}
          </p>
        </motion.div>
      )}
      
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

export default SemiconductorHistoryTimeline;
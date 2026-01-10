'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Lightbulb, ArrowRight } from 'lucide-react';

interface SeekKnowledgeModuleProps {
  content: string;
  theme?: any;
}

const SeekKnowledgeModule: React.FC<SeekKnowledgeModuleProps> = ({ content, theme }) => {
  // 解析内容，提取问题列表
  const parseContent = () => {
    // 简单的解析逻辑：提取以问号结尾的句子作为问题
    const questions = content.split('\n')
      .filter(line => line.trim().endsWith('?') || line.trim().startsWith('-'))
      .map(line => {
        // 移除列表标记
        const cleaned = line.trim().replace(/^[-*+]\s*/, '').trim();
        return cleaned;
      })
      .filter(question => question.length > 0);
    
    return questions;
  };
  
  const questions = parseContent();
  
  return (
    <div className={`bg-white rounded-lg pt-4 pb-6 pl-6 pr-6 shadow-sm border border-gray-100 transition-all hover:shadow-md`}>
      {/* 标题部分 */}
      <motion.div
        className="flex items-center space-x-3 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Lightbulb className="h-6 w-6 text-[#007AFF]" />
        <h2 className="font-serif text-xl font-semibold text-gray-800">上下求索</h2>
      </motion.div>
      
      {/* 引导文字 */}
      <motion.p
        className="text-gray-600 mb-6 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        通过思考以下问题，深入探索本章主题：
      </motion.p>
      
      {/* 问题列表 */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <motion.div
            key={index}
            className="flex items-start space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            {/* 箭头图标 */}
            <div className="mt-1 flex-shrink-0 text-[#007AFF]">
              <ArrowRight className="h-4 w-4" />
            </div>
            
            {/* 问题内容 */}
            <p className="text-gray-700 leading-relaxed">
              {question}
            </p>
          </motion.div>
        ))}
      </div>
      
      {/* 如果没有解析到问题，显示默认内容 */}
      {questions.length === 0 && (
        <motion.p
          className="text-gray-500 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {content || "通过问题引导，深入思考本章核心内容。"}
        </motion.p>
      )}
    </div>
  );
};

export default SeekKnowledgeModule;
'use client';

import { motion } from 'framer-motion';
import { SectionComponentProps } from '@/components/MDXContentRenderer';

export function ComparisonModule({ content, theme }: SectionComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">⚖️</div>
        <h3 className="text-2xl font-bold text-purple-800">对比分析</h3>
      </div>
      <div className="prose prose-lg max-w-none font-serif text-gray-700 leading-relaxed">
        {content}
      </div>
    </motion.div>
  );
}

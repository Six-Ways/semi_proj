'use client';

import { motion } from 'framer-motion';
import { SectionComponentProps } from '@/components/MDXContentRenderer';

export function ListDisplayModule({ content, theme }: SectionComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">📋</div>
        <h3 className="text-2xl font-bold text-yellow-800">清单列表</h3>
      </div>
      <div className="prose prose-lg max-w-none font-serif text-gray-700 leading-relaxed">
        {content}
      </div>
    </motion.div>
  );
}

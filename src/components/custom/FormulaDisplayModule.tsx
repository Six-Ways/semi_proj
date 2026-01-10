'use client';

import { motion } from 'framer-motion';
import { SectionComponentProps } from '@/components/MDXContentRenderer';

export function FormulaDisplayModule({ content, theme }: SectionComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">🧮</div>
        <h3 className="text-2xl font-bold text-purple-800">公式展示</h3>
      </div>
      <div className="text-center text-xl font-serif text-gray-700 py-6">
        {content.replace(/^\$\$|\$\$/g, '')}
      </div>
    </motion.div>
  );
}

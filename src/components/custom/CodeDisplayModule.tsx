'use client';

import { motion } from 'framer-motion';
import { SectionComponentProps } from '@/components/MDXContentRenderer';

export function CodeDisplayModule({ content, theme }: SectionComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">💻</div>
        <h3 className="text-2xl font-bold text-gray-800">代码示例</h3>
      </div>
      <pre className="bg-gray-800 text-gray-100 p-6 rounded-xl overflow-x-auto">
        <code>{content.replace(/^```[\w]*\n|```$/g, '')}</code>
      </pre>
    </motion.div>
  );
}

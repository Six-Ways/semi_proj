'use client';

import { motion } from 'framer-motion';
import { SectionComponentProps } from '@/components/MDXContentRenderer';

export function StyledBlockquoteModule({ content, theme }: SectionComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-cyan-50 to-teal-50 border-2 border-cyan-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">💬</div>
        <h3 className="text-2xl font-bold text-cyan-800">引用内容</h3>
      </div>
      <blockquote className="border-l-4 border-cyan-500 pl-6 py-4 my-4 italic text-gray-700">
        {content.replace(/^>\s*/gm, '')}
      </blockquote>
    </motion.div>
  );
}

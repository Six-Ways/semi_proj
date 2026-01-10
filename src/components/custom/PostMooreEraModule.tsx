'use client';

import { motion } from 'framer-motion';
import { SectionComponentProps } from '@/components/MDXContentRenderer';

export function PostMooreEraModule({ content, theme, visual = 'timeline' }: SectionComponentProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-semibold mb-3 text-gray-900 leading-tight">
          后摩尔时代：从 <span className="text-[#4ECDC4]">"做小"</span> 到 <span className="text-[#4ECDC4]">"做好"</span> 的新范式
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#4ECDC4] to-[#45B7D1] rounded-full"></div>
      </motion.div>

      {visual === 'timeline' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-teal-50 border-l-4 border-[#4ECDC4] p-5 my-6 rounded-r-xl"
        >
          <p className="text-base mb-2">
            <span className="font-mono text-[#4ECDC4] font-semibold">时间线视图</span>：以下是后摩尔时代的三大技术方向
          </p>
        </motion.div>
      )}

      <div className="prose prose-lg max-w-none mb-10 font-serif text-gray-700 leading-relaxed">
        <p className="text-justify">
          {content}
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {[
          {
            year: '3D集成',
            title: '筑灵塔',
            description: '不再于平面苦修，而是层层叠立，以垂直之道突破空间桎梏，筑就3D集成灵塔，集成度倍增',
            color: 'from-blue-50 to-indigo-50',
            icon: '🏗️'
          },
          {
            year: '新材料革命',
            title: '换灵根',
            description: '舍弃凡体硅身，炼化氮化镓（GaN）之躯，得宽禁带之体，可耐高压、抗高温，肉身成圣',
            color: 'from-green-50 to-emerald-50',
            icon: '💎'
          },
          {
            year: '新器件原理',
            title: '悟天道',
            description: '不再拘泥于古法场效应之术，转而感悟量子隧穿、自旋大道等新法则，开辟前所未见之神通',
            color: 'from-purple-50 to-violet-50',
            icon: '✨'
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`bg-gradient-to-r ${item.color} rounded-xl p-6 border border-gray-200 shadow-sm`}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">{item.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 font-mono">{item.year}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

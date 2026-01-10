'use client';

import { motion } from 'framer-motion';

// 简化的组件属性接口，只包含必要的属性
export interface ScaleDownChallengeProps {
  theme?: any;
  interactive?: boolean;
}

// 简化组件，直接使用硬编码内容，避免依赖外部传入的content
export default function ScaleDownChallengeBentoModule({ theme, interactive = false }: ScaleDownChallengeProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow mb-12">
      {/* 标题区域 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="text-3xl font-semibold mb-3 text-gray-900 leading-tight font-sans">
          越小越好？<span className="text-[#007AFF]">尺度微缩</span> 的甜蜜与烦恼
        </h2>
        <div className="h-1 w-24 bg-[#007AFF] rounded-full mx-auto"></div>
      </motion.div>

      {/* 本托网格布局 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 左侧：核心内容 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-8 bg-[#f8fafc] rounded-xl p-6"
        >
          <p className="text-justify text-gray-700 leading-relaxed font-serif">
            为什么要把晶体管做得这么小？答案很简单：<strong>更小 = 更快、更省、更便宜</strong>。想象一下，把晶体管比作 "电子开关"—— 开关越小，电子从一端跑到另一端的距离就越短，开关速度自然更快；同样大小的硅片上能放更多开关，就能实现更复杂的功能；而批量生产时，"挤下更多器件" 意味着每个器件的成本被摊薄，最终惠及每个人。这就是尺度微缩的 "甜蜜"，也是摩尔定律能持续的核心驱动力。但天下没有免费的午餐。当晶体管的尺寸缩小到纳米级别（1 纳米 = 10 亿分之一米，比单个原子大不了多少），麻烦开始出现了：
          </p>
        </motion.div>

        {/* 右侧：挑战卡片 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-4 space-y-6"
        >
          {/* 短沟道效应 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#007AFF] mr-3">
                ⚡
              </div>
              <h3 className="text-lg font-semibold text-gray-900">短沟道效应</h3>
            </div>
            <p className="text-gray-700 text-sm">
              晶体管沟道太短时，漏极电场会穿透到源极，导致开关关不严，出现漏电
            </p>
          </div>

          {/* 功耗墙 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mr-3">
                🔥
              </div>
              <h3 className="text-lg font-semibold text-gray-900">功耗墙</h3>
            </div>
            <p className="text-gray-700 text-sm">
              开关太小，电流通过时电阻变大，发热剧增，芯片可能像灯泡一样发烫甚至烧毁
            </p>
          </div>

          {/* 物理极限 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3">
                ⚛️
              </div>
              <h3 className="text-lg font-semibold text-gray-900">物理极限</h3>
            </div>
            <p className="text-gray-700 text-sm">
              晶体管不能无限小，最终会触及原子尺度的物理规律
            </p>
          </div>
        </motion.div>
      </div>

      {/* 底部结论 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-[#f8fafc] rounded-xl p-6 border-l-4 border-[#007AFF]"
      >
        <p className="text-gray-700 font-serif leading-relaxed">
          到了 21 世纪第二个十年，摩尔定律的脚步明显慢了下来。尺度微缩的边际效益越来越低，继续 "做小" 的成本越来越高。这不是技术的失败，而是提醒我们：该换一种思路了。
        </p>
      </motion.div>
    </div>
  );
}
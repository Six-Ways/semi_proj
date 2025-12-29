import { useState, useCallback } from 'react';

interface ChapterTransitionState {
  isTransitioning: boolean;
  fromChapter: number;
  toChapter: number;
}

export function useChapterTransition() {
  const [transitionState, setTransitionState] = useState<ChapterTransitionState>({
    isTransitioning: false,
    fromChapter: -1,
    toChapter: -1,
  });

  const startTransition = useCallback((fromChapter: number, toChapter: number, callback: () => void) => {
    setTransitionState({
      isTransitioning: true,
      fromChapter,
      toChapter,
    });

    // 执行过渡动画
    setTimeout(() => {
      callback();
      // 重置过渡状态
      setTimeout(() => {
        setTransitionState({
          isTransitioning: false,
          fromChapter: -1,
          toChapter: -1,
        });
      }, 500);
    }, 300);
  }, []);

  return {
    transitionState,
    startTransition,
  };
}
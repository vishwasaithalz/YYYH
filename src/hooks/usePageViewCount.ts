import { useState, useEffect, useRef } from 'react';
import { pageViewEngine, ViewCountResult, BackendProviderType } from '../services/pageViewService';

interface UsePageViewOptions {
  articleId: string;
  baselineViews: number;
  engagementDelayMs?: number; // Milliseconds before counting active read
  cooldownMinutes?: number;
}

export interface UsePageViewReturn {
  views: number;
  isCountedThisSession: boolean;
  provider: BackendProviderType;
  providerLabel: string;
  hasIncremented: boolean;
}

/**
 * Custom hook to safely load and record verified article views with anti-inflation guards.
 */
export const usePageViewCount = ({
  articleId,
  baselineViews,
  engagementDelayMs = 3000,
  cooldownMinutes = 30
}: UsePageViewOptions): UsePageViewReturn => {
  const [views, setViews] = useState<number>(() => {
    return pageViewEngine.getViewCount(articleId, baselineViews);
  });

  const [hasIncremented, setHasIncremented] = useState(false);
  const [isCountedThisSession, setIsCountedThisSession] = useState(() => {
    return !pageViewEngine.shouldCountView(articleId, { cooldownMinutes });
  });
  const [providerLabel, setProviderLabel] = useState(() => {
    return pageViewEngine.getProviderLabel('local-persistent');
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Synchronize baseline / cached count on article change
    const initialCount = pageViewEngine.getViewCount(articleId, baselineViews);
    setViews(initialCount);

    const alreadyCounted = !pageViewEngine.shouldCountView(articleId, { cooldownMinutes });
    setIsCountedThisSession(alreadyCounted);

    // 2. Schedule verified view increment after minimum engagement delay (anti-bot / anti-bounce)
    timerRef.current = setTimeout(async () => {
      const result: ViewCountResult = await pageViewEngine.recordPageView(
        articleId, 
        baselineViews, 
        { cooldownMinutes }
      );

      setViews(result.views);
      setProviderLabel(result.providerLabel);
      if (result.isRecorded) {
        setHasIncremented(true);
        setIsCountedThisSession(true);
      }
    }, engagementDelayMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [articleId, baselineViews, engagementDelayMs, cooldownMinutes]);

  return {
    views,
    isCountedThisSession,
    provider: 'local-persistent',
    providerLabel,
    hasIncremented
  };
};

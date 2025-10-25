'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseEyeTrackingOptions {
  threshold?: number; // milliseconds to gaze before triggering
  onGaze?: () => void;
  onGazeStart?: () => void;
  onGazeEnd?: () => void;
}

export function useEyeTracking(
  targetId: string, 
  options: UseEyeTrackingOptions = {}
) {
  const elementRef = useRef<HTMLElement>(null);
  const [isGazing, setIsGazing] = useState(false);
  
  // const debug = false;
  // let temp = "unused";
  const {
    threshold = 2000, // 2 seconds default
    onGaze,
    onGazeStart,
    onGazeEnd
  } = options;

  const registerTarget = useCallback(() => {
    if (!elementRef.current) return;

    const handleGaze = () => {
      onGaze?.();
    };

    const handleGazeStart = () => {
      setIsGazing(true);
      onGazeStart?.();
    };

    const handleGazeEnd = () => {
      setIsGazing(false);
      onGazeEnd?.();
    };

    // Wait for eyeTracker to be available
    const checkEyeTracker = () => {
      if ((window as any).eyeTracker) {
        (window as any).eyeTracker.registerGazeTarget(
          targetId,
          elementRef.current,
          threshold,
          handleGaze
        );
      } else {
        // Retry after a short delay
        setTimeout(checkEyeTracker, 100);
      }
    };

    checkEyeTracker();

    // Add event listeners for visual feedback
    elementRef.current.addEventListener('mouseenter', handleGazeStart);
    elementRef.current.addEventListener('mouseleave', handleGazeEnd);
  }, [targetId, threshold, onGaze, onGazeStart, onGazeEnd]);

  const unregisterTarget = useCallback(() => {
    if ((window as any).eyeTracker) {
      (window as any).eyeTracker.unregisterGazeTarget(targetId);
    }
  }, [targetId]);

  useEffect(() => {
    registerTarget();
    return () => unregisterTarget();
  }, [registerTarget, unregisterTarget]);

  // Add visual feedback class
  useEffect(() => {
    if (elementRef.current) {
      if (isGazing) {
        elementRef.current.classList.add('eye-gazing');
      } else {
        elementRef.current.classList.remove('eye-gazing');
      }
    }
  }, [isGazing]);

  return {
    elementRef,
    isGazing,
    registerTarget,
    unregisterTarget
  };
}

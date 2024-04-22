import { DependencyList, EffectCallback, RefObject, useEffect, useState } from 'react';

import { EEnvironmentMode } from '@/enums/other';
import env from '@/env';

type TScroll = {
  x: number;
  y: number;
  direction: string;
};

export const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return (): void => {
      clearTimeout(handleDebounce);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useScroll = (): TScroll => {
  const [scroll, setScroll] = useState<TScroll>({
    x: document.body.getBoundingClientRect().left,
    y: document.body.getBoundingClientRect().top,
    direction: ''
  });

  const listener = (): void => {
    setScroll((prev: TScroll) => ({
      x: document.body.getBoundingClientRect().left,
      y: -document.body.getBoundingClientRect().top,
      direction: prev.y > -document.body.getBoundingClientRect().top ? 'up' : 'down'
    }));
  };

  useEffect(() => {
    window.addEventListener('scroll', listener);
    return (): void => window.removeEventListener('scroll', listener);
  }, []);

  return scroll;
};

export const useOnClickOutside = (ref: RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void): void => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent): void => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return (): void => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

const createStrictEffectHook = (): ((effect: EffectCallback, deps?: DependencyList | undefined) => void) => {
  const isProductionMode = env.mode === EEnvironmentMode.PRODUCTION;
  if (isProductionMode) return useEffect;

  return (effect: EffectCallback, deps?: DependencyList): void => {
    useEffect(() => {
      let isMounted = true;
      let unmount: void | (() => void);

      queueMicrotask(() => {
        if (isMounted) unmount = effect();
      });

      return () => {
        isMounted = false;
        unmount?.();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
  };
};

export const useStrictEffect = createStrictEffectHook();

export const useResize = (): { windowWidth: number; isMobileView: boolean } => {
  const [resize, setResize] = useState<{ windowWidth: number; isMobileView: boolean }>({
    windowWidth: window.innerWidth,
    isMobileView: window.innerWidth < 992
  });

  useEffect(() => {
    const updateSize = (): void => {
      const windowWidth = window.innerWidth;
      setResize({ windowWidth, isMobileView: windowWidth < 992 });
    };
    window.addEventListener('resize', updateSize);
    return (): void => window.removeEventListener('resize', updateSize);
  }, []);

  return resize;
};

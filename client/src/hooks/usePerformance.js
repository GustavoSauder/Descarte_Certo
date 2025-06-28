import { useEffect, useRef, useCallback, useState } from 'react';

// Hook para monitorar performance de componentes
export const usePerformance = (componentName) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const currentTime = performance.now();
    const renderTime = currentTime - lastRenderTime.current;
    
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${componentName}:`, {
        renderCount: renderCount.current,
        renderTime: `${renderTime.toFixed(2)}ms`,
      });
    }

    lastRenderTime.current = currentTime;
  });

  return {
    renderCount: renderCount.current,
    getRenderTime: () => performance.now() - lastRenderTime.current,
  };
};

// Hook para debounce
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para throttle
export const useThrottle = (callback, delay) => {
  const lastCall = useRef(0);
  const lastCallTimer = useRef(null);

  return useCallback((...args) => {
    const now = Date.now();

    if (now - lastCall.current >= delay) {
      callback(...args);
      lastCall.current = now;
    } else {
      if (lastCallTimer.current) {
        clearTimeout(lastCallTimer.current);
      }
      lastCallTimer.current = setTimeout(() => {
        callback(...args);
        lastCall.current = Date.now();
      }, delay - (now - lastCall.current));
    }
  }, [callback, delay]);
};

// Hook para memoização de cálculos pesados
export const useMemoizedValue = (computeValue, dependencies) => {
  const memoizedValue = useRef();
  const memoizedDeps = useRef();

  if (!memoizedDeps.current || !shallowEqual(memoizedDeps.current, dependencies)) {
    memoizedValue.current = computeValue();
    memoizedDeps.current = dependencies;
  }

  return memoizedValue.current;
};

// Função para comparar arrays/objetos superficialmente
const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  if (typeof a !== typeof b) return false;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }
  
  if (typeof a === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => a[key] === b[key]);
  }
  
  return false;
};

// Hook para lazy loading de imagens
export const useLazyImage = (src, placeholder = null) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setLoading(false);
      setError(false);
    };
    
    img.onerror = () => {
      setError(true);
      setLoading(false);
    };
  }, [src]);

  return { src: imageSrc, loading, error };
};

// Hook para intersection observer (lazy loading)
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      observer.unobserve(ref);
    };
  }, [ref, options]);

  return [setRef, isIntersecting];
};

// Hook para virtualização de listas
export const useVirtualization = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStartIndex = Math.floor(scrollTop / itemHeight);
  const visibleEndIndex = Math.min(
    visibleStartIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStartIndex, visibleEndIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStartIndex * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    visibleStartIndex,
    visibleEndIndex,
  };
};

// Hook para cache de dados com TTL
export const useDataCache = (key, fetcher, ttl = 5 * 60 * 1000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef(new Map());

  const getCachedData = useCallback(() => {
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    return null;
  }, [key, ttl]);

  const setCachedData = useCallback((newData) => {
    cacheRef.current.set(key, {
      data: newData,
      timestamp: Date.now(),
    });
    setData(newData);
  }, [key]);

  const fetchData = useCallback(async (force = false) => {
    if (!force) {
      const cached = getCachedData();
      if (cached) {
        setData(cached);
        return;
      }
    }

    setLoading(true);
    try {
      const result = await fetcher();
      setCachedData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetcher, getCachedData, setCachedData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refetch: () => fetchData(true) };
}; 
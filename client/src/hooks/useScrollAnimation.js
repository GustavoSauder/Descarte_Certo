import { useEffect, useRef } from 'react';

export const useScrollAnimation = (options = {}) => {
  const elementRef = useRef(null);
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    animationClass = 'animate-fade-in',
    delay = 0
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Adicionar delay se especificado
    if (delay > 0) {
      element.style.transitionDelay = `${delay}s`;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Adicionar classe de animação
            entry.target.classList.add(animationClass);
            
            // Opcional: parar de observar após a animação
            if (options.once !== false) {
              observer.unobserve(entry.target);
            }
          } else if (!options.once) {
            // Remover classe se não for "once"
            entry.target.classList.remove(animationClass);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, animationClass, delay, options.once]);

  return elementRef;
};

// Hook para animações em lista com stagger
export const useStaggerAnimation = (items, options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    staggerDelay = 0.1,
    animationClass = 'animate-fade-in'
  } = options;

  useEffect(() => {
    const elements = document.querySelectorAll('[data-stagger-animation]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.staggerIndex || '0');
            const delay = index * staggerDelay;
            
            entry.target.style.transitionDelay = `${delay}s`;
            entry.target.classList.add(animationClass);
            
            if (options.once !== false) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [items, threshold, rootMargin, staggerDelay, animationClass, options.once]);
};

// Hook para animações de parallax
export const useParallaxAnimation = (speed = 0.5) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      element.style.transform = `translateY(${rate}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return elementRef;
}; 
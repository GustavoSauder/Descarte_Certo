import React, { useEffect, useRef } from 'react';

const ScrollAnimation = ({ 
  children, 
  className = '', 
  animationType = 'slide-up',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  once = true
}) => {
  const elementRef = useRef(null);

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
            entry.target.classList.add('animate-fade-in');
            
            // Opcional: parar de observar após a animação
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            // Remover classe se não for "once"
            entry.target.classList.remove('animate-fade-in');
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
  }, [threshold, rootMargin, delay, once]);

  return (
    <div
      ref={elementRef}
      className={`scroll-animation ${animationType} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation; 
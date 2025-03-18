
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade-in' | 'slide-up' | 'slide-down';
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className,
  delay = 0,
  animation = 'fade-in',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all duration-300',
        {
          'opacity-0 translate-y-4': !isVisible && animation === 'slide-up',
          'opacity-0 translate-y-0': !isVisible && animation === 'fade-in',
          'opacity-0 -translate-y-4': !isVisible && animation === 'slide-down',
          'opacity-100 translate-y-0': isVisible,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;

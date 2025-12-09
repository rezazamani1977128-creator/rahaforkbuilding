import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Fade in animation
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 300, className }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

// Stagger children animation
interface StaggerProps {
  children: ReactNode[];
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

export function Stagger({
  children,
  delay = 0,
  staggerDelay = 100,
  className,
}: StaggerProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn key={index} delay={delay + index * staggerDelay}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
}

// Slide in animation
interface SlideInProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}

export function SlideIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 300,
  className,
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const directions = {
    left: 'translate-x-8',
    right: '-translate-x-8',
    up: 'translate-y-8',
    down: '-translate-y-8',
  };

  return (
    <div
      className={cn(
        'transition-all',
        isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${directions[direction]}`,
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

// Scale in animation
export function ScaleIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all duration-300',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        className
      )}
    >
      {children}
    </div>
  );
}

// Number counter animation
interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatter?: (value: number) => string;
}

export function CountUp({
  end,
  start = 0,
  duration = 1000,
  prefix = '',
  suffix = '',
  className,
  formatter,
}: CountUpProps) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    const startTime = Date.now();
    const diff = end - start;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + diff * easeOut);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, start, duration]);

  const displayValue = formatter ? formatter(count) : count.toLocaleString('fa-IR');

  return (
    <span className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

// Pulse animation (for loading or attention)
export function Pulse({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('animate-pulse', className)}>{children}</div>;
}

// Bounce animation
export function Bounce({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('animate-bounce', className)}>{children}</div>;
}

// Spin animation
export function Spin({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('animate-spin', className)}>{children}</div>;
}

// Shimmer effect for loading
export function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer',
        className
      )}
    />
  );
}

// Success checkmark animation
export function SuccessCheck({ className }: { className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <svg
        className="w-full h-full text-green-500"
        viewBox="0 0 52 52"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="stroke-current fill-none"
          cx="26"
          cy="26"
          r="24"
          strokeWidth="3"
          style={{
            strokeDasharray: 166,
            strokeDashoffset: 0,
            animation: 'circle 0.6s ease-in-out forwards',
          }}
        />
        <path
          className="stroke-current fill-none"
          d="M14 27l8 8 16-16"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 48,
            strokeDashoffset: 0,
            animation: 'check 0.3s 0.6s ease-in-out forwards',
          }}
        />
      </svg>
    </div>
  );
}

// Confetti animation
export function Confetti() {
  const confetti = Array.from({ length: 30 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-primary rounded-full animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            animationDelay: `${Math.random() * 0.5}s`,
            opacity: Math.random(),
          }}
        />
      ))}
    </div>
  );
}

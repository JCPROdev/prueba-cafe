"use client";

import { useRef, type ReactNode } from "react";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

interface HeroIntroProps {
  children: ReactNode;
  className?: string;
}

/** Entrada escalonada del hero para los hijos marcados con `data-hero-item` (sin ScrollTrigger). */
export function HeroIntro({ children, className }: HeroIntroProps) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapReveal(ref, {
    selector: "[data-hero-item]",
    y: 28,
    stagger: 0.15,
    duration: 0.9,
    scrollTrigger: false,
  });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

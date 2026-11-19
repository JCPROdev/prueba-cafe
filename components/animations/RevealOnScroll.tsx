"use client";

import { useRef, type ReactNode } from "react";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  y?: number;
}

/** Revela su contenido (fade + translateY) al entrar en el viewport. */
export function RevealOnScroll({ children, className, y }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapReveal(ref, { y });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

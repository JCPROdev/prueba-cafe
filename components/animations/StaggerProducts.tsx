"use client";

import { useRef, type ReactNode } from "react";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

interface StaggerProductsProps {
  children: ReactNode;
  className?: string;
}

/** Anima en cascada los hijos marcados con `data-stagger-item` al entrar en el viewport. */
export function StaggerProducts({ children, className }: StaggerProductsProps) {
  const ref = useRef<HTMLDivElement>(null);
  useGsapReveal(ref, { selector: "[data-stagger-item]", y: 32, stagger: 0.08 });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

export interface GsapRevealOptions {
  /** Selector de los elementos a animar dentro del scope. Si se omite, anima el propio scope. */
  selector?: string;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
  /** Retardo entre elementos (segundos). */
  stagger?: number;
  duration?: number;
  /** Si es true, la animación se dispara al entrar en el viewport. */
  scrollTrigger?: boolean;
}

/**
 * Revela elementos con fade + translateY (solo propiedades GPU).
 * Respeta `prefers-reduced-motion`: si el usuario lo pide, no se anima nada.
 */
export function useGsapReveal(
  scopeRef: RefObject<HTMLElement | null>,
  {
    selector,
    y = 24,
    stagger = 0.12,
    duration = 0.8,
    scrollTrigger = true,
  }: GsapRevealOptions = {},
): void {
  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      if (scrollTrigger) gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = selector ? gsap.utils.toArray<HTMLElement>(selector, scope) : [scope];
        if (targets.length === 0) return;

        gsap.from(targets, {
          opacity: 0,
          y,
          duration,
          stagger,
          ease: "power2.out",
          clearProps: "opacity,transform",
          ...(scrollTrigger
            ? { scrollTrigger: { trigger: scope, start: "top 85%", once: true } }
            : {}),
        });
      });

      return () => mm.revert();
    },
    { scope: scopeRef, dependencies: [selector, y, stagger, duration, scrollTrigger] },
  );
}

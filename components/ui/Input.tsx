import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      <input
        className={cn(
          "rounded-md border border-neutral-300 px-3 py-2 font-normal outline-none focus:border-neutral-900",
          className,
        )}
        {...props}
      />
    </label>
  );
}

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md";
}

const variants = {
  primary: "border-primary/30 bg-transparent text-primary hover:bg-accent",
  secondary: "border-border bg-transparent text-ink-muted hover:bg-muted hover:text-ink",
  outline: "border-border bg-transparent text-ink-muted hover:bg-muted hover:text-ink",
  ghost: "border-transparent bg-transparent text-ink-muted hover:bg-muted hover:text-ink",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

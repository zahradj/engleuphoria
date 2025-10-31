import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "light" | "strong";
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl";
  children: React.ReactNode;
}

export function GlassCard({ 
  variant = "default", 
  rounded = "2xl",
  className, 
  children,
  ...props 
}: GlassCardProps) {
  const variantClasses = {
    default: "glass",
    light: "glass-light",
    strong: "glass-strong"
  };

  const roundedClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl"
  };

  return (
    <div 
      className={cn(
        variantClasses[variant],
        roundedClasses[rounded],
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

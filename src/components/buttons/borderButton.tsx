"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface BorderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isFull?: boolean;
  borderColor?: "primary" | "secondary" | string;
  textColor?: string;
  isDisabled?: boolean;
}

// 배경색에 따라 텍스트 색상을 결정하는 함수
const getContrastColor = (borderColor: string): string => {
  // primary와 secondary는 기본값 사용
  if (["primary", "secondary"].includes(borderColor)) {
    return `text-${borderColor}`;
  }

  // 테일윈드 색상 클래스인 경우
  if (!borderColor.startsWith('#')) {
    return borderColor.replace('bg-', 'text-');
  }

  return `text-[${borderColor}]`;
};

const BorderButton = forwardRef<HTMLButtonElement, BorderButtonProps>(
  ({ className, children, isFull, borderColor = "primary", textColor, isDisabled, ...props }, ref) => {
    const customColorStyle = !["primary", "secondary"].includes(borderColor) 
      ? {
          ...(borderColor.startsWith('#') 
            ? { 
                borderColor: borderColor,
                color: textColor 
                  ? textColor.startsWith('#') 
                    ? textColor 
                    : undefined
                  : borderColor,
                ...(isDisabled && {
                  borderColor: `${borderColor}80`, // 50% opacity for disabled state
                  color: `${borderColor}80`,
                  cursor: 'not-allowed'
                })
              }
            : {}),
          [`&:hover`]: {
            backgroundColor: !isDisabled
              ? borderColor.startsWith('#') 
                ? `${borderColor}1a` 
                : undefined
              : undefined
          }
        }
      : {};

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "relative h-12 px-6 rounded-lg font-medium transition-colors",
          "border-2",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          {
            // Variants with predefined colors
            "border-primary text-primary hover:bg-primary/10 disabled:border-primary/50 disabled:text-primary/50": 
              borderColor === "primary",
            "border-secondary text-secondary hover:bg-secondary/10 disabled:border-secondary/50 disabled:text-secondary/50":
              borderColor === "secondary",
            // 테일윈드 색상 클래스인 경우
            [borderColor.replace('bg-', 'border-')]: !borderColor.startsWith('#') && !["primary", "secondary"].includes(borderColor),
            [textColor || getContrastColor(borderColor)]: 
              !borderColor.startsWith('#') && !["primary", "secondary"].includes(borderColor),
            [`hover:bg-${borderColor.replace('bg-', '')}/10`]: !isDisabled && !borderColor.startsWith('#') && !["primary", "secondary"].includes(borderColor),
            [`opacity-50`]: isDisabled && !borderColor.startsWith('#'),
            // Width
            "w-full": isFull,
            "w-fit": !isFull,
          },
          className
        )}
        style={customColorStyle}
        {...props}
      >
        {children}
      </button>
    );
  }
);

BorderButton.displayName = "BorderButton";

export { BorderButton, type BorderButtonProps };

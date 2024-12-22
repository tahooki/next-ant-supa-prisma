"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isFull?: boolean;
  backgroundColor?: "primary" | "secondary" | string;
  textColor?: string;
  isDisabled?: boolean;
}

// 색상의 명도를 계산하는 함수
const getLuminance = (color: string): number => {
  // hex to rgb
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // relative luminance calculation
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance;
};

// 배경색에 따라 텍스트 색상을 결정하는 함수
const getContrastColor = (backgroundColor: string): string => {
  // primary와 secondary는 기본값 사용
  if (["primary", "secondary"].includes(backgroundColor)) {
    return "text-white";
  }

  // 테일윈드 색상 클래스인 경우 (예: red-500, blue-700 등)
  if (!backgroundColor.startsWith('#')) {
    return "text-white";
  }

  try {
    const luminance = getLuminance(backgroundColor);
    return luminance > 0.5 ? "text-black" : "text-white";
  } catch {
    return "text-black";
  }
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isFull, backgroundColor = "primary", textColor, isDisabled, ...props }, ref) => {
    const customColorStyle = !["primary", "secondary"].includes(backgroundColor) 
      ? {
          ...(backgroundColor.startsWith('#') 
            ? { 
                backgroundColor: backgroundColor,
                color: textColor 
                  ? textColor.startsWith('#') 
                    ? textColor 
                    : undefined
                  : getContrastColor(backgroundColor).replace('text-', ''),
                ...(isDisabled && {
                  backgroundColor: `${backgroundColor}80`, // 50% opacity for disabled state
                  cursor: 'not-allowed'
                })
              }
            : {}),
          [`&:hover`]: {
            backgroundColor: !isDisabled 
              ? backgroundColor.startsWith('#') 
                ? `${backgroundColor}e6` 
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
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          {
            // Variants with predefined colors
            "bg-primary text-white hover:bg-primary/90 disabled:bg-primary/50": 
              backgroundColor === "primary",
            "bg-secondary text-white hover:bg-secondary/90 disabled:bg-secondary/50":
              backgroundColor === "secondary",
            // 테일윈드 색상 클래스인 경우
            [backgroundColor]: !backgroundColor.startsWith('#') && !["primary", "secondary"].includes(backgroundColor),
            [textColor || getContrastColor(backgroundColor)]: 
              !backgroundColor.startsWith('#') && !["primary", "secondary"].includes(backgroundColor),
            [`hover:${backgroundColor}/90`]: !isDisabled && !backgroundColor.startsWith('#') && !["primary", "secondary"].includes(backgroundColor),
            [`opacity-50`]: isDisabled && !backgroundColor.startsWith('#'),
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

Button.displayName = "Button";

export { Button, type ButtonProps };

"use client";

import { CATEGORIES } from "@/lib/constants";
import type { StartupCategory } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  value: StartupCategory;
  onChange: (value: StartupCategory) => void;
  className?: string;
  disabled?: boolean;
}

export function CategorySelector({
  value,
  onChange,
  className,
  disabled,
}: CategorySelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as StartupCategory)}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "h-11 bg-muted border-border text-foreground text-sm font-sans",
          "focus:ring-1 focus:ring-ring",
          className
        )}
        aria-label="Select startup category"
      >
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border">
        {CATEGORIES.map((cat) => (
          <SelectItem
            key={cat.value}
            value={cat.value}
            className="text-sm font-sans text-foreground focus:bg-accent"
          >
            {cat.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

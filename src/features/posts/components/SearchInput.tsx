"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative max-w-md">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"
      />
      <input
        type="text"
        placeholder="제목, 설명, 태그로 검색..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-4 text-[13px] text-foreground placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/10 focus:outline-none transition-all"
      />
    </div>
  );
}

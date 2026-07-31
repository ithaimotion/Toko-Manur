"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
}

export function SearchBar({ placeholder = "Cari produk...", onSearch, defaultValue = "" }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative" role="search">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="search"
          id="search-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="input-base pl-11 pr-12"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-14 p-1 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 bg-primary hover:bg-primary-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          Cari
        </button>
      </div>
    </form>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { Icon as LucideIcon } from "lucide-react";
import {
  Shield,
  Heart,
  Zap,
  Star,
  Fire,
  Award,
  Activity,
  Globe,
  Gift,
  Truck,
  Users,
  Box,
  Tag,
  Sun,
  Check,
  Lock,
  BookOpen,
  Smile,
} from "lucide-react";

type IconOption = { value: string; label: string; Icon: LucideIcon; category: string };

const ALL_ICONS: IconOption[] = [
  { value: "shield", label: "Shield", Icon: Shield, category: "Security" },
  { value: "heart", label: "Heart", Icon: Heart, category: "General" },
  { value: "zap", label: "Zap", Icon: Zap, category: "General" },
  { value: "star", label: "Star", Icon: Star, category: "General" },
  { value: "fire", label: "Fire", Icon: Fire, category: "Energy" },
  { value: "award", label: "Award", Icon: Award, category: "Awards" },
  { value: "activity", label: "Activity", Icon: Activity, category: "General" },
  { value: "globe", label: "Globe", Icon: Globe, category: "General" },
  { value: "gift", label: "Gift", Icon: Gift, category: "Products" },
  { value: "truck", label: "Truck", Icon: Truck, category: "Logistics" },
  { value: "users", label: "Users", Icon: Users, category: "People" },
  { value: "box", label: "Box", Icon: Box, category: "Products" },
  { value: "tag", label: "Tag", Icon: Tag, category: "Products" },
  { value: "sun", label: "Sun", Icon: Sun, category: "Nature" },
  { value: "check", label: "Check", Icon: Check, category: "Status" },
  { value: "lock", label: "Lock", Icon: Lock, category: "Security" },
  { value: "book", label: "Book", Icon: BookOpen, category: "General" },
  { value: "smile", label: "Smile", Icon: Smile, category: "People" },
];

export default function IconPicker({
  initial = "",
  onSelect,
  onClose,
}: {
  initial?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(ALL_ICONS.map((i) => i.category)))], []);

  const filtered = useMemo(() => {
    return ALL_ICONS.filter((i) => {
      if (category !== "All" && i.category !== category) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return i.label.toLowerCase().includes(q) || i.value.toLowerCase().includes(q) || i.category.toLowerCase().includes(q);
    });
  }, [query, category]);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-background border border-border rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Search className="w-4 h-4" /></div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari icon..."
              className="w-full pl-10 admin-input"
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input w-44 text-sm">
            {categories.map((c) => (
              <option key={c} value={c}> {c} </option>
            ))}
          </select>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-6 gap-2 max-h-80 overflow-auto">
          {filtered.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-muted"
              title={`${opt.label} — ${opt.category}`}
            >
              <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center">
                <opt.Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-[11px] text-muted-foreground truncate w-full text-center">{opt.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

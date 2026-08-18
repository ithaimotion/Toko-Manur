import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: "blue" | "green" | "amber" | "purple" | "rose";
  href?: string;
}

const colorClasses = {
  blue: { bg: "bg-blue-100", text: "text-blue-600", light: "bg-blue-50" },
  green: { bg: "bg-emerald-100", text: "text-emerald-600", light: "bg-emerald-50" },
  amber: { bg: "bg-amber-100", text: "text-amber-600", light: "bg-amber-50" },
  purple: { bg: "bg-purple-100", text: "text-purple-600", light: "bg-purple-50" },
  rose: { bg: "bg-rose-100", text: "text-rose-600", light: "bg-rose-50" },
};

export function StatsCard({ label, value, change, changeLabel, icon: Icon, color = "blue", href }: StatsCardProps) {
  const c = colorClasses[color];
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  const content = (
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${c.text}`} />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              isPositive ? "bg-emerald-50 text-emerald-600" : isNegative ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-500"
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : isNegative ? <TrendingDown className="w-3 h-3" /> : null}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {changeLabel && (
        <p className="text-xs text-muted-foreground mt-1">{changeLabel}</p>
      )}
    </CardContent>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        <Card className={`admin-card transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:border-${color === 'blue' ? 'blue' : color === 'green' ? 'emerald' : color === 'amber' ? 'amber' : color === 'purple' ? 'purple' : 'rose'}-200`}>
          {content}
        </Card>
      </Link>
    );
  }

  return <Card className="admin-card">{content}</Card>;
}

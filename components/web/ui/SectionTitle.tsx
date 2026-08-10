interface SectionTitleProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionTitle({
  badge,
  title,
  highlight,
  description,
  align = "center",
  className = "",
}: SectionTitleProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  return (
    <div className={`mb-12 ${alignClass} ${className}`}>
      {badge && (
        <div
          className={`badge-primary inline-flex mb-4 ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {badge}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-balance">
        {title}{" "}
        {highlight && <span className="gradient-text">{highlight}</span>}
      </h2>
      {description && (
        <p
          className={`text-slate-500 leading-relaxed ${
            align === "center" ? "max-w-xl mx-auto" : "max-w-xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

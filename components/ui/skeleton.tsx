import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  variant?: "default" | "card" | "image" | "text";
  lines?: number;
}

function Skeleton({
  className,
  variant = "default",
  lines,
  ...props
}: SkeletonProps) {
  // 텍스트 variant인 경우 여러 줄 표시
  if (variant === "text" && lines && lines > 1) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            data-slot="skeleton"
            className={cn(
              "bg-accent animate-pulse rounded-md h-4",
              index === lines - 1 ? "w-3/4" : "w-full",
              className
            )}
            {...props}
          />
        ))}
      </div>
    );
  }

  // 카드 variant
  if (variant === "card") {
    return (
      <div
        data-slot="skeleton"
        className={cn(
          "bg-accent animate-pulse rounded-lg border",
          "h-64 w-full",
          className
        )}
        {...props}
      >
        <div className="h-40 bg-accent/50 rounded-t-lg" />
        <div className="p-4 space-y-2">
          <div className="h-4 bg-accent/50 rounded w-3/4" />
          <div className="h-3 bg-accent/50 rounded w-1/2" />
        </div>
      </div>
    );
  }

  // 이미지 variant
  if (variant === "image") {
    return (
      <div
        data-slot="skeleton"
        className={cn(
          "bg-accent animate-pulse rounded-md aspect-video w-full",
          className
        )}
        {...props}
      />
    );
  }

  // 기본 variant
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton }

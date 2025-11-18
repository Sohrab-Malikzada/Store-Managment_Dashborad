import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        success:
          "hover:bg-[hsl(142,76%,36%)]/90 rounded-full border-transparent bg-[hsl(142,76%,36%)] text-[hsl(0,0%,98%)] [a&]:hover:bg-[hsl(142,76%,36%)]/90 focus-visible:ring-[hsl(142,76%,36%)]/20 dark:focus-visible:ring-[hsl(142,76%,36%)]/40 dark:bg-success/60",
        warning:
          "hover:bg-[hsl(38,92%,50%)]/90 rounded-full border-transparent bg-[hsl(38,92%,50%)] text-[hsl(0,0%,98%)] [a&]:hover:bg-[hsl(38,92%,50%)]/90 focus-visible:ring-[hsl(38,92%,50%)]/20 dark:focus-visible:ring-[hsl(38,92%,50%)]/40 dark:bg-warning/60",
        default:
          "border-transparent rounded-full px-3 my-2  bg-[hsl(214,84%,56%)] text-[hsl(0,0%,98%)] hover:bg-[hsl(214,84%,56%)]/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent rounded-full px-3 my-2 bg-[hsl(0,84%,60%)] text-white hover:bg-[hsl(0,84%,60%)]/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }

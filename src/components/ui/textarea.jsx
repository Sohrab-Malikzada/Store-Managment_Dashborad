import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
         "mb-1 focus-visible:border-ring  pl-3 shadow-[0_4px_6px_-1px_hsl(0,0%,80%,0.5)] focus:shadow-line focus:ring-2 focus:ring-offset-2 focus:visible:ring-0 transition-smooth  focus-visible:ring-ring/50 focus-visible:ring-2 transition-all duration-300 focus:shadow-line  focus:visible:ring-0 focus:ring-blue-500 transition-smooth border-[hsl(214,20%,88%)] h-20 placeholder:text-[hsl(216,20%,45%)] focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-[10px] border bg-transparent px-3 py-2 text-base  outline-none  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props} />
  );
}

export { Textarea }

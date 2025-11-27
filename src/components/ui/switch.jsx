"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-[hsl(214,84%,56%)] data-[state=unchecked]:bg-[hsl(212.31deg,20.63%,85.65%)] focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex w-[2.75rem] h-[1.6rem]  shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}>
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-[hsl(253.33deg,100%,98.24%)]  dark:data-[state=unchecked]:bg-[hsl(253.33deg,100%,98.24%)] dark:data-[state=checked]:bg-[hsl(253.33deg,100%,98.24%)] pointer-events-none block size-5 mt-[-1px] rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-0px)] data-[state=unchecked]:translate-x-0"
        )} />
    </SwitchPrimitive.Root>
  );
}

export { Switch }

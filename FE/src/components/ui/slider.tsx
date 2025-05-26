import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, disabled, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      disabled && "opacity-50 pointer-events-none", // Thêm class nếu slider bị disabled
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden [data-disabled]:bg-gray-400 bg-gray-100 rounded-none">
      <SliderPrimitive.Range className="absolute h-full bg-[#b8cd06] [data-disabled]:bg-gray-400" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block size-4 border-4 border-[#b8cd06] bg-background ring-offset-background transition-colors focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-ring [data-disabled]:bg-gray-200 [data-disabled]:border-gray-400" />

    <SliderPrimitive.Thumb className="block size-4 border-4 border-[#b8cd06] bg-background ring-offset-background transition-colors focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-ring [data-disabled]:bg-gray-200 [data-disabled]:border-gray-400" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

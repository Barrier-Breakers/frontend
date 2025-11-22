import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus:outline-none focus-visible:outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
				nevasca:
					"border-2 border-black bg-white text-black hover:brightness-95 hover:shadow-sm shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
				limanjar:
					"border-2 border-black bg-[#abfa00] text-black hover:brightness-95 shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
				mexerica:
					"border-2 border-black bg-[#e8752e] text-black hover:brightness-95 shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
				chicletim:
					"border-2 border-black bg-[#e594af] text-black hover:brightness-95 shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
				folheto:
					"border-2 border-black bg-[#478e4e] text-white hover:brightness-95 shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
				bananova:
					"border-2 border-black bg-[#f9df59] text-black hover:brightness-95 shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
				jabutina:
					"border-2 border-black bg-[#444b88] text-white hover:brightness-95 shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
				frambos:
					"border-2 border-black bg-[#da3263] text-white hover:brightness-95 shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
				abacatino:
					"border-2 border-black bg-[#b9d3c2] text-black hover:brightness-95 shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
				piscina:
					"border-2 border-black bg-[#0499a2] text-white hover:brightness-95 shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
			align: {
				center: "justify-center",
				left: "justify-start",
				right: "justify-end",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			align: "center",
		},
	}
);

function Button({
	className,
	variant,
	size,
	align,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, align, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };

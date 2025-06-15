import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Button = forwardRef(({ 
    className, 
    variant = "default", 
    size = "default", 
    children, 
    ...props 
}, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
        default: "bg-orange-600 text-white hover:bg-orange-700",
        outline: "border border-orange-600 text-orange-600 hover:bg-orange-50",
        ghost: "hover:bg-orange-50 text-orange-600",
        link: "text-orange-600 underline-offset-4 hover:underline",
    };
    
    const sizes = {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
    };
    
    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button }; 
import { forwardRef } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Calendar = forwardRef(({ className, classNames, showOutsideDays = true, ...props }, ref) => {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-6 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/30", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-6 sm:space-x-6 sm:space-y-0",
                month: "space-y-6",
                caption: "flex justify-center pt-1 items-center mb-4",
                caption_label: "text-xl font-bold text-white tracking-wide",
                nav: "flex items-center justify-center gap-6 mb-4",
                nav_button: cn(
                    "h-9 w-9 bg-slate-700/50 hover:bg-slate-600/50 p-2 rounded-xl opacity-70 hover:opacity-100 text-blue-400 hover:text-blue-300 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                ),
                nav_button_previous: "",
                nav_button_next: "",
                table: "w-full border-collapse",
                head_row: "flex mb-3",
                head_cell: "text-slate-400 rounded-lg w-12 h-10 font-medium text-sm flex items-center justify-center tracking-wider uppercase",
                row: "flex w-full mb-1",
                cell: cn(
                    "h-12 w-12 text-center text-sm p-0 relative m-0.5",
                    "[&:has([aria-selected].day-range-end)]:rounded-r-xl",
                    "[&:has([aria-selected].day-outside)]:bg-slate-700/30",
                    "[&:has([aria-selected])]:bg-slate-700/50",
                    "first:[&:has([aria-selected])]:rounded-l-xl",
                    "last:[&:has([aria-selected])]:rounded-r-xl",
                    "focus-within:relative focus-within:z-20"
                ),
                day: cn(
                    "h-12 w-12 p-0 font-medium text-slate-200 rounded-xl transition-all duration-200 hover:scale-105 hover:bg-[#A8E6CF]/10 hover:text-[#A8E6CF] aria-selected:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#A8E6CF]/50 relative"
                ),
                day_range_end: "day-range-end",
                day_selected: cn(
                    "bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/25",
                    "hover:bg-blue-700 focus:bg-blue-600",
                    "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200 before:rounded-xl"
                ),
                day_today: cn(
                    "bg-slate-700/80 text-white font-semibold border-2 border-blue-400/60 shadow-md shadow-blue-400/20",
                    "hover:bg-slate-600/80 hover:border-blue-400/80 hover:shadow-blue-400/30",
                    "after:absolute after:-bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1 after:h-1 after:bg-blue-400 after:rounded-full"
                ),
                day_outside: cn(
                    "day-outside text-slate-500/60 opacity-40",
                    "aria-selected:bg-slate-700/30 aria-selected:text-slate-400 aria-selected:opacity-50",
                    "hover:opacity-60 hover:text-slate-400 hover:bg-slate-700/20"
                ),
                day_disabled: "text-slate-600/40 opacity-30 cursor-not-allowed hover:scale-100 hover:bg-transparent hover:text-slate-600/40",
                day_range_middle: cn(
                    "aria-selected:bg-gradient-to-r aria-selected:from-blue-600/20 aria-selected:to-blue-600/20",
                    "aria-selected:text-white aria-selected:border-blue-600/20"
                ),
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                        {...props}
                    >
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                ),
                IconRight: ({ ...props }) => (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                        {...props}
                    >
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                ),
            }}
            ref={ref}
            {...props}
        />
    );
});

Calendar.displayName = "Calendar";

export { Calendar };
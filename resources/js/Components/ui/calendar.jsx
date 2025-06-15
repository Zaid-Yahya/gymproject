import { forwardRef } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Calendar = forwardRef(({ className, classNames, showOutsideDays = true, ...props }, ref) => {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium text-white",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-orange-500 hover:text-orange-400"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-700/50 [&:has([aria-selected])]:bg-gray-700 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    "h-9 w-9 p-0 font-normal text-gray-200 aria-selected:opacity-100"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 focus:bg-gradient-to-r focus:from-orange-500 focus:to-red-500",
                day_today: "bg-gray-700 text-white border border-orange-500",
                day_outside:
                    "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-700/50 aria-selected:text-gray-400 aria-selected:opacity-30",
                day_disabled: "text-gray-600 opacity-40",
                day_range_middle:
                    "aria-selected:bg-gray-700 aria-selected:text-white",
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
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
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
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                        {...props}
                    >
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                ),
            }}
            {...props}
        />
    );
});
Calendar.displayName = "Calendar";

export { Calendar }; 
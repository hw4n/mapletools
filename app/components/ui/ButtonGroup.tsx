import React from "react";

const joinClasses = (...classes: Array<string | undefined | false>) =>
    classes.filter(Boolean).join(" ");

function ButtonGroup({
    className,
    orientation = "horizontal",
    ...props
}: React.ComponentProps<"div"> & {
    orientation?: "horizontal" | "vertical";
}) {
    return (
        <div
            role="group"
            data-slot="button-group"
            data-orientation={orientation}
            className={joinClasses(
                "flex w-fit items-stretch [&>*]:focus-visible:relative [&>*]:focus-visible:z-10",
                orientation === "horizontal"
                    ? "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none"
                    : "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
                className
            )}
            {...props}
        />
    );
}

export { ButtonGroup };

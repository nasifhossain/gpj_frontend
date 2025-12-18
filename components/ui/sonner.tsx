"use client"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="system"
            className="toaster group"
            richColors
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg data-[type=error]:bg-red-600 data-[type=error]:text-white data-[type=error]:border-red-600 data-[type=success]:bg-green-600 data-[type=success]:text-white data-[type=success]:border-green-600",
                    description: "group-[.toast]:text-gray-500",
                    actionButton:
                        "group-[.toast]:bg-gray-900 group-[.toast]:text-gray-50",
                    cancelButton:
                        "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }

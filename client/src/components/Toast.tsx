import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {

    // Automatically trigger close action after the duration timeout completes
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    // Dynamic Theme Styling Mapping
    const themeMap = {
        success: {
            bg: "bg-emerald-50 border-emerald-100",
            text: "text-emerald-800",
            iconColor: "text-emerald-500",
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        error: {
            bg: "bg-rose-50 border-rose-100",
            text: "text-rose-800",
            iconColor: "text-rose-500",
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        info: {
            bg: "bg-blue-50 border-blue-100",
            text: "text-blue-800",
            iconColor: "text-blue-500",
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    };

    const currentTheme = themeMap[type];

    return (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 max-w-sm w-full p-4 rounded-xl border shadow-lg ${currentTheme.bg} animate-slide-in-right transition-all duration-300`}>
            <div className={currentTheme.iconColor}>
                {currentTheme.icon}
            </div>

            <div className={`flex-1 text-sm font-semibold ${currentTheme.text}`}>
                {message}
            </div>

            <button
                onClick={onClose}
                className={`p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer ${currentTheme.iconColor}`}
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

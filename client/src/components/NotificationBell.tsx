import { useState, useRef, useEffect } from "react";
import { useGetNotificationsQuery, useMarkAllReadMutation } from "../features/notification/notificationApi";

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const token = localStorage.getItem("token");

    // Dynamic data subscription with real-time append hooks handling everything automatically
    const { data: notifications = [] } = useGetNotificationsQuery(undefined, {
        skip: !token, // Skips the API request entirely if token is null or undefined
    });
    const [markAllRead] = useMarkAllReadMutation();

    const hasUnread = notifications.some((n: any) => n.isUnread);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* The Trigger Bell Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            >
                <span className="sr-only">View notifications</span>

                {/* Standard SVG Bell Icon */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>

                {/* The Red Indicator Dot: Absolutely positioned over the upper-right corner of the bell */}
                {hasUnread && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        {/* Optional subtle pulse animation effect to catch attention smoothly */}
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                    </span>
                )}
            </button>

            {/* The Notification Floating Dropdown Menu Container */}
            {isOpen && (
                <div className="fixed inset-x-4 mx-auto md:absolute md:inset-x-auto md:right-0 md:mx-0 mt-2 w-auto md:w-96 origin-top rounded-2xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 focus:outline-none z-50">                    {/* Header Controls */}
                    <div className="flex items-center justify-between border-b border-gray-50 px-4 py-3.5">
                        <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                        {hasUnread && (
                            <button
                                onClick={() => markAllRead()}
                                className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notification Scroll Feed */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-gray-400">
                                All caught up! No notifications yet.
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 transition-colors hover:bg-gray-50 flex items-start gap-2.5 ${notification.isUnread ? "bg-amber-50/20" : ""
                                        }`}
                                >
                                    {/* Unread specific side line indicator */}
                                    {notification.isUnread && (
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                                    )}

                                    <div className="space-y-1">
                                        <p className={`text-xs font-semibold text-gray-900 ${notification.isUnread ? "font-bold" : ""}`}>
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            {notification.message}
                                        </p>
                                        <p className="text-[10px] font-medium text-gray-400">
                                            {notification.time}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useRef, useEffect } from "react";
import { useGetNotificationsQuery, useMarkAllReadMutation } from "../features/notification/notificationApi";

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const token = localStorage.getItem("token");

    const { data: notifications = [] } = useGetNotificationsQuery(undefined, {
        skip: !token,
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
        <div className="relative inline-block" ref={dropdownRef}>
            {/* The Trigger Bell Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative rounded-xl p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none"
            >
                <span className="sr-only">View notifications</span>
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>

                {hasUnread && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                    </span>
                )}
            </button>

            {/* UPGRADED: Mobile Responsive Floating Panel Container */}
            {isOpen && (
                <div className="fixed inset-x-4 top-[64px] mx-auto md:absolute md:top-auto md:inset-x-auto md:right-0 mt-2 w-auto min-w-[280px] md:w-96 origin-top rounded-2xl border border-gray-100 bg-white shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* Header Controls */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 bg-gray-50/50 rounded-t-2xl">
                        <h3 className="text-xs font-bold text-gray-900 tracking-wider">Notifications</h3>
                        {hasUnread && (
                            <button
                                onClick={() => markAllRead()}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notification Scroll Feed */}
                    <div className="max-h-64 md:max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-10 text-center text-xs font-medium text-gray-400">
                                All caught up! No notifications yet.
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 transition-colors hover:bg-gray-50 flex items-start gap-3 ${notification.isUnread ? "bg-blue-50/20" : ""
                                        }`}
                                >
                                    {notification.isUnread && (
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                                    )}

                                    <div className="space-y-0.5 flex-1">
                                        <p className={`text-xs text-gray-900 ${notification.isUnread ? "font-bold" : "font-medium"}`}>
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-gray-500 leading-relaxed break-words">
                                            {notification.message}
                                        </p>
                                        <p className="text-[10px] font-medium text-gray-400 pt-0.5">
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

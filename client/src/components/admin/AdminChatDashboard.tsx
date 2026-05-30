import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useGetAdminActiveChatsQuery, useLazyGetChatHistoryQuery } from "../../features/chat/chatApi";
import Toast, { type ToastType } from "../../components/Toast";

interface ActiveRoom {
    roomId: string;
    studentName: string;
    studentEmail: string;
    lastMessage: string;
    lastMessageAt: string;
}

interface MessagePayload {
    id: string;
    room: string;
    sender: string;
    text: string;
    createdAt: string;
}

export default function AdminChatDashboard() {
    // Read current Admin identity securely
    const [admin] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const [activeRoom, setActiveRoom] = useState<ActiveRoom | null>(null);
    const [messageText, setMessageText] = useState("");
    const [liveMessages, setLiveMessages] = useState<MessagePayload[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
    };

    const socketRef = useRef<Socket | null>(null);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const adminScrollContainerRef = useRef<HTMLDivElement | null>(null);

    // Initialize the Lazy Trigger function
    const [triggerFetchHistory] = useLazyGetChatHistoryQuery();
    const { data: roomsData, isLoading: loadingRooms, refetch: refetchRooms } = useGetAdminActiveChatsQuery();
    const activeChats: ActiveRoom[] = roomsData || [];

    const socketURL = new URL(import.meta.env.VITE_BACKEND_URL).origin;

    // Trigger Initial History load whenever the admin switches rooms
    useEffect(() => {
        if (!activeRoom?.roomId) return;

        const loadInitialAdminHistory = async () => {
            setHasMore(true);
            const result = await triggerFetchHistory({ roomId: activeRoom.roomId }).unwrap();
            setLiveMessages(result);

            if (result.length < 20) setHasMore(false);

            setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: "auto" });
            }, 50);
        };

        loadInitialAdminHistory();
    }, [activeRoom?.roomId, triggerFetchHistory]);

    // REAL-TIME SOCKET LIFECYCLE CONNECTOR (Uses socketRef & refetchRooms)
    useEffect(() => {
        if (!activeRoom?.roomId) return;

        // Connect to your WebSocket server environment
        socketRef.current = io(socketURL);

        // Direct this admin socket connection into the student's room channel
        socketRef.current.emit("join_chat_room", { roomId: activeRoom.roomId });

        // Listen for message broadcasts matching this room
        socketRef.current.on("message_received", (incomingMessage: MessagePayload) => {
            setLiveMessages((prev) => {
                if (prev.some((m) => m.id === incomingMessage.id)) return prev;
                return [...prev, incomingMessage];
            });

            // Triggers refetch so the left panel's snippet list updates instantly
            refetchRooms();
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit("leave_chat_room", { roomId: activeRoom.roomId });
                socketRef.current.disconnect();
            }
        };
    }, [activeRoom?.roomId, refetchRooms]);

    // GLOBAL REAL-TIME NEW USER MONITOR
    useEffect(() => {
        // Open a secondary dedicated global connection or reuse the existing client connection
        const globalSocket = io(socketURL);

        // Tell backend this connection belongs to an admin
        globalSocket.emit("join_admin_global");

        // Listen for brand-new chat conversations started by fresh users
        globalSocket.on("new_room_created", (data) => {
            console.log("A brand new support ticket room was initialized live:", data);

            // Refetch the left sidebar rooms list instantly!
            refetchRooms();
        });

        return () => {
            globalSocket.disconnect();
        };
    }, [refetchRooms]);

    // Clean Baseline Focus Auto-scroller
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [liveMessages]);

    const handleAdminScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;

        // Fire when the admin scrolls to the absolute top of the conversation container
        if (container.scrollTop === 0 && hasMore && !isFetchingMore && liveMessages.length > 0) {
            setIsFetchingMore(true);

            const oldestMessageTimestamp = liveMessages[0].createdAt;
            const previousScrollHeight = container.scrollHeight;

            try {
                // Fetch previous history block using the oldest message as the cursor anchor
                const olderMessages = await triggerFetchHistory({
                    roomId: activeRoom!.roomId,
                    before: oldestMessageTimestamp
                }).unwrap();

                if (olderMessages.length < 20) {
                    setHasMore(false); // Hit the beginning of the room history thread
                }

                if (olderMessages.length > 0) {
                    setLiveMessages((prev) => [...olderMessages, ...prev]);

                    // Anti-Jump Scroll Adjuster keeps user viewing frame stable
                    setTimeout(() => {
                        if (adminScrollContainerRef.current) {
                            adminScrollContainerRef.current.scrollTop =
                                adminScrollContainerRef.current.scrollHeight - previousScrollHeight;
                        }
                    }, 10);
                }
            } catch (err) {
                showToast("Failed to load older chat threads for admin", "error");
            } finally {
                setIsFetchingMore(false);
            }
        }
    };

    // Fire outward reply text arrays
    const handleSendReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !socketRef.current || !activeRoom) return;

        socketRef.current.emit("send_message", {
            roomId: activeRoom.roomId,
            senderId: admin?._id, // Outgoing sender tag marked securely as Admin ID signature
            text: messageText.trim(),
        });

        setMessageText("");
    };

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[calc(100vh-180px)] flex">

                {/* LEFT SIDEBAR PANE: Student Chats Navigator List */}
                <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50/50 shrink-0">
                    <div className="p-4 border-b bg-white">
                        <h3 className="text-base font-bold text-gray-900">Support Communications</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Select an active learner room to begin.</p>
                    </div>

                    <div className="max-h-[60vh] flex-1 overflow-y-auto divide-y divide-gray-100">
                        {loadingRooms ? (
                            <div className="p-8 text-center text-xs text-gray-400 animate-pulse">Scanning channel clusters...</div>
                        ) : activeChats.length === 0 ? (
                            <div className="p-8 text-center text-xs text-gray-400 italic">No open support tickets found.</div>
                        ) : (
                            activeChats.map((chat) => {
                                const isSelected = activeRoom?.roomId === chat.roomId;
                                return (
                                    <button
                                        key={chat.roomId}
                                        onClick={() => {
                                            if (activeRoom?.roomId !== chat.roomId) {
                                                setLiveMessages([]);
                                                setActiveRoom(chat);
                                            }
                                        }}
                                        className={`w-full p-4 text-left flex flex-col gap-1 transition-all border-l-4 cursor-pointer ${isSelected
                                            ? "bg-indigo-50/70 border-indigo-600 shadow-xs"
                                            : "bg-transparent border-transparent hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <span className="text-sm font-bold text-gray-900 truncate max-w-[160px]">{chat.studentName}</span>
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(chat.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400 truncate w-full">{chat.studentEmail}</span>
                                        <p className="text-xs text-gray-600 truncate mt-1 bg-white/40 border border-gray-100 p-1.5 rounded-lg w-full">
                                            {chat.lastMessage}
                                        </p>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* RIGHT PANE: Selected Chat Room Console */}
                <div className="flex-1 flex flex-col bg-white">
                    {activeRoom ? (
                        <>
                            {/* Selected User Header Banner */}
                            <div className="p-4 border-b border-gray-200 bg-gray-50/30 flex items-center justify-between shadow-xs">
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">{activeRoom.studentName}</h4>
                                    <p className="text-xs text-gray-500">{activeRoom.studentEmail}</p>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                    Secure Support Line
                                </span>
                            </div>

                            {/* Message Stream Area */}
                            <div
                                ref={adminScrollContainerRef}
                                onScroll={handleAdminScroll}
                                className="min-h-[60vh] max-h-[60vh] flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/20"
                            >
                                {isFetchingMore ? (
                                    <div className="text-center text-xs text-gray-400 p-12">Downloading secure database audit blocks...</div>
                                ) : (
                                    liveMessages.map((msg) => {
                                        const isMe = msg.sender === admin?._id;
                                        return (
                                            <div
                                                key={msg.id || msg.createdAt}
                                                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                                            >
                                                <div className={`max-w-[65%] rounded-2xl px-4 py-2 text-sm shadow-xs ${isMe
                                                    ? "bg-slate-900 text-white rounded-br-none"
                                                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                                                    }`}>
                                                    <p className="leading-relaxed break-words">{msg.text}</p>
                                                    <span className={`block text-[10px] mt-1 text-right ${isMe ? "text-gray-400" : "text-gray-400"}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Message Send Form Footer */}
                            <form onSubmit={handleSendReply} className="p-4 border-t border-gray-200 flex gap-2 items-center bg-white">
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder={`Reply securely to ${activeRoom.studentName}...`}
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white transition text-gray-800"
                                />
                                <button
                                    type="submit"
                                    disabled={!messageText.trim()}
                                    className="bg-slate-900 text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-slate-800 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all cursor-pointer shadow-sm shrink-0"
                                >
                                    Send Reply
                                </button>
                            </form>
                        </>
                    ) : (
                        /* Blank Slate Dashboard Display */
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12 bg-gray-50/10">
                            <div className="text-4xl mb-2">💬</div>
                            <h4 className="font-bold text-gray-700">No Selected Active Thread</h4>
                            <p className="text-xs text-gray-500 mt-1 max-w-xs text-center">
                                Click any user card on the left panel grid layout to review conversation strings or type live text answers.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}

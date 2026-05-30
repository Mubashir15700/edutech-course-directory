import React, { useState, useEffect, useRef } from "react";
import { useGetChatHistoryQuery } from "../features/chat/chatApi";
import { io, Socket } from "socket.io-client";

interface MessagePayload {
    id: string;
    room: string;
    sender: string;
    text: string;
    createdAt: string;
}

interface LearnerChatWidgetProps {
    user: { _id: string; name: string }; // Currently logged-in learner
}

export const LearnerChatWidget: React.FC<LearnerChatWidgetProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [liveMessages, setLiveMessages] = useState<MessagePayload[]>([]);

    const socketRef = useRef<Socket | null>(null);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Fetch DB historical logs (Room ID matches Learner's own User ID)
    const { data: historyData, isLoading } = useGetChatHistoryQuery(user._id, {
        skip: !isOpen, // Trigger fetch only when chat widget expands
    });

    // Sync historical logs into local live-message state container
    useEffect(() => {
        if (historyData) {
            setLiveMessages(historyData);
        }
    }, [historyData]);

    // Establish Real-time WebSocket connection channels
    useEffect(() => {
        if (!isOpen) {
            if (socketRef.current) {
                socketRef.current.emit("leave_chat_room", { roomId: user._id });
                socketRef.current.disconnect();
            }
            return;
        }

        // Initialize connection
        socketRef.current = io(import.meta.env.REACT_APP_SOCKET_URL || "http://localhost:3000");

        // Request server to join private student channel thread
        socketRef.current.emit("join_chat_room", { roomId: user._id });

        // Listen for new message broadcasts coming down from admins
        socketRef.current.on("message_received", (incomingMessage: MessagePayload) => {
            setLiveMessages((prev) => {
                // Prevent duplicate entries if the sender is this user
                if (prev.some((m) => m.id === incomingMessage.id)) return prev;
                return [...prev, incomingMessage];
            });
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit("leave_chat_room", { roomId: user._id });
                socketRef.current.disconnect();
            }
        };
    }, [isOpen, user._id]);

    // Auto-scroll list index context to baseline viewports
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [liveMessages, isOpen]);

    // Handle form submission events
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !socketRef.current) return;

        // Dispatch raw data payload upward to backend sockets node cluster
        socketRef.current.emit("send_message", {
            roomId: user._id,
            senderId: user._id,
            text: messageText.trim(),
        });

        setMessageText("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                </button>
            )}

            {/* Chat Box Window */}
            {isOpen && (
                <div className="w-80 h-[450px] sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-slide-up">

                    {/* Header bar banner */}
                    <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <h4 className="font-bold text-sm tracking-wide">Support Desk Chat</h4>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-indigo-200 hover:text-white transition font-bold text-xs p-1"
                        >
                            ✕ Minimize
                        </button>
                    </div>

                    {/* Messages Body Area Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
                        {isLoading ? (
                            <div className="text-center text-xs text-slate-400 p-4">Syncing secure logs...</div>
                        ) : liveMessages.length === 0 ? (
                            <div className="text-center text-xs text-slate-400 p-8">
                                👋 Hello {user.name}! Send a message below to start chatting with admin.
                            </div>
                        ) : (
                            liveMessages.map((msg) => {
                                const isMe = msg.sender === user._id;
                                return (
                                    <div
                                        key={msg.id || msg.createdAt}
                                        className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-xs ${isMe
                                            ? "bg-indigo-600 text-white rounded-br-none"
                                            : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                                            }`}>
                                            <p className="leading-relaxed break-words">{msg.text}</p>
                                            <span className={`block text-[10px] mt-1 text-right ${isMe ? "text-indigo-200" : "text-slate-400"}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Action Form Controls Footer */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t bg-white flex gap-2 items-center">
                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type a support request message..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white transition text-slate-800"
                        />
                        <button
                            type="submit"
                            disabled={!messageText.trim()}
                            className="bg-indigo-600 text-white rounded-xl px-3 py-2 text-sm font-semibold hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all cursor-pointer"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

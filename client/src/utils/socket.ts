import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const SOCKET_URL = new URL(BACKEND_URL).origin;

export const socket = io(SOCKET_URL, {
    autoConnect: true,
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": SOCKET_URL,
        "Access-Control-Allow-Credentials": "true"
    }
});

export const connectSocket = (userId: string) => {
    if (!socket.connected) {
        socket.io.opts.query = { userId };
        socket.connect();
        console.log('⚡ Socket pipeline connected successfully');
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
        console.log('🔌 Socket pipeline disconnected clean');
    }
};

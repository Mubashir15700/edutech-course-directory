import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { } from "./features/auth/authApi";
import { connectSocket, disconnectSocket } from './utils/socket';
import AppRoutes from "./routes/AppRoutes";

function App() {

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        let user: any = null;
        try {
            user = userString ? JSON.parse(userString) : null;
        } catch (error) {
            console.error("Error parsing user data from localStorage", error);
        }

        if (token && user?._id) {
            connectSocket(user._id);
        }

        return () => disconnectSocket();
    }, []); // Empty dependency array means this checks once immediately when the app mounts

    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;

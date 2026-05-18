import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }: any) {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || user.role !== "admin") {
        return <Navigate to="/home" />;
    }

    return children;
}

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }: any) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) return <Navigate to="/login" />;

    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/home" />;
    }

    return children;
}

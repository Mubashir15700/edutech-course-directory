import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || user.role !== "learner") return <Navigate to="/login" />;

    return children;
}

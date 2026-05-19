import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }: any) {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (user) {
        return <Navigate to={user.role === "admin" ? "/admin" : "/courses"} />;
    }

    return children;
}

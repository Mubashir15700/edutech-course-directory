import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }: any) {
    const token = localStorage.getItem("token");

    return !token ? children : <Navigate to="/home" />;
}

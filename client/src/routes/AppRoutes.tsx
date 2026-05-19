import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";

import Dashboard from "../pages/admin/Dashboard";
import AddCourse from "../pages/admin/AddCourse";
import EditCourse from "../pages/admin/EditCourse";
import CoursesPage from "../pages/admin/CoursesPage";
import LearnersPage from "../pages/admin/LearnersPage";

import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../layouts/AdminLayout";
import LearnerLayout from "../layouts/LearnerLayout";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            {/* Learner */}
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <LearnerLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Home />} />
            </Route>

            {/* Admin */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="learners" element={<LearnersPage />} />
            </Route>
            <Route
                path="/admin/add"
                element={
                    <AdminRoute>
                        <AddCourse />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/edit/:id"
                element={
                    <AdminRoute>
                        <EditCourse />
                    </AdminRoute>
                }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

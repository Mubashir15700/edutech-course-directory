import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Courses from "../pages/Courses";
import CourseDetails from "../pages/CourseDetails/CourseDetails";
import MyLearning from "../pages/MyLearning/MyLearning";
import CoursePlayer from "../pages/CoursePlayer";
import PaymentSuccess from "../pages/PaymentSuccess";

import Dashboard from "../pages/admin/Dashboard";
import AddCourse from "../pages/admin/AddCourse";
import EditCourse from "../pages/admin/EditCourse";
import CoursesPage from "../pages/admin/CoursesPage";
import LearnersPage from "../pages/admin/LearnersPage";
import AdminProfile from "../pages/admin/Profile";

import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";

import AdminLayout from "../layouts/AdminLayout";
import LearnerLayout from "../layouts/LearnerLayout";
import AdminChatDashboard from "../components/admin/AdminChatDashboard";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/courses" element={<LearnerLayout />}>
                <Route index element={<Courses />} />
            </Route>
            <Route path="/courses/:id" element={<LearnerLayout />}>
                <Route index element={<CourseDetails />} />
            </Route>
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
            <Route path="/my-learning" element={
                <ProtectedRoute>
                    <MyLearning />
                </ProtectedRoute>
            } />
            <Route path="/courses/:id/lecture" element={
                <ProtectedRoute>
                    <CoursePlayer />
                </ProtectedRoute>
            } />
            <Route path="/payment-success" element={<PaymentSuccess />} />

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
                <Route path="profile" element={<AdminProfile />} />
                <Route path="chat" element={<AdminChatDashboard />} />
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

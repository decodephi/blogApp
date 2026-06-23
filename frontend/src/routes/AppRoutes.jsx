import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateBlog from "../pages/CreateBlog";
import BlogDetails from "../pages/BlogDetails";
import MyBlogs from "../pages/MyBlogs";
import EditBlog from "../pages/EditBlog";
import BecomeAuthor from "../pages/BecomeAuthor";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {

    return (

        <Routes>

            {/* Public Routes */}

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/blog/:slug"
                element={<BlogDetails />}
            />

            {/* Protected Routes */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/create-blog"
                element={
                    <ProtectedRoute>
                        <CreateBlog />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/my-blogs"
                element={
                    <ProtectedRoute>
                        <MyBlogs />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/edit-blog/:id"
                element={
                    <ProtectedRoute>
                        <EditBlog />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/become-author"
                element={
                    <ProtectedRoute>
                        <BecomeAuthor />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <RoleProtectedRoute
                        roles={[
                            "AUTHOR",
                            "ADMIN"
                        ]}
                    >
                        <Dashboard />
                    </RoleProtectedRoute>
                }
            />

        </Routes>

    );
}

export default AppRoutes;
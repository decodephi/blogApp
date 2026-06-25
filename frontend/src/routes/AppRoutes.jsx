import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, RoleProtectedRoute } from "../components/ProtectedRoute";

import Home         from "../pages/Home";
import Login        from "../pages/Login";
import Register     from "../pages/Register";
import BlogDetails  from "../pages/BlogDetails";
import Dashboard    from "../pages/Dashboard";
import CreateBlog   from "../pages/CreateBlog";
import EditBlog     from "../pages/EditBlog";
import MyBlogs      from "../pages/MyBlogs";
import BecomeAuthor from "../pages/BecomeAuthor";
import AdminPanel   from "../pages/AdminPanel";

export default function AppRoutes() {
    return (
        <Routes>
            {/* ── Public ──────────────────────────────────── */}
            <Route path="/"            element={<Home />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/blog/:slug"  element={<BlogDetails />} />

            {/* ── Authenticated ────────────────────────────── */}
            <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />

            <Route path="/become-author" element={
                <ProtectedRoute><BecomeAuthor /></ProtectedRoute>
            } />

            <Route path="/my-blogs" element={
                <ProtectedRoute><MyBlogs /></ProtectedRoute>
            } />

            <Route path="/edit-blog/:id" element={
                <ProtectedRoute><EditBlog /></ProtectedRoute>
            } />

            {/* ── Author & Admin only ──────────────────────── */}
            <Route path="/create-blog" element={
                <RoleProtectedRoute roles={["AUTHOR", "ADMIN"]}>
                    <CreateBlog />
                </RoleProtectedRoute>
            } />

            {/* ── Admin only ───────────────────────────────── */}
            <Route path="/admin" element={
                <RoleProtectedRoute roles={["ADMIN"]}>
                    <AdminPanel />
                </RoleProtectedRoute>
            } />

            {/* ── 404 ──────────────────────────────────────── */}
            <Route path="*" element={
                <div className="page-wrapper" style={{ textAlign: "center", padding: "120px 24px" }}>
                    <div style={{ fontSize: 80, marginBottom: 20 }}>🌌</div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 12 }}>404 — Page Not Found</h1>
                    <p style={{ color: "var(--text-secondary)", marginBottom: 28 }}>
                        The page you're looking for doesn't exist.
                    </p>
                    <a href="/" className="btn btn-primary">Go Home</a>
                </div>
            } />
        </Routes>
    );
}
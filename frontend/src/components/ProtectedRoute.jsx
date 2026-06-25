import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// General auth guard — redirects to /login if not authenticated
export function ProtectedRoute({ children }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

// Role-based guard — redirects to /dashboard if authenticated but wrong role
export function RoleProtectedRoute({ children, roles }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
    return children;
}

export default ProtectedRoute;
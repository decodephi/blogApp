import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const STAT_CONFIG = [
    { key: "totalBlogs",    icon: "📝", label: "Total Articles", color: "#7c3aed", bg: "rgba(124,58,237,0.12)" },
    { key: "publishedBlogs",icon: "🌐", label: "Published",       color: "#10b981", bg: "rgba(16,185,129,0.12)" },
    { key: "draftBlogs",    icon: "✏️", label: "Drafts",          color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    { key: "totalViews",    icon: "👁", label: "Total Views",     color: "#06b6d4", bg: "rgba(6,182,212,0.12)" },
    { key: "totalLikes",    icon: "♥", label: "Total Likes",     color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
    { key: "totalComments", icon: "💬", label: "Comments",        color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
];

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/dashboard/stats")
            .then(r => setStats(r.data.stats || r.data))
            .catch(() => setStats({}))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="page-wrapper"><LoadingSpinner message="Loading dashboard..." /></div>;

    return (
        <div className="page-wrapper">
            <div className="container" style={{ padding: "40px 24px 80px" }}>

                {/* Header */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: 40, flexWrap: "wrap", gap: 16
                }}>
                    <div>
                        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 6 }}>
                            Dashboard
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
                            Welcome back, <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{user?.name}</span> ·{" "}
                            <span className={`badge badge-${user?.role === "ADMIN" ? "danger" : user?.role === "AUTHOR" ? "success" : "muted"}`}>
                                {user?.role}
                            </span>
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        {(user?.role === "AUTHOR" || user?.role === "ADMIN") && (
                            <Link to="/create-blog" className="btn btn-primary">
                                ✦ Write Article
                            </Link>
                        )}
                        <Link to="/my-blogs" className="btn btn-secondary">My Articles</Link>
                    </div>
                </div>

                {/* Stats Grid */}
                {(user?.role === "AUTHOR" || user?.role === "ADMIN") ? (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: 20, marginBottom: 48
                    }}>
                        {STAT_CONFIG.map(({ key, icon, label, color, bg }) => (
                            <div key={key} className="stat-card">
                                <div className="stat-icon" style={{ background: bg, color }}>
                                    {icon}
                                </div>
                                <div className="stat-value" style={{ color }}>
                                    {stats?.[key] ?? 0}
                                </div>
                                <div className="stat-label">{label}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* READER dashboard */
                    <div style={{
                        background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))",
                        border: "1px solid rgba(124,58,237,0.2)",
                        borderRadius: 20, padding: "48px 40px",
                        textAlign: "center", marginBottom: 48
                    }}>
                        <div style={{ fontSize: 64, marginBottom: 20 }}>✍️</div>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 12 }}>
                            Become an Author
                        </h2>
                        <p style={{ color: "var(--text-secondary)", maxWidth: 440, margin: "0 auto 28px", fontSize: 15, lineHeight: 1.7 }}>
                            You're currently a reader. Apply to become an author and start sharing your knowledge with thousands of curious minds.
                        </p>
                        <Link to="/become-author" className="btn btn-primary btn-lg">
                            Apply Now →
                        </Link>
                    </div>
                )}

                {/* Quick Actions */}
                <div style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 20 }}>Quick Actions</h2>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: 16
                    }}>
                        {[
                            { icon: "🏠", label: "Browse Articles", desc: "Explore the latest posts", to: "/", color: "#7c3aed" },
                            user?.role === "READER" && { icon: "✍️", label: "Become Author", desc: "Apply for author access", to: "/become-author", color: "#06b6d4" },
                            (user?.role === "AUTHOR" || user?.role === "ADMIN") && { icon: "📝", label: "Write Article", desc: "Create a new blog post", to: "/create-blog", color: "#10b981" },
                            (user?.role === "AUTHOR" || user?.role === "ADMIN") && { icon: "📚", label: "My Articles", desc: "Manage your posts", to: "/my-blogs", color: "#f59e0b" },
                            user?.role === "ADMIN" && { icon: "⚙️", label: "Admin Panel", desc: "Manage author requests", to: "/admin", color: "#ef4444" },
                        ].filter(Boolean).map(item => (
                            <Link key={item.to} to={item.to} style={{
                                display: "block", padding: 20,
                                background: "var(--bg-surface)", border: "1px solid var(--border)",
                                borderRadius: 14, textDecoration: "none",
                                transition: "all 0.2s"
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = item.color + "66"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
                            >
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10,
                                    background: item.color + "22",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 20, marginBottom: 12
                                }}>{item.icon}</div>
                                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{item.label}</div>
                                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.desc}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
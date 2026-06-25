import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import LoadingSpinner from "../components/LoadingSpinner";

const STATUS_CONFIG = {
    PUBLISHED: { label: "Published", cls: "badge-success" },
    DRAFT:     { label: "Draft",     cls: "badge-warning" },
    ACHIVED:   { label: "Archived",  cls: "badge-muted"   },
};

function timeAgo(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function MyBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(null);
    const toast = useToast();

    const fetchBlogs = async () => {
        try {
            const res = await api.get("/blogs/my-blogs");
            setBlogs(res.data.blogs || res.data);
        } catch {
            toast.error("Failed to load your blogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const deleteBlog = async (id, title) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/blogs/${id}`);
            toast.success("Blog deleted");
            setBlogs(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete");
        }
    };

    const publishBlog = async (id) => {
        setPublishing(id);
        try {
            await api.patch(`/blogs/${id}/publish`);
            toast.success("Blog published! AI summary generated. ✨");
            await fetchBlogs();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to publish");
        } finally {
            setPublishing(null);
        }
    };

    if (loading) return <div className="page-wrapper"><LoadingSpinner message="Loading your articles..." /></div>;

    return (
        <div className="page-wrapper">
            <div className="container" style={{ padding: "40px 24px 80px" }}>

                {/* Header */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: 36, flexWrap: "wrap", gap: 16
                }}>
                    <div>
                        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 6 }}>My Articles</h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
                            {blogs.length} article{blogs.length !== 1 ? "s" : ""} total
                        </p>
                    </div>
                    <Link to="/create-blog" className="btn btn-primary">✦ Write New Article</Link>
                </div>

                {/* Blog List */}
                {blogs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📝</div>
                        <h2 style={{ color: "var(--text-primary)", fontFamily: "Inter, sans-serif", fontSize: "1.3rem" }}>
                            No articles yet
                        </h2>
                        <p style={{ fontSize: 14 }}>Write your first article and share your knowledge!</p>
                        <Link to="/create-blog" className="btn btn-primary">Write First Article</Link>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {blogs.map(blog => {
                            const sc = STATUS_CONFIG[blog.status] || STATUS_CONFIG.DRAFT;
                            return (
                                <div key={blog.id} style={{
                                    background: "var(--bg-surface)",
                                    border: "1px solid var(--border)",
                                    borderRadius: 14, padding: "20px 24px",
                                    display: "grid",
                                    gridTemplateColumns: "auto 1fr auto",
                                    gap: 20, alignItems: "center",
                                    transition: "border-color 0.2s"
                                }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                                >
                                    {/* Cover thumbnail */}
                                    <div style={{
                                        width: 80, height: 64, borderRadius: 10,
                                        overflow: "hidden", flexShrink: 0
                                    }}>
                                        <img
                                            src={blog.coverImage || `https://picsum.photos/seed/${blog.id}/160/128`}
                                            alt={blog.title}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                            <h3 style={{
                                                fontSize: 16, fontWeight: 700,
                                                color: "var(--text-primary)", fontFamily: "Inter, sans-serif"
                                            }}>{blog.title}</h3>
                                            <span className={`badge ${sc.cls}`}>{sc.label}</span>
                                            {blog.category && (
                                                <span className="badge badge-secondary" style={{ fontSize: 11 }}>
                                                    {blog.category}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 16,
                                            fontSize: 12, color: "var(--text-muted)"
                                        }}>
                                            <span>📅 {timeAgo(blog.createdAt)}</span>
                                            <span>👁 {blog.views || 0} views</span>
                                            <span>♥ {blog.likes || 0} likes</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                                        {blog.status === "PUBLISHED" && (
                                            <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer"
                                                className="btn btn-ghost btn-sm">
                                                View →
                                            </a>
                                        )}
                                        {blog.status === "DRAFT" && (
                                            <button
                                                onClick={() => publishBlog(blog.id)}
                                                disabled={publishing === blog.id}
                                                className="btn btn-success btn-sm"
                                            >
                                                {publishing === blog.id ? (
                                                    <span className="spinner spinner-sm" />
                                                ) : "🌐 Publish"}
                                            </button>
                                        )}
                                        <Link to={`/edit-blog/${blog.id}`} className="btn btn-secondary btn-sm">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => deleteBlog(blog.id, blog.title)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
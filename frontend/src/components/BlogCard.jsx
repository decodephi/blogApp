import { Link } from "react-router-dom";

const CATEGORY_COLORS = {
    Mathematics: "#3b82f6", Physics: "#ef4444", Chemistry: "#10b981",
    "Computer Science": "#f59e0b", "AI/ML": "#7c3aed", Biology: "#06b6d4",
    Default: "#8b949e"
};

function timeAgo(dateStr) {
    const now = Date.now();
    const d = new Date(dateStr).getTime();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function readingTime(content = "") {
    const words = content.trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export default function BlogCard({ blog }) {
    const catColor = CATEGORY_COLORS[blog.category] || CATEGORY_COLORS.Default;
    const preview = blog.summary || blog.content?.slice(0, 130);

    return (
        <Link to={`/blog/${blog.slug}`} style={{ textDecoration: "none", display: "block" }}>
            <article style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                overflow: "hidden",
                transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.2)";
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                }}
            >
                {/* Cover Image */}
                <div style={{ position: "relative", paddingTop: "56.25%", flexShrink: 0 }}>
                    <img
                        src={blog.coverImage || `https://picsum.photos/seed/${blog.id}/800/450`}
                        alt={blog.title}
                        style={{
                            position: "absolute", inset: 0, width: "100%", height: "100%",
                            objectFit: "cover"
                        }}
                        onError={e => {
                            e.target.src = `https://picsum.photos/seed/${blog.slug}/800/450`;
                        }}
                    />
                    {/* Gradient Overlay */}
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(13,17,23,0.8) 0%, transparent 60%)"
                    }} />
                    {/* Category Badge */}
                    {blog.category && (
                        <div style={{
                            position: "absolute", top: 12, left: 12,
                            padding: "3px 10px", borderRadius: 999,
                            background: `${catColor}22`,
                            border: `1px solid ${catColor}55`,
                            color: catColor,
                            fontSize: 11, fontWeight: 700,
                            letterSpacing: "0.05em"
                        }}>{blog.category}</div>
                    )}
                </div>

                {/* Content */}
                <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                    {/* Title */}
                    <h2 style={{
                        fontSize: 17, fontWeight: 700, lineHeight: 1.3,
                        color: "var(--text-primary)",
                        marginBottom: 10,
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden"
                    }}>{blog.title}</h2>

                    {/* Preview */}
                    <p style={{
                        fontSize: 14, lineHeight: 1.65, color: "var(--text-secondary)",
                        flex: 1, marginBottom: 16,
                        display: "-webkit-box", WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical", overflow: "hidden"
                    }}>{preview}</p>

                    {/* Footer */}
                    <div style={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                        borderTop: "1px solid var(--border)", paddingTop: 14
                    }}>
                        {/* Author */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: "50%",
                                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0
                            }}>
                                {blog.author?.name?.slice(0, 2).toUpperCase() || "A"}
                            </div>
                            <div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
                                    {blog.author?.name || "Anonymous"}
                                </div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                                    {timeAgo(blog.createdAt)}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                👁 {blog.views || 0}
                            </span>
                            <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                ♥ {blog.likes || 0}
                            </span>
                            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                                {readingTime(blog.content || blog.summary || "")}
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
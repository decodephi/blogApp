import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import LikeButton from "../components/LikeButton";
import BookmarkButton from "../components/BookmarkButton";
import CommentSection from "../components/CommentSection";

function timeAgo(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
function readingTime(content = "") {
    return `${Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))} min read`;
}

export default function BlogDetails() {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState("");
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryOpen, setSummaryOpen] = useState(false);
    const [relatedBlogs, setRelatedBlogs] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/blogs/slug/${slug}`);
                const b = res.data.blog || res.data;
                setBlog(b);
                // Increment view count
                if (b?.id) {
                    api.post(`/blogs/${b.id}/view`).catch(() => {});
                    // Fetch related
                    api.get(`/blogs/${b.id}/related`)
                        .then(r => setRelatedBlogs(r.data.blogs || []))
                        .catch(() => {});
                }
            } catch {
                setBlog(null);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    const fetchSummary = async () => {
        if (summary) { setSummaryOpen(o => !o); return; }
        setSummaryLoading(true);
        setSummaryOpen(true);
        try {
            const res = await api.get(`/blogs/${blog.id}/summary`);
            setSummary(res.data.summary || "No summary available.");
        } catch {
            setSummary("Failed to generate summary. Please try again.");
        } finally {
            setSummaryLoading(false);
        }
    };

    if (loading) return (
        <div className="page-wrapper">
            <LoadingSpinner size="lg" message="Loading article..." />
        </div>
    );

    if (!blog) return (
        <div className="page-wrapper">
            <div className="empty-state" style={{ marginTop: 80 }}>
                <div className="empty-state-icon">📭</div>
                <h2 style={{ color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}>Article not found</h2>
                <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
        </div>
    );

    // Sanitize HTML to prevent XSS
    const safeHtml = DOMPurify.sanitize(blog.content || "", {
        ALLOWED_TAGS: ["p","br","h1","h2","h3","h4","h5","h6","ul","ol","li",
                       "strong","em","a","code","pre","blockquote","img","hr","table",
                       "thead","tbody","tr","th","td","span","div"],
        ALLOWED_ATTR: ["href","src","alt","title","class","target","rel"]
    });

    return (
        <div className="page-wrapper">
            {/* ── Hero / Cover ───────────────────────────── */}
            {blog.coverImage && (
                <div style={{
                    position: "relative", width: "100%",
                    height: "clamp(280px, 45vh, 500px)", overflow: "hidden"
                }}>
                    <img src={blog.coverImage} alt={blog.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to bottom, rgba(13,17,23,0.3) 0%, rgba(13,17,23,0.9) 100%)"
                    }} />
                </div>
            )}

            {/* ── Main Layout ────────────────────────────── */}
            <div className="container" style={{ padding: "48px 24px 80px" }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 280px",
                    gap: 48, alignItems: "start"
                }}>
                    {/* Article */}
                    <article>
                        {/* Meta */}
                        <div style={{ marginBottom: 24 }}>
                            {blog.category && (
                                <span className="badge badge-primary" style={{ marginBottom: 14, display: "inline-block" }}>
                                    {blog.category}
                                </span>
                            )}
                            <h1 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                                fontWeight: 800, lineHeight: 1.15,
                                color: "var(--text-primary)", marginBottom: 20
                            }}>{blog.title}</h1>

                            {/* Author bar */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: 16,
                                padding: "16px 0", borderTop: "1px solid var(--border)",
                                borderBottom: "1px solid var(--border)", marginBottom: 8
                            }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0
                                }}>
                                    {blog.author?.name?.slice(0, 2).toUpperCase() || "A"}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)" }}>
                                        {blog.author?.name || "Anonymous"}
                                    </div>
                                    <div style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", gap: 16, marginTop: 2 }}>
                                        <span>{timeAgo(blog.createdAt)}</span>
                                        <span>·</span>
                                        <span>{readingTime(blog.content)}</span>
                                        <span>·</span>
                                        <span>👁 {blog.views || 0} views</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Summary Box */}
                        <div style={{
                            marginBottom: 32,
                            background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))",
                            border: "1px solid rgba(124,58,237,0.2)",
                            borderRadius: 12, overflow: "hidden"
                        }}>
                            <button onClick={fetchSummary} style={{
                                width: "100%", padding: "14px 20px",
                                background: "none", border: "none", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                color: "#a78bfa", fontFamily: "Inter, sans-serif",
                                fontSize: 14, fontWeight: 600
                            }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontSize: 18 }}>✨</span>
                                    AI-Powered Summary
                                </span>
                                <span style={{ fontSize: 12, opacity: 0.7 }}>
                                    {summaryOpen ? "▲ Hide" : "▼ Show"}
                                </span>
                            </button>

                            {summaryOpen && (
                                <div style={{
                                    padding: "0 20px 16px",
                                    borderTop: "1px solid rgba(124,58,237,0.15)"
                                }}>
                                    {summaryLoading ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", color: "var(--text-secondary)", fontSize: 14 }}>
                                            <span className="spinner spinner-sm" /> Generating summary...
                                        </div>
                                    ) : (
                                        <p style={{
                                            color: "var(--text-secondary)", fontSize: 14,
                                            lineHeight: 1.75, paddingTop: 14,
                                            whiteSpace: "pre-line"
                                        }}>{summary}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Blog Content — XSS protected */}
                        <div
                            className="blog-content"
                            dangerouslySetInnerHTML={{ __html: safeHtml }}
                        />

                        {/* Action Bar */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: 12,
                            padding: "24px 0", margin: "40px 0",
                            borderTop: "1px solid var(--border)",
                            borderBottom: "1px solid var(--border)"
                        }}>
                            <LikeButton blogId={blog.id} initialCount={blog.likes || 0} />
                            <BookmarkButton blogId={blog.id} />
                            <Link to="/" style={{
                                marginLeft: "auto", display: "flex", alignItems: "center", gap: 8,
                                color: "var(--text-secondary)", fontSize: 14, fontWeight: 500
                            }}>← Back to Home</Link>
                        </div>

                        {/* Comments */}
                        <CommentSection blogId={blog.id} />
                    </article>

                    {/* Sidebar */}
                    <aside style={{ position: "sticky", top: 90 }}>
                        {/* Author Card */}
                        <div style={{
                            background: "var(--bg-surface)", border: "1px solid var(--border)",
                            borderRadius: 16, padding: 20, marginBottom: 20, textAlign: "center"
                        }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: "50%",
                                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 24, fontWeight: 700, color: "#fff",
                                margin: "0 auto 12px"
                            }}>
                                {blog.author?.name?.slice(0, 2).toUpperCase() || "A"}
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 16 }}>{blog.author?.name}</div>
                            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>Author</div>
                        </div>

                        {/* Stats */}
                        <div style={{
                            background: "var(--bg-surface)", border: "1px solid var(--border)",
                            borderRadius: 16, padding: 20, marginBottom: 20
                        }}>
                            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "var(--text-secondary)" }}>
                                ARTICLE STATS
                            </h4>
                            {[
                                ["👁", "Views", blog.views || 0],
                                ["♥", "Likes", blog.likes || 0],
                                ["📖", "Read time", readingTime(blog.content)]
                            ].map(([icon, label, val]) => (
                                <div key={label} style={{
                                    display: "flex", justifyContent: "space-between",
                                    alignItems: "center", padding: "8px 0",
                                    borderBottom: "1px solid var(--border)"
                                }}>
                                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                                        {icon} {label}
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Related */}
                        {relatedBlogs.length > 0 && (
                            <div style={{
                                background: "var(--bg-surface)", border: "1px solid var(--border)",
                                borderRadius: 16, padding: 20
                            }}>
                                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "var(--text-secondary)" }}>
                                    RELATED ARTICLES
                                </h4>
                                {relatedBlogs.map(rb => (
                                    <Link key={rb.id} to={`/blog/${rb.slug}`} style={{
                                        display: "block", padding: "10px 0",
                                        borderBottom: "1px solid var(--border)",
                                        textDecoration: "none",
                                        fontSize: 13, fontWeight: 600,
                                        color: "var(--text-primary)", lineHeight: 1.4
                                    }}>
                                        {rb.title}
                                        <span style={{ display: "block", fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
                                            👁 {rb.views} views
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}
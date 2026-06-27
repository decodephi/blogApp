import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import BlogCard from "../components/BlogCard";
import SkeletonCard from "../components/SkeletonCard";

const CATEGORIES = [
    "All", "Mathematics", "Physics", "Chemistry",
    "Computer Science", "AI/ML", "Biology"
];

export default function Home() {
    const [blogs, setBlogs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1 });

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {
            let res;
            if (searchQuery.trim()) {
                res = await api.get(`/blogs/search?q=${encodeURIComponent(searchQuery)}`);
                setBlogs(res.data.blogs || res.data);
                setPagination({ totalPages: 1 });
            } else if (category !== "All") {
                res = await api.get(`/blogs/category/${encodeURIComponent(category)}`);
                setBlogs(res.data.blogs || res.data);
                setPagination({ totalPages: 1 });
            } else {
                res = await api.get(`/blogs?page=${page}&limit=9`);
                setBlogs(res.data.blogs || res.data);
                setPagination(res.data.pagination || { totalPages: 1 });
            }
        } catch {
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, category, page]);

    useEffect(() => { fetchBlogs(); }, [fetchBlogs]);



    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(search);
        setPage(1);
    };

    const handleCategory = (cat) => {
        setCategory(cat);
        setSearch("");
        setSearchQuery("");
        setPage(1);
    };

    return (
        <div className="page-wrapper">

            {/* ── Hero ─────────────────────────────────────── */}
            <div className="hero-gradient" style={{ padding: "60px 0 48px" }}>
                <div className="container" style={{ textAlign: "center" }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "6px 16px", borderRadius: 999,
                        background: "rgba(124,58,237,0.12)",
                        border: "1px solid rgba(124,58,237,0.3)",
                        color: "#a78bfa", fontSize: 13, fontWeight: 600, marginBottom: 24
                    }}>
                        ✦ Knowledge for Everyone
                    </div>

                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                        fontWeight: 800, lineHeight: 1.15,
                        marginBottom: 20, maxWidth: 700, margin: "0 auto 20px"
                    }}>
                        Explore the Frontiers of{" "}
                        <span className="gradient-text">Human Knowledge</span>
                    </h1>

                    <p style={{
                        color: "var(--text-secondary)", fontSize: 18, maxWidth: 540,
                        margin: "0 auto 36px", lineHeight: 1.7
                    }}>
                        Deep-dive articles on Mathematics, Physics, AI, and more — written by passionate experts.
                    </p>

                    {/* Search */}
                    <form onSubmit={handleSearch} style={{
                        display: "flex", gap: 0, maxWidth: 520,
                        margin: "0 auto",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 12, padding: 4,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.4)"
                    }}>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search articles..."
                            style={{
                                flex: 1, background: "transparent", border: "none",
                                outline: "none", padding: "10px 16px",
                                color: "var(--text-primary)", fontSize: 15,
                                fontFamily: "Inter, sans-serif"
                            }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ borderRadius: 8, padding: "10px 20px" }}>
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Main Content ──────────────────────────────── */}
            <div className="container" style={{ padding: "40px 24px 80px" }}>
                <div>

                    {/* Blog Listings */}
                    <div>
                        {/* Category Pills */}
                        <div style={{
                            display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32
                        }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategory(cat)}
                                    style={{
                                        padding: "7px 16px", borderRadius: 999,
                                        fontSize: 13, fontWeight: 600,
                                        cursor: "pointer", transition: "all 0.2s",
                                        fontFamily: "Inter, sans-serif",
                                        background: category === cat ? "linear-gradient(135deg,#7c3aed,#9333ea)" : "var(--bg-surface)",
                                        color: category === cat ? "#fff" : "var(--text-secondary)",
                                        border: `1px solid ${category === cat ? "transparent" : "var(--border)"}`,
                                        boxShadow: category === cat ? "0 4px 14px rgba(124,58,237,0.4)" : "none"
                                    }}
                                >{cat}</button>
                            ))}
                        </div>

                        {/* Results heading */}
                        {(searchQuery || category !== "All") && (
                            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                                    {searchQuery ? `Results for "${searchQuery}"` : `Category: ${category}`}
                                    {" "}· {blogs.length} article{blogs.length !== 1 ? "s" : ""}
                                </span>
                                <button onClick={() => handleCategory("All")} style={{
                                    background: "none", border: "none", cursor: "pointer",
                                    color: "var(--danger)", fontSize: 12, fontFamily: "Inter, sans-serif"
                                }}>✕ Clear</button>
                            </div>
                        )}

                        {/* Blog Grid */}
                        {loading ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                                {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📭</div>
                                <h3 style={{ color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}>No articles found</h3>
                                <p style={{ fontSize: 14 }}>Try a different search or category</p>
                                <button onClick={() => handleCategory("All")} className="btn btn-secondary">
                                    Browse All
                                </button>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                                    {blogs.map(blog => (
                                        <div key={blog.id} style={{ animation: "fadeInUp 0.5s ease forwards" }}>
                                            <BlogCard blog={blog} />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && !searchQuery && category === "All" && (
                                    <div style={{
                                        display: "flex", justifyContent: "center",
                                        gap: 8, marginTop: 48
                                    }}>
                                        <button onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1} className="btn btn-secondary btn-sm">
                                            ← Prev
                                        </button>
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                            .filter(p => Math.abs(p - page) <= 2)
                                            .map(p => (
                                                <button key={p} onClick={() => setPage(p)}
                                                    className={`btn btn-sm ${p === page ? "btn-primary" : "btn-secondary"}`}>
                                                    {p}
                                                </button>
                                            ))}
                                        <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                            disabled={page === pagination.totalPages} className="btn btn-secondary btn-sm">
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
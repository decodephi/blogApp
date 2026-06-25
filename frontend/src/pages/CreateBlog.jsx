import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

const CATEGORIES = [
    "Mathematics", "Physics", "Chemistry",
    "Computer Science", "AI/ML", "Biology", "Other"
];

export default function CreateBlog() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        const reader = new FileReader();
        reader.onload = ev => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) { toast.error("Title is required"); return; }
        if (!content.trim() || content.length < 100) {
            toast.error("Content must be at least 100 characters"); return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("category", category);
            if (image) formData.append("image", image);

            await api.post("/blogs", formData);
            toast.success("Blog created as draft! You can publish it from My Blogs.");
            navigate("/my-blogs");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create blog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="container" style={{ padding: "40px 24px 80px", maxWidth: 900 }}>

                {/* Header */}
                <div style={{ marginBottom: 36 }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>Write an Article</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
                        Share your knowledge with the community. Blogs are saved as drafts — publish when ready.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32 }}>

                        {/* Main Content */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                            {/* Title */}
                            <div className="form-group">
                                <label className="form-label">Article Title *</label>
                                <input
                                    type="text" className="form-input"
                                    placeholder="e.g. Understanding Euler's Identity"
                                    value={title} onChange={e => setTitle(e.target.value)}
                                    style={{ fontSize: 18, padding: "14px 16px" }}
                                />
                            </div>

                            {/* Content */}
                            <div className="form-group" style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <label className="form-label">Content *</label>
                                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                        {wordCount} words · ~{readTime} min read
                                    </span>
                                </div>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Start writing your article... You can use HTML for formatting (e.g. <h2>, <p>, <code>, <ul>)"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    style={{ minHeight: 400 }}
                                />
                                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                                    Tip: Use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;code&gt;, &lt;ul&gt;&lt;li&gt; for formatting
                                </p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {/* Publish Actions */}
                            <div style={{
                                background: "var(--bg-surface)", border: "1px solid var(--border)",
                                borderRadius: 14, padding: 20
                            }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Publish</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    <button type="submit" className="btn btn-primary" disabled={loading}
                                        style={{ justifyContent: "center" }}>
                                        {loading ? (
                                            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span className="spinner spinner-sm" /> Saving...
                                            </span>
                                        ) : "💾 Save as Draft"}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                                        Cancel
                                    </button>
                                </div>
                                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12, lineHeight: 1.5 }}>
                                    Drafts are private. Go to My Blogs to publish and generate an AI summary.
                                </p>
                            </div>

                            {/* Category */}
                            <div style={{
                                background: "var(--bg-surface)", border: "1px solid var(--border)",
                                borderRadius: 14, padding: 20
                            }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Category</h3>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat} type="button"
                                            onClick={() => setCategory(cat === category ? "" : cat)}
                                            style={{
                                                padding: "6px 12px", borderRadius: 999,
                                                fontSize: 13, fontWeight: 500, cursor: "pointer",
                                                fontFamily: "Inter, sans-serif",
                                                background: category === cat ? "rgba(124,58,237,0.2)" : "var(--bg-elevated)",
                                                color: category === cat ? "#a78bfa" : "var(--text-secondary)",
                                                border: `1px solid ${category === cat ? "rgba(124,58,237,0.4)" : "var(--border)"}`,
                                                transition: "all 0.15s"
                                            }}
                                        >{cat}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Cover Image */}
                            <div style={{
                                background: "var(--bg-surface)", border: "1px solid var(--border)",
                                borderRadius: 14, padding: 20
                            }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Cover Image</h3>
                                {imagePreview ? (
                                    <div style={{ position: "relative" }}>
                                        <img src={imagePreview} alt="preview" style={{
                                            width: "100%", height: 140, objectFit: "cover", borderRadius: 10
                                        }} />
                                        <button type="button" onClick={() => { setImage(null); setImagePreview(null); }}
                                            style={{
                                                position: "absolute", top: 8, right: 8,
                                                background: "rgba(0,0,0,0.6)", border: "none",
                                                borderRadius: "50%", width: 28, height: 28,
                                                color: "#fff", cursor: "pointer", fontSize: 14
                                            }}>✕</button>
                                    </div>
                                ) : (
                                    <label style={{
                                        display: "flex", flexDirection: "column",
                                        alignItems: "center", justifyContent: "center",
                                        height: 120, border: "2px dashed var(--border)",
                                        borderRadius: 10, cursor: "pointer", gap: 8,
                                        color: "var(--text-muted)", fontSize: 13,
                                        transition: "border-color 0.2s"
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                                    >
                                        <span style={{ fontSize: 28 }}>🖼</span>
                                        <span>Click to upload</span>
                                        <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
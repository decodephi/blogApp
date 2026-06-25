import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import LoadingSpinner from "../components/LoadingSpinner";

const CATEGORIES = [
    "Mathematics", "Physics", "Chemistry",
    "Computer Science", "AI/ML", "Biology", "Other"
];

export default function EditBlog() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // FIXED: Fetch the specific blog by ID directly — no more fetching all blogs
        api.get(`/blogs/${id}`)
            .then(r => {
                const blog = r.data.blog || r.data;
                setTitle(blog.title || "");
                setContent(blog.content || "");
                setCategory(blog.category || "");
                setExistingImage(blog.coverImage || null);
            })
            .catch(() => toast.error("Failed to load blog"))
            .finally(() => setLoading(false));
    }, [id]);

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
        if (!content.trim()) { toast.error("Content is required"); return; }
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("category", category);
            if (image) formData.append("image", image);

            await api.put(`/blogs/${id}`, formData);
            toast.success("Blog updated! It has been moved back to draft for review.");
            navigate("/my-blogs");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update blog");
        } finally {
            setSaving(false);
        }
    };

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    if (loading) return (
        <div className="page-wrapper"><LoadingSpinner message="Loading article..." /></div>
    );

    return (
        <div className="page-wrapper">
            <div className="container" style={{ padding: "40px 24px 80px", maxWidth: 900 }}>
                <div style={{ marginBottom: 36 }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>Edit Article</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
                        Changes will save the blog as a draft. Re-publish when ready.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32 }}>

                        {/* Main Content */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                            <div className="form-group">
                                <label className="form-label">Article Title *</label>
                                <input type="text" className="form-input"
                                    value={title} onChange={e => setTitle(e.target.value)}
                                    style={{ fontSize: 18, padding: "14px 16px" }}
                                />
                            </div>

                            <div className="form-group">
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <label className="form-label">Content *</label>
                                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{wordCount} words</span>
                                </div>
                                <textarea
                                    className="form-textarea"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    style={{ minHeight: 400 }}
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div style={{
                                background: "var(--bg-surface)", border: "1px solid var(--border)",
                                borderRadius: 14, padding: 20
                            }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Actions</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    <button type="submit" className="btn btn-primary" disabled={saving}
                                        style={{ justifyContent: "center" }}>
                                        {saving ? (
                                            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span className="spinner spinner-sm" /> Saving...
                                            </span>
                                        ) : "💾 Save Changes"}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/my-blogs")}>
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            {/* Category */}
                            <div style={{
                                background: "var(--bg-surface)", border: "1px solid var(--border)",
                                borderRadius: 14, padding: 20
                            }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Category</h3>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {CATEGORIES.map(cat => (
                                        <button key={cat} type="button"
                                            onClick={() => setCategory(cat === category ? "" : cat)}
                                            style={{
                                                padding: "6px 12px", borderRadius: 999,
                                                fontSize: 13, fontWeight: 500, cursor: "pointer",
                                                fontFamily: "Inter, sans-serif",
                                                background: category === cat ? "rgba(124,58,237,0.2)" : "var(--bg-elevated)",
                                                color: category === cat ? "#a78bfa" : "var(--text-secondary)",
                                                border: `1px solid ${category === cat ? "rgba(124,58,237,0.4)" : "var(--border)"}`,
                                                transition: "all 0.15s"
                                            }}>{cat}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Image */}
                            <div style={{
                                background: "var(--bg-surface)", border: "1px solid var(--border)",
                                borderRadius: 14, padding: 20
                            }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Cover Image</h3>
                                {(imagePreview || existingImage) ? (
                                    <div style={{ position: "relative" }}>
                                        <img src={imagePreview || existingImage} alt="preview" style={{
                                            width: "100%", height: 140, objectFit: "cover", borderRadius: 10
                                        }} />
                                        <button type="button" onClick={() => {
                                            setImage(null); setImagePreview(null); setExistingImage(null);
                                        }} style={{
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
                                        color: "var(--text-muted)", fontSize: 13
                                    }}>
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
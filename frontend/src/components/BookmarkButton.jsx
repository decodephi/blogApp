import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function BookmarkButton({ blogId }) {
    const { user } = useAuth();
    const toast = useToast();
    const [bookmarked, setBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        api.get("/bookmarks")
            .then(r => {
                const ids = r.data.map(b => b.blogId);
                setBookmarked(ids.includes(blogId));
            })
            .catch(() => {});
    }, [blogId, user]);

    const toggle = async () => {
        if (!user) { toast.info("Please sign in to save posts"); return; }
        if (loading) return;
        setLoading(true);
        try {
            if (bookmarked) {
                await api.delete(`/bookmarks/${blogId}`);
                setBookmarked(false);
                toast.info("Bookmark removed");
            } else {
                await api.post(`/bookmarks/${blogId}`);
                setBookmarked(true);
                toast.success("Saved to bookmarks!");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={toggle} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 18px", borderRadius: 999,
            background: bookmarked ? "rgba(124,58,237,0.15)" : "var(--bg-elevated)",
            border: `1px solid ${bookmarked ? "rgba(124,58,237,0.4)" : "var(--border)"}`,
            color: bookmarked ? "#a78bfa" : "var(--text-secondary)",
            cursor: "pointer", fontSize: 14, fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            transition: "all 0.2s"
        }}>
            <span style={{ fontSize: 16 }}>{bookmarked ? "🔖" : "🏷"}</span>
            <span>{bookmarked ? "Saved" : "Save"}</span>
        </button>
    );
}

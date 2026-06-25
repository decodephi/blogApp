import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LikeButton({ blogId, initialCount = 0 }) {
    const { user } = useAuth();
    const toast = useToast();
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);
    const [anim, setAnim] = useState(false);

    useEffect(() => {
        if (!user) return;
        api.get(`/likes/${blogId}/check`)
            .then(r => setLiked(r.data.liked))
            .catch(() => {});
    }, [blogId, user]);

    const toggle = async () => {
        if (!user) { toast.info("Please sign in to like posts"); return; }
        if (loading) return;
        setLoading(true);
        setAnim(true);
        setTimeout(() => setAnim(false), 600);
        try {
            if (liked) {
                await api.delete(`/likes/${blogId}`);
                setLiked(false);
                setCount(c => Math.max(0, c - 1));
            } else {
                await api.post(`/likes/${blogId}`);
                setLiked(true);
                setCount(c => c + 1);
                toast.success("Blog liked! ♥");
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
            background: liked ? "rgba(239,68,68,0.15)" : "var(--bg-elevated)",
            border: `1px solid ${liked ? "rgba(239,68,68,0.4)" : "var(--border)"}`,
            color: liked ? "#fca5a5" : "var(--text-secondary)",
            cursor: "pointer", fontSize: 14, fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            transition: "all 0.2s",
            transform: anim ? "scale(1.08)" : "scale(1)"
        }}>
            <span style={{
                fontSize: 18,
                animation: anim ? "heartBeat 0.6s ease" : "none",
                display: "inline-block"
            }}>
                {liked ? "♥" : "♡"}
            </span>
            {count > 0 && <span>{count}</span>}
            <span>{liked ? "Liked" : "Like"}</span>
        </button>
    );
}

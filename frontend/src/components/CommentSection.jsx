import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default function CommentSection({ blogId }) {
    const { user } = useAuth();
    const toast = useToast();
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [replyTo, setReplyTo] = useState(null); // { id, name }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {
        try {
            const res = await api.get(`/comments/${blogId}`);
            setComments(res.data);
        } catch {
            /* silent */
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComments(); }, [blogId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setSubmitting(true);
        try {
            if (replyTo) {
                await api.post(`/comments/${blogId}/${replyTo.id}/reply`, { content: text });
            } else {
                await api.post(`/comments/${blogId}`, { content: text });
            }
            setText("");
            setReplyTo(null);
            await fetchComments();
            toast.success("Comment posted!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await api.delete(`/comments/${commentId}`);
            toast.success("Comment deleted");
            await fetchComments();
        } catch {
            toast.error("Failed to delete comment");
        }
    };

    const CommentItem = ({ comment, isReply = false }) => {
        const canDelete = user && (user.id === comment.userId || user.role === "ADMIN");
        return (
            <div style={{
                display: "flex", gap: 12,
                paddingLeft: isReply ? 40 : 0,
                marginBottom: 16
            }}>
                {/* Avatar */}
                <div style={{
                    width: isReply ? 28 : 36, height: isReply ? 28 : 36,
                    borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: isReply ? 11 : 13, fontWeight: 700, color: "#fff"
                }}>
                    {comment.user?.name?.slice(0, 2).toUpperCase() || "?"}
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{
                        background: "var(--bg-elevated)", border: "1px solid var(--border)",
                        borderRadius: 12, padding: "12px 16px"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
                                {comment.user?.name || "Unknown"}
                            </span>
                            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                {timeAgo(comment.createdAt)}
                            </span>
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>
                            {comment.content}
                        </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 12, marginTop: 6, paddingLeft: 4 }}>
                        {user && !isReply && (
                            <button onClick={() => setReplyTo({ id: comment.id, name: comment.user?.name })}
                                style={{
                                    background: "none", border: "none", cursor: "pointer",
                                    fontSize: 12, color: "var(--text-muted)",
                                    fontFamily: "Inter, sans-serif", padding: 0
                                }}>↩ Reply</button>
                        )}
                        {canDelete && (
                            <button onClick={() => handleDelete(comment.id)}
                                style={{
                                    background: "none", border: "none", cursor: "pointer",
                                    fontSize: 12, color: "var(--danger)",
                                    fontFamily: "Inter, sans-serif", padding: 0
                                }}>Delete</button>
                        )}
                    </div>

                    {/* Nested Replies */}
                    {comment.replies?.map(reply => (
                        <CommentItem key={reply.id} comment={reply} isReply />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div style={{ marginTop: 48 }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
                Comments {comments.length > 0 && (
                    <span style={{ color: "var(--text-secondary)", fontSize: 16 }}>({comments.length})</span>
                )}
            </h3>

            {/* Post Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
                    {replyTo && (
                        <div style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "8px 14px", marginBottom: 8,
                            background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
                            borderRadius: 8, fontSize: 13, color: "#a78bfa"
                        }}>
                            <span>↩ Replying to {replyTo.name}</span>
                            <button type="button" onClick={() => setReplyTo(null)} style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: "inherit", marginLeft: "auto", fontSize: 16
                            }}>✕</button>
                        </div>
                    )}
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 2
                        }}>
                            {user.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                            <textarea
                                className="form-textarea"
                                value={text}
                                onChange={e => setText(e.target.value)}
                                placeholder="Share your thoughts..."
                                rows={3}
                                style={{ minHeight: 80, resize: "none" }}
                            />
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting || !text.trim()}>
                                    {submitting ? "Posting..." : "Post Comment"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div style={{
                    padding: "20px 24px", marginBottom: 32,
                    background: "var(--bg-surface)", border: "1px solid var(--border)",
                    borderRadius: 12, textAlign: "center",
                    color: "var(--text-secondary)", fontSize: 14
                }}>
                    <a href="/login" style={{ color: "var(--primary)" }}>Sign in</a> to join the conversation
                </div>
            )}

            {/* Comments List */}
            {loading ? (
                [1,2,3].map(i => (
                    <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <div className="skeleton" style={{ height: 70, borderRadius: 12 }} />
                        </div>
                    </div>
                ))
            ) : comments.length === 0 ? (
                <div className="empty-state" style={{ padding: "32px 24px" }}>
                    <div className="empty-state-icon">💬</div>
                    <p style={{ fontWeight: 600 }}>No comments yet</p>
                    <p style={{ fontSize: 14 }}>Be the first to share your thoughts!</p>
                </div>
            ) : (
                comments.map(c => <CommentItem key={c.id} comment={c} />)
            )}
        </div>
    );
}

import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const STATUS_INFO = {
    PENDING:  { label: "Pending Review", icon: "⏳", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
    APPROVED: { label: "Approved!",      icon: "✅", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)" },
    REJECTED: { label: "Rejected",       icon: "❌", color: "#ef4444", bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.3)" },
};

export default function BecomeAuthor() {
    const { user } = useAuth();
    const toast = useToast();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get("/author-requests/my-request")
            .then(r => setRequest(r.data.request))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    // Already an author / admin
    if (user?.role === "AUTHOR" || user?.role === "ADMIN") {
        return (
            <div className="page-wrapper">
                <div className="container" style={{ padding: "80px 24px", maxWidth: 600, textAlign: "center" }}>
                    <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16 }}>
                        You're already {user.role === "ADMIN" ? "an Admin" : "an Author"}!
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 32 }}>
                        You have full access to write and publish articles.
                    </p>
                    <a href="/create-blog" className="btn btn-primary btn-lg">✦ Write an Article</a>
                </div>
            </div>
        );
    }

    const handleRequest = async () => {
        setSubmitting(true);
        try {
            const res = await api.post("/author-requests");
            setRequest(res.data.request);
            toast.success("Request submitted! Admin will review it soon.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit request");
        } finally {
            setSubmitting(false);
        }
    };

    const statusInfo = request ? STATUS_INFO[request.status] : null;

    return (
        <div className="page-wrapper">
            <div className="container" style={{ padding: "60px 24px 80px", maxWidth: 760 }}>

                {/* Hero */}
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "6px 16px", borderRadius: 999,
                        background: "rgba(124,58,237,0.12)",
                        border: "1px solid rgba(124,58,237,0.3)",
                        color: "#a78bfa", fontSize: 13, fontWeight: 600, marginBottom: 20
                    }}>✦ Author Program</div>

                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(2rem, 4vw, 2.8rem)",
                        fontWeight: 800, lineHeight: 1.15, marginBottom: 16
                    }}>
                        Share Your{" "}
                        <span className="gradient-text">Expertise</span>
                    </h1>

                    <p style={{
                        color: "var(--text-secondary)", fontSize: 17,
                        maxWidth: 520, margin: "0 auto", lineHeight: 1.75
                    }}>
                        Join our community of subject matter experts. Write in-depth articles on topics you're passionate about and reach thousands of curious learners.
                    </p>
                </div>

                {/* Benefits */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 16, marginBottom: 56
                }}>
                    {[
                        ["✍️", "Full Editor Access", "Create, edit and publish articles"],
                        ["📊", "Analytics Dashboard", "Track views, likes, and engagement"],
                        ["💬", "Community Reach",    "Connect with passionate learners"],
                        ["🤖", "AI-Powered Tools",  "Auto-generate summaries with AI"],
                    ].map(([icon, title, desc]) => (
                        <div key={title} style={{
                            background: "var(--bg-surface)", border: "1px solid var(--border)",
                            borderRadius: 14, padding: 20
                        }}>
                            <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{title}</div>
                            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{desc}</div>
                        </div>
                    ))}
                </div>

                {/* Status / Action Card */}
                <div style={{
                    background: "var(--bg-surface)", border: "1px solid var(--border)",
                    borderRadius: 20, padding: "36px 40px", textAlign: "center"
                }}>
                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <div className="spinner" />
                        </div>
                    ) : statusInfo ? (
                        /* Show request status */
                        <div>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 10,
                                padding: "12px 24px", borderRadius: 12, marginBottom: 20,
                                background: statusInfo.bg, border: `1px solid ${statusInfo.border}`,
                                color: statusInfo.color, fontWeight: 700, fontSize: 16
                            }}>
                                <span style={{ fontSize: 22 }}>{statusInfo.icon}</span>
                                {statusInfo.label}
                            </div>

                            {request.status === "PENDING" && (
                                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 460, margin: "0 auto" }}>
                                    Your request is under review. An admin will approve or reject your application soon. Check back later!
                                </p>
                            )}
                            {request.status === "APPROVED" && (
                                <div>
                                    <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
                                        Congratulations! Please log out and log back in to refresh your role.
                                    </p>
                                    <a href="/create-blog" className="btn btn-primary btn-lg">
                                        ✦ Start Writing
                                    </a>
                                </div>
                            )}
                            {request.status === "REJECTED" && (
                                <div>
                                    <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
                                        Your request was rejected. You may re-submit with a revised application.
                                    </p>
                                    <button onClick={handleRequest} disabled={submitting} className="btn btn-primary">
                                        {submitting ? "Submitting..." : "Re-submit Request"}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* No request yet */
                        <div>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
                            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 12 }}>
                                Ready to become an author?
                            </h2>
                            <p style={{ color: "var(--text-secondary)", marginBottom: 28, maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.7 }}>
                                Submit your request and an admin will review it shortly. There are no prerequisites — just passion for sharing knowledge!
                            </p>
                            <button onClick={handleRequest} disabled={submitting} className="btn btn-primary btn-lg">
                                {submitting ? (
                                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span className="spinner spinner-sm" /> Submitting...
                                    </span>
                                ) : "✦ Request Author Access"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import LoadingSpinner from "../components/LoadingSpinner";

const STATUS_STYLES = {
    PENDING:  { cls: "badge-warning", label: "Pending"  },
    APPROVED: { cls: "badge-success", label: "Approved" },
    REJECTED: { cls: "badge-danger",  label: "Rejected" },
};

function timeAgo(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminPanel() {
    const toast = useToast();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [filter, setFilter] = useState("ALL");

    const fetchRequests = async () => {
        try {
            const res = await api.get("/admin/author-requests");
            setRequests(res.data.requests || []);
        } catch {
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, []);

    const handleAction = async (id, action) => {
        setProcessing(`${id}-${action}`);
        try {
            await api.patch(`/admin/author-requests/${id}/${action}`);
            toast.success(`Request ${action}d successfully!`);
            await fetchRequests();
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${action}`);
        } finally {
            setProcessing(null);
        }
    };

    const filtered = filter === "ALL" ? requests : requests.filter(r => r.status === filter);

    const counts = {
        ALL: requests.length,
        PENDING: requests.filter(r => r.status === "PENDING").length,
        APPROVED: requests.filter(r => r.status === "APPROVED").length,
        REJECTED: requests.filter(r => r.status === "REJECTED").length,
    };

    if (loading) return <div className="page-wrapper"><LoadingSpinner message="Loading admin panel..." /></div>;

    return (
        <div className="page-wrapper">
            <div className="container" style={{ padding: "40px 24px 80px" }}>

                {/* Header */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "5px 14px", borderRadius: 999,
                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                        color: "#fca5a5", fontSize: 12, fontWeight: 700, marginBottom: 14
                    }}>⚙️ ADMIN</div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>Admin Panel</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
                        Review and manage author access requests from users.
                    </p>
                </div>

                {/* Quick Stats */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 16, marginBottom: 40
                }}>
                    {[
                        { label: "Total Requests", val: counts.ALL,     color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
                        { label: "Pending",        val: counts.PENDING,  color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
                        { label: "Approved",       val: counts.APPROVED, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
                        { label: "Rejected",       val: counts.REJECTED, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
                    ].map(({ label, val, color, bg }) => (
                        <div key={label} className="stat-card" style={{ textAlign: "center" }}>
                            <div className="stat-value" style={{ color, fontSize: 36 }}>{val}</div>
                            <div className="stat-label">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div style={{
                    display: "flex", gap: 4,
                    background: "var(--bg-surface)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: 4, marginBottom: 24,
                    width: "fit-content"
                }}>
                    {["ALL", "PENDING", "APPROVED", "REJECTED"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            padding: "8px 18px", borderRadius: 8,
                            fontSize: 13, fontWeight: 600, cursor: "pointer",
                            fontFamily: "Inter, sans-serif",
                            border: "none",
                            background: filter === f ? "var(--bg-elevated)" : "transparent",
                            color: filter === f ? "var(--text-primary)" : "var(--text-secondary)",
                            transition: "all 0.15s",
                            boxShadow: filter === f ? "0 1px 4px rgba(0,0,0,0.3)" : "none"
                        }}>
                            {f} {f !== "ALL" && <span style={{ opacity: 0.6 }}>({counts[f]})</span>}
                        </button>
                    ))}
                </div>

                {/* Requests Table */}
                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📭</div>
                        <h3 style={{ color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}>
                            No {filter !== "ALL" ? filter.toLowerCase() : ""} requests
                        </h3>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Current Role</th>
                                    <th>Requested</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(req => {
                                    const ss = STATUS_STYLES[req.status] || STATUS_STYLES.PENDING;
                                    const isProcessing = (id, action) => processing === `${id}-${action}`;
                                    return (
                                        <tr key={req.id}>
                                            {/* User */}
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div style={{
                                                        width: 36, height: 36, borderRadius: "50%",
                                                        background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0
                                                    }}>
                                                        {req.user?.name?.slice(0, 2).toUpperCase() || "?"}
                                                    </div>
                                                    <span style={{ fontWeight: 600 }}>{req.user?.name || "Unknown"}</span>
                                                </div>
                                            </td>
                                            {/* Email */}
                                            <td style={{ color: "var(--text-secondary)" }}>{req.user?.email}</td>
                                            {/* Role */}
                                            <td>
                                                <span className={`badge ${
                                                    req.user?.role === "ADMIN" ? "badge-danger" :
                                                    req.user?.role === "AUTHOR" ? "badge-success" :
                                                    "badge-muted"
                                                }`}>{req.user?.role}</span>
                                            </td>
                                            {/* Date */}
                                            <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                                                {timeAgo(req.createdAt)}
                                            </td>
                                            {/* Status */}
                                            <td>
                                                <span className={`badge ${ss.cls}`}>{ss.label}</span>
                                            </td>
                                            {/* Actions */}
                                            <td>
                                                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                    {req.status !== "APPROVED" && (
                                                        <button
                                                            onClick={() => handleAction(req.id, "approve")}
                                                            disabled={!!processing}
                                                            className="btn btn-success btn-sm"
                                                        >
                                                            {isProcessing(req.id, "approve") ? (
                                                                <span className="spinner spinner-sm" />
                                                            ) : "✓ Approve"}
                                                        </button>
                                                    )}
                                                    {req.status !== "REJECTED" && (
                                                        <button
                                                            onClick={() => handleAction(req.id, "reject")}
                                                            disabled={!!processing}
                                                            className="btn btn-danger btn-sm"
                                                        >
                                                            {isProcessing(req.id, "reject") ? (
                                                                <span className="spinner spinner-sm" />
                                                            ) : "✕ Reject"}
                                                        </button>
                                                    )}
                                                    {req.status !== "PENDING" && req.status !== "REJECTED" ? null :
                                                     req.status === "APPROVED" ? (
                                                        <span style={{ fontSize: 13, color: "var(--text-muted)", padding: "6px 12px" }}>
                                                            No actions
                                                        </span>
                                                     ) : null}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { toast.error("Please fill in all fields"); return; }
        setLoading(true);
        try {
            const res = await api.post("/auth/login", { email, password });
            login(res.data.user, res.data.token);
            toast.success(`Welcome back, ${res.data.user.name}! 👋`);
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh", display: "grid",
            gridTemplateColumns: "1fr 1fr"
        }}>
            {/* Left Brand Panel */}
            <div style={{
                background: "linear-gradient(135deg, #1a0533 0%, #0d1117 50%, #001a2c 100%)",
                display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center",
                padding: 48, position: "relative", overflow: "hidden"
            }}
                className="hidden md:flex"
            >
                {/* Decorative orbs */}
                <div style={{
                    position: "absolute", width: 400, height: 400,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
                    top: "10%", left: "10%", pointerEvents: "none"
                }} />
                <div style={{
                    position: "absolute", width: 300, height: 300,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
                    bottom: "20%", right: "5%", pointerEvents: "none"
                }} />

                <div style={{ position: "relative", textAlign: "center", maxWidth: 380 }}>
                    <div style={{
                        fontSize: 56, marginBottom: 24,
                        background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                    }}>✦</div>

                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "2.8rem", fontWeight: 800, lineHeight: 1.1,
                        color: "#fff", marginBottom: 20
                    }}>
                        Philosophia
                    </h1>

                    <p style={{
                        color: "rgba(255,255,255,0.6)", fontSize: 16,
                        lineHeight: 1.75, marginBottom: 40
                    }}>
                        Where brilliant minds share knowledge. Join thousands of readers exploring the frontiers of science and mathematics.
                    </p>

                    <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
                        {["📐 Math", "⚛️ Physics", "🤖 AI/ML"].map(t => (
                            <div key={t} style={{
                                padding: "8px 16px", borderRadius: 999,
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500
                            }}>{t}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--bg-base)", padding: "48px 40px"
            }}>
                <div style={{ width: "100%", maxWidth: 400 }}>
                    <div style={{ marginBottom: 40 }}>
                        <Link to="/" style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            marginBottom: 32, textDecoration: "none"
                        }}>
                            <div style={{
                                width: 28, height: 28,
                                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                                borderRadius: 6, display: "flex", alignItems: "center",
                                justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 800
                            }}>✦</div>
                            <span style={{
                                fontSize: 16, fontWeight: 700,
                                fontFamily: "'Playfair Display', serif",
                                background: "linear-gradient(135deg, #a78bfa, #67e8f9)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                            }}>Philosophia</span>
                        </Link>

                        <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 8 }}>Welcome back</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
                            Sign in to your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email" className="form-input"
                                placeholder="you@example.com"
                                value={email} onChange={e => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPass ? "text" : "password"}
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    style={{ paddingRight: 48 }}
                                />
                                <button type="button" onClick={() => setShowPass(s => !s)} style={{
                                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                                    background: "none", border: "none", cursor: "pointer",
                                    color: "var(--text-muted)", fontSize: 14
                                }}>{showPass ? "🙈" : "👁"}</button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
                            style={{ marginTop: 8 }}>
                            {loading ? (
                                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span className="spinner spinner-sm" /> Signing in...
                                </span>
                            ) : "Sign In"}
                        </button>
                    </form>

                    <p style={{ textAlign: "center", marginTop: 28, color: "var(--text-secondary)", fontSize: 14 }}>
                        Don't have an account?{" "}
                        <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
                            Create one →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
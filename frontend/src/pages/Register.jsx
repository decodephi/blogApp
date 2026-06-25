import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

function PasswordStrength({ password }) {
    const checks = [
        password.length >= 6,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password)
    ];
    const score = checks.filter(Boolean).length;
    const label = ["", "Weak", "Fair", "Good", "Strong"][score];
    const color = ["", "#ef4444", "#f59e0b", "#06b6d4", "#10b981"][score];

    if (!password) return null;
    return (
        <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {[1,2,3,4].map(i => (
                    <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: i <= score ? color : "var(--bg-hover)",
                        transition: "all 0.3s"
                    }} />
                ))}
            </div>
            <span style={{ fontSize: 11, color }}>{label}</span>
        </div>
    );
}

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email || !password) {
            toast.error("Please fill in all fields"); return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters"); return;
        }
        setLoading(true);
        try {
            await api.post("/auth/register", { name, email, password });
            toast.success("Account created! Please sign in.");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
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
                background: "linear-gradient(135deg, #001a2c 0%, #0d1117 50%, #1a0533 100%)",
                display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center",
                padding: 48, position: "relative", overflow: "hidden"
            }}
                className="hidden md:flex"
            >
                <div style={{
                    position: "absolute", width: 350, height: 350, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)",
                    top: "15%", right: "10%"
                }} />
                <div style={{
                    position: "absolute", width: 250, height: 250, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
                    bottom: "15%", left: "5%"
                }} />

                <div style={{ position: "relative", textAlign: "center", maxWidth: 380 }}>
                    <div style={{ fontSize: 56, marginBottom: 24 }}>🚀</div>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "2.4rem", fontWeight: 800, color: "#fff", marginBottom: 20
                    }}>
                        Start Your Journey
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.75, marginBottom: 36 }}>
                        Join a community of curious minds. Read expert articles or become an author and share your knowledge.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
                        {[
                            ["📖", "Access all published articles for free"],
                            ["💬", "Comment and discuss ideas"],
                            ["✍️", "Apply to become an author"]
                        ].map(([icon, text]) => (
                            <div key={text} style={{ display: "flex", alignItems: "center", gap: 12,
                                padding: "10px 16px", borderRadius: 10,
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.08)"
                            }}>
                                <span style={{ fontSize: 18 }}>{icon}</span>
                                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>{text}</span>
                            </div>
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
                    <div style={{ marginBottom: 36 }}>
                        <Link to="/" style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            marginBottom: 28, textDecoration: "none"
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
                        <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 8 }}>Create account</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>Free forever. No credit card needed.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-input" placeholder="John Doe"
                                value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-input" placeholder="you@example.com"
                                value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPass ? "text" : "password"}
                                    className="form-input" placeholder="At least 6 characters"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    autoComplete="new-password" style={{ paddingRight: 48 }}
                                />
                                <button type="button" onClick={() => setShowPass(s => !s)} style={{
                                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                                    background: "none", border: "none", cursor: "pointer",
                                    color: "var(--text-muted)", fontSize: 14
                                }}>{showPass ? "🙈" : "👁"}</button>
                            </div>
                            <PasswordStrength password={password} />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 4 }}>
                            {loading ? (
                                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span className="spinner spinner-sm" /> Creating account...
                                </span>
                            ) : "Create Account"}
                        </button>
                    </form>

                    <p style={{ textAlign: "center", marginTop: 24, color: "var(--text-secondary)", fontSize: 14 }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign in →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = {
    READER: [
        { to: "/", label: "Home" },
        { to: "/become-author", label: "Become Author" }
    ],
    AUTHOR: [
        { to: "/", label: "Home" },
        { to: "/my-blogs", label: "My Blogs" },
        { to: "/create-blog", label: "Write" }
    ],
    ADMIN: [
        { to: "/", label: "Home" },
        { to: "/admin", label: "Admin Panel" },
        { to: "/my-blogs", label: "My Blogs" },
        { to: "/create-blog", label: "Write" }
    ]
};

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
        setDropOpen(false);
    }, [location]);

    useEffect(() => {
        function handleClick(e) {
            if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const links = NAV_LINKS[user?.role] || NAV_LINKS.READER;
    const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "U";

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
            background: scrolled ? "rgba(13,17,23,0.95)" : "rgba(13,17,23,0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
            transition: "all 0.3s ease"
        }}>
            <div className="container" style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                height: 70
            }}>
                {/* Logo */}
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    
                    <span style={{
                        fontSize: 22, fontWeight: 800,
                        fontFamily: "'Playfair Display', serif",
                        background: "linear-gradient(135deg, #a78bfa, #67e8f9)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                    }}>
                        Philosophia
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}
                    className="hidden md:flex">
                    {links.map(link => {
                        const active = location.pathname === link.to;
                        return (
                            <Link key={link.to} to={link.to} style={{
                                padding: "8px 16px",
                                borderRadius: 8,
                                fontSize: 14, fontWeight: 500,
                                color: active ? "#a78bfa" : "var(--text-secondary)",
                                background: active ? "rgba(124,58,237,0.12)" : "transparent",
                                transition: "all 0.2s",
                            }}
                                onMouseEnter={e => !active && (e.target.style.color = "var(--text-primary)")}
                                onMouseLeave={e => !active && (e.target.style.color = "var(--text-secondary)")}
                            >{link.label}</Link>
                        );
                    })}
                </div>

                {/* Right Side */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {!user ? (
                        <>
                            <Link to="/login" style={{
                                padding: "7px 16px", borderRadius: 8,
                                fontSize: 14, fontWeight: 500,
                                color: "var(--text-secondary)",
                                border: "1px solid var(--border)",
                                transition: "all 0.2s"
                            }}>Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Dashboard */}
                            <Link to="/dashboard" style={{
                                padding: "7px 14px", borderRadius: 8,
                                fontSize: 14, fontWeight: 500,
                                color: "var(--text-secondary)",
                                border: "1px solid var(--border)",
                                transition: "all 0.2s"
                            }}>Dashboard</Link>

                            {/* User Menu */}
                            <div ref={dropRef} style={{ position: "relative" }}>
                                <button onClick={() => setDropOpen(o => !o)} style={{
                                    width: 38, height: 38,
                                    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                                    border: "2px solid rgba(124,58,237,0.4)",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    fontSize: 13, fontWeight: 700, color: "#fff",
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                }}>{initials}</button>

                                {dropOpen && (
                                    <div style={{
                                        position: "absolute", top: 48, right: 0,
                                        background: "var(--bg-surface)",
                                        border: "1px solid var(--border)",
                                        borderRadius: 12, minWidth: 200,
                                        boxShadow: "var(--shadow-lg)",
                                        overflow: "hidden",
                                        animation: "slideDown 0.2s ease"
                                    }}>
                                        <div style={{
                                            padding: "14px 18px",
                                            borderBottom: "1px solid var(--border)"
                                        }}>
                                            <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                                            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{user.email}</div>
                                            <div style={{ marginTop: 6 }}>
                                                <span className={`badge badge-${user.role === "ADMIN" ? "danger" : user.role === "AUTHOR" ? "success" : "muted"}`} style={{ fontSize: 11 }}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ padding: 8 }}>
                                            {links.map(link => (
                                                <Link key={link.to} to={link.to} style={{
                                                    display: "block", padding: "9px 12px",
                                                    borderRadius: 8, fontSize: 14,
                                                    color: "var(--text-primary)",
                                                    transition: "all 0.15s"
                                                }}
                                                    onMouseEnter={e => e.target.style.background = "var(--bg-elevated)"}
                                                    onMouseLeave={e => e.target.style.background = "transparent"}
                                                >{link.label}</Link>
                                            ))}
                                            <div style={{ borderTop: "1px solid var(--border)", marginTop: 4, paddingTop: 4 }}>
                                                <button onClick={logout} style={{
                                                    display: "block", width: "100%",
                                                    padding: "9px 12px", borderRadius: 8,
                                                    fontSize: 14, textAlign: "left",
                                                    background: "none", border: "none",
                                                    cursor: "pointer", color: "var(--danger)",
                                                    transition: "all 0.15s"
                                                }}
                                                    onMouseEnter={e => e.target.style.background = "rgba(239,68,68,0.1)"}
                                                    onMouseLeave={e => e.target.style.background = "transparent"}
                                                >Sign Out</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMenuOpen(o => !o)}
                        style={{
                            background: "var(--bg-elevated)", border: "1px solid var(--border)",
                            borderRadius: 8, padding: "8px 10px", cursor: "pointer",
                            color: "var(--text-primary)", display: "flex",
                            flexDirection: "column", gap: 4, width: 40, height: 40,
                            alignItems: "center", justifyContent: "center"
                        }}
                        className="md:hidden"
                    >
                        {[0, 1, 2].map(i => (
                            <span key={i} style={{
                                width: 18, height: 2,
                                background: "currentColor",
                                borderRadius: 2,
                                transition: "all 0.3s",
                                transformOrigin: "center",
                                transform: menuOpen && i === 0 ? "rotate(45deg) translate(4px, 4px)" :
                                    menuOpen && i === 2 ? "rotate(-45deg) translate(4px, -4px)" :
                                        menuOpen && i === 1 ? "scaleX(0)" : "none"
                            }} />
                        ))}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{
                    background: "var(--bg-surface)",
                    borderTop: "1px solid var(--border)",
                    padding: 16,
                    animation: "slideDown 0.2s ease"
                }} className="md:hidden">
                    {links.map(link => (
                        <Link key={link.to} to={link.to} style={{
                            display: "block", padding: "12px 16px",
                            borderRadius: 8, fontSize: 15,
                            color: "var(--text-primary)", marginBottom: 4
                        }}>{link.label}</Link>
                    ))}
                    {user && (
                        <button onClick={logout} style={{
                            width: "100%", padding: "12px 16px",
                            background: "none", border: "none", cursor: "pointer",
                            color: "var(--danger)", fontSize: 15,
                            textAlign: "left", borderRadius: 8
                        }}>Sign Out</button>
                    )}
                </div>
            )}
        </nav>
    );
}
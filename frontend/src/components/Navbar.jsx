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

// Pure JS breakpoint — no Tailwind conflict
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const fn = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", fn);
        return () => window.removeEventListener("resize", fn);
    }, []);
    return isMobile;
}

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const isMobile = useIsMobile();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setMenuOpen(false);
        setDropOpen(false);
    }, [location]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClick(e) {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setDropOpen(false);
            }
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
            {/* ── Main Bar ───────────────────────────────────── */}
            <div className="container" style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", height: 70
            }}>
                {/* Logo stack*/}
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span style={{
                        fontSize: 22, fontWeight: 800,
                        fontFamily: "'Playfair Display', serif",
                        background: "linear-gradient(135deg, #a78bfa, #67e8f9)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                    }}>
                        Stack
                    </span>
                </Link>

                {/* Desktop Nav Links — only on non-mobile */}
                {!isMobile && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {links.map(link => {
                            const active = location.pathname === link.to;
                            return (
                                <Link key={link.to} to={link.to} style={{
                                    padding: "8px 16px", borderRadius: 8,
                                    fontSize: 14, fontWeight: 500,
                                    color: active ? "#a78bfa" : "var(--text-secondary)",
                                    background: active ? "rgba(124,58,237,0.12)" : "transparent",
                                    transition: "all 0.2s", textDecoration: "none"
                                }}
                                    onMouseEnter={e => !active && (e.currentTarget.style.color = "var(--text-primary)")}
                                    onMouseLeave={e => !active && (e.currentTarget.style.color = "var(--text-secondary)")}
                                >{link.label}</Link>
                            );
                        })}
                    </div>
                )}

                {/* Right Side  for login and register*/}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

                    {/* Auth buttons / User menu — desktop */}
                    {!isMobile && (
                        <>
                            {!user ? (
                                <>
                                    <Link to="/login" style={{
                                        padding: "7px 16px", borderRadius: 8,
                                        fontSize: 14, fontWeight: 500,
                                        color: "var(--text-secondary)",
                                        border: "1px solid var(--border)",
                                        textDecoration: "none", transition: "all 0.2s"
                                    }}>Login</Link>
                                    <Link to="/register" className="btn btn-primary btn-sm">
                                        Get Started
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/dashboard" style={{
                                        padding: "7px 14px", borderRadius: 8,
                                        fontSize: 14, fontWeight: 500,
                                        color: "var(--text-secondary)",
                                        border: "1px solid var(--border)",
                                        textDecoration: "none", transition: "all 0.2s"
                                    }}>Dashboard</Link>

                                    {/* Avatar dropdown */}
                                    <div ref={dropRef} style={{ position: "relative" }}>
                                        <button onClick={() => setDropOpen(o => !o)} style={{
                                            width: 38, height: 38,
                                            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                                            border: "2px solid rgba(124,58,237,0.4)",
                                            borderRadius: "50%", cursor: "pointer",
                                            fontSize: 13, fontWeight: 700, color: "#fff",
                                            display: "flex", alignItems: "center", justifyContent: "center"
                                        }}>{initials}</button>

                                        {dropOpen && (
                                            <div style={{
                                                position: "absolute", top: 48, right: 0,
                                                background: "var(--bg-surface)",
                                                border: "1px solid var(--border)",
                                                borderRadius: 12, minWidth: 210,
                                                boxShadow: "var(--shadow-lg)",
                                                overflow: "hidden",
                                                animation: "slideDown 0.2s ease",
                                                zIndex: 100
                                            }}>
                                                {/* User info */}
                                                <div style={{
                                                    padding: "14px 18px",
                                                    borderBottom: "1px solid var(--border)"
                                                }}>
                                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                                                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{user.email}</div>
                                                    <div style={{ marginTop: 6 }}>
                                                        <span className={`badge badge-${user.role === "ADMIN" ? "danger" : user.role === "AUTHOR" ? "success" : "muted"}`}
                                                            style={{ fontSize: 11 }}>
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* Nav links */}
                                                <div style={{ padding: 8 }}>
                                                    {links.map(link => (
                                                        <Link key={link.to} to={link.to} style={{
                                                            display: "block", padding: "9px 12px",
                                                            borderRadius: 8, fontSize: 14,
                                                            color: "var(--text-primary)",
                                                            textDecoration: "none",
                                                            transition: "background 0.15s"
                                                        }}
                                                            onMouseEnter={e => e.currentTarget.style.background = "var(--bg-elevated)"}
                                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                                        >{link.label}</Link>
                                                    ))}
                                                    <div style={{ borderTop: "1px solid var(--border)", marginTop: 4, paddingTop: 4 }}>
                                                        <button onClick={logout} style={{
                                                            display: "block", width: "100%",
                                                            padding: "9px 12px", borderRadius: 8,
                                                            fontSize: 14, textAlign: "left",
                                                            background: "none", border: "none",
                                                            cursor: "pointer", color: "var(--danger)",
                                                            fontFamily: "Inter, sans-serif",
                                                            transition: "background 0.15s"
                                                        }}
                                                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                                        >Sign Out</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Hamburger — mobile only */}
                    {isMobile && (
                        <button
                            onClick={() => setMenuOpen(o => !o)}
                            aria-label="Toggle menu"
                            style={{
                                background: "var(--bg-elevated)",
                                border: "1px solid var(--border)",
                                borderRadius: 8, width: 40, height: 40,
                                cursor: "pointer", color: "var(--text-primary)",
                                display: "flex", flexDirection: "column",
                                gap: 5, alignItems: "center", justifyContent: "center"
                            }}
                        >
                            {[0, 1, 2].map(i => (
                                <span key={i} style={{
                                    width: 18, height: 2,
                                    background: "currentColor",
                                    borderRadius: 2,
                                    transition: "all 0.3s",
                                    transformOrigin: "center",
                                    display: "block",
                                    transform:
                                        menuOpen && i === 0 ? "rotate(45deg) translate(5px, 5px)" :
                                        menuOpen && i === 2 ? "rotate(-45deg) translate(5px, -5px)" :
                                        menuOpen && i === 1 ? "scaleX(0)" : "none"
                                }} />
                            ))}
                        </button>
                    )}
                </div>
            </div>

            {/* ── Mobile Dropdown Menu ───────────────────────── */}
            {isMobile && menuOpen && (
                <div style={{
                    background: "var(--bg-surface)",
                    borderTop: "1px solid var(--border)",
                    animation: "slideDown 0.2s ease"
                }}>
                    {/* User info strip */}
                    {user && (
                        <div style={{
                            padding: "14px 20px",
                            borderBottom: "1px solid var(--border)",
                            display: "flex", alignItems: "center", gap: 12
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: "50%",
                                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0
                            }}>{initials}</div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                                <span className={`badge badge-${user.role === "ADMIN" ? "danger" : user.role === "AUTHOR" ? "success" : "muted"}`}
                                    style={{ fontSize: 10, marginTop: 3, display: "inline-block" }}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Nav links */}
                    <div style={{ padding: "8px 12px" }}>
                        {links.map(link => {
                            const active = location.pathname === link.to;
                            return (
                                <Link key={link.to} to={link.to} style={{
                                    display: "block", padding: "12px 14px",
                                    borderRadius: 8, fontSize: 15, fontWeight: 500,
                                    color: active ? "#a78bfa" : "var(--text-primary)",
                                    background: active ? "rgba(124,58,237,0.1)" : "transparent",
                                    textDecoration: "none", marginBottom: 2,
                                    transition: "background 0.15s"
                                }}>{link.label}</Link>
                            );
                        })}

                        {!user ? (
                            <div style={{ display: "flex", gap: 8, padding: "8px 2px", paddingTop: 12, borderTop: "1px solid var(--border)", marginTop: 4 }}>
                                <Link to="/login" style={{
                                    flex: 1, padding: "10px", borderRadius: 8,
                                    fontSize: 14, fontWeight: 600, textAlign: "center",
                                    border: "1px solid var(--border)",
                                    color: "var(--text-secondary)", textDecoration: "none"
                                }}>Login</Link>
                                <Link to="/register" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div style={{ borderTop: "1px solid var(--border)", marginTop: 4, paddingTop: 4 }}>
                                <Link to="/dashboard" style={{
                                    display: "block", padding: "12px 14px",
                                    borderRadius: 8, fontSize: 15, fontWeight: 500,
                                    color: "var(--text-primary)", textDecoration: "none"
                                }}>Dashboard</Link>
                                <button onClick={logout} style={{
                                    display: "block", width: "100%",
                                    padding: "12px 14px", borderRadius: 8,
                                    fontSize: 15, fontWeight: 500, textAlign: "left",
                                    background: "none", border: "none",
                                    cursor: "pointer", color: "var(--danger)",
                                    fontFamily: "Inter, sans-serif"
                                }}>Sign Out</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
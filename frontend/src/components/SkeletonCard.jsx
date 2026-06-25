export default function SkeletonCard() {
    return (
        <div style={{
            background: "var(--bg-surface)", border: "1px solid var(--border)",
            borderRadius: 16, overflow: "hidden"
        }}>
            {/* Image skeleton */}
            <div className="skeleton" style={{ paddingTop: "56.25%", width: "100%" }} />
            <div style={{ padding: "18px 20px 20px" }}>
                {/* Title */}
                <div className="skeleton" style={{ height: 20, width: "80%", marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 20, width: "60%", marginBottom: 16 }} />
                {/* Body */}
                <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: "70%", marginBottom: 20 }} />
                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div className="skeleton" style={{ width: 28, height: 28, borderRadius: "50%" }} />
                        <div>
                            <div className="skeleton" style={{ height: 12, width: 80, marginBottom: 4 }} />
                            <div className="skeleton" style={{ height: 10, width: 50 }} />
                        </div>
                    </div>
                    <div className="skeleton" style={{ height: 12, width: 60, borderRadius: 4 }} />
                </div>
            </div>
        </div>
    );
}

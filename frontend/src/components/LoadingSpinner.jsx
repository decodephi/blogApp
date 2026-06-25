export default function LoadingSpinner({ size = "md", message }) {
    const cls = `spinner spinner-${size}`;
    return (
        <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 16, padding: 48
        }}>
            <div className={cls} />
            {message && (
                <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{message}</p>
            )}
        </div>
    );
}

export function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      marginTop: "60px",
      padding: "32px 24px",
      textAlign: "center",
    }}>
      <p style={{ fontSize: "11px", color: "var(--text3)", letterSpacing: "0.15em" }}>
        <span style={{ color: "var(--accent)", fontWeight: 700 }}>NikshepOS TV</span> · For personal use only · Use Brave Browser for best experience
      </p>
    </footer>
  );
}

const colors: Record<string, string> = {
  APPLIED: "#3b82f6",
  INTERVIEW: "#f59e0b",
  OFFER: "#10b981",
  REJECTED: "#ef4444",
  WITHDRAWN: "#6b7280",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      background: colors[status] || "#6b7280",
      color: "white",
      padding: "0.2rem 0.6rem",
      borderRadius: "999px",
      fontSize: "0.75rem",
      fontWeight: 600,
    }}>
      {status}
    </span>
  );
}

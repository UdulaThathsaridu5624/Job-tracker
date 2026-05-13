import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getStats } from "../api/applications.api";
import Navbar from "../components/Navbar";

const statusColors: Record<string, string> = {
  applied: "#3b82f6",
  interview: "#f59e0b",
  offer: "#10b981",
  rejected: "#ef4444",
  withdrawn: "#6b7280",
};

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
        <h1>Welcome back, {user?.name}</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "2rem" }}>
              {stats?.total}{" "}
              <span style={{ fontSize: "1rem", fontWeight: "normal", opacity: 0.6 }}>total applications</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem" }}>
              {["applied", "interview", "offer", "rejected", "withdrawn"].map((key) => (
                <div key={key} style={{ background: statusColors[key], color: "white", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats?.[key] ?? 0}</div>
                  <div style={{ textTransform: "capitalize", fontSize: "0.85rem", marginTop: "0.3rem" }}>{key}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

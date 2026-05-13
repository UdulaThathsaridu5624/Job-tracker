import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav style={{ padding: "1rem 2rem", background: "#1e1e2e", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
        <Link to="/applications" style={{ color: "white", textDecoration: "none" }}>Applications</Link>
        <Link to="/applications/new" style={{ color: "white", textDecoration: "none" }}>+ Add</Link>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "0.9rem", opacity: 0.7 }}>{user?.name}</span>
        <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #666", color: "white", padding: "0.3rem 0.8rem", cursor: "pointer", borderRadius: "4px" }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

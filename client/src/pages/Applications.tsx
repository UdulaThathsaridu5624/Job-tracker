import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getApplications } from "../api/applications.api";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";

export default function Applications() {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1>Applications</h1>
          <Link to="/applications/new" style={{ background: "#3b82f6", color: "white", padding: "0.5rem 1rem", borderRadius: "4px", textDecoration: "none" }}>
            + Add New
          </Link>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : applications.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No applications yet. Add your first one!</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "0.75rem" }}>Job Title</th>
                <th style={{ padding: "0.75rem" }}>Company</th>
                <th style={{ padding: "0.75rem" }}>Status</th>
                <th style={{ padding: "0.75rem" }}>Applied</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app: any) => (
                <tr key={app.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "0.75rem" }}>
                    <Link to={`/applications/${app.id}`} style={{ color: "#3b82f6" }}>{app.jobTitle}</Link>
                  </td>
                  <td style={{ padding: "0.75rem" }}>{app.company}</td>
                  <td style={{ padding: "0.75rem" }}><StatusBadge status={app.status} /></td>
                  <td style={{ padding: "0.75rem" }}>{new Date(app.appliedDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

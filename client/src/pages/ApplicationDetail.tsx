import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getApplication, updateApplication, deleteApplication } from "../api/applications.api";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: application, isLoading } = useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplication(id!),
  });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (application) {
      reset({
        ...application,
        appliedDate: application.appliedDate?.slice(0, 10),
        followUpDate: application.followUpDate?.slice(0, 10) ?? "",
      });
    }
  }, [application, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateApplication(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteApplication(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      navigate("/applications");
    },
  });

  if (isLoading) return <><Navbar /><p style={{ padding: "2rem" }}>Loading...</p></>;
  if (!application) return <><Navbar /><p style={{ padding: "2rem" }}>Not found</p></>;

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ marginBottom: "0.3rem" }}>{application.jobTitle}</h1>
            <p style={{ opacity: 0.7, margin: 0 }}>
              {application.company}{application.location && ` · ${application.location}`}
            </p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        {!editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p><strong>Applied:</strong> {new Date(application.appliedDate).toLocaleDateString()}</p>
            {application.followUpDate && (
              <p><strong>Follow Up:</strong> {new Date(application.followUpDate).toLocaleDateString()}</p>
            )}
            {application.notes && <p><strong>Notes:</strong> {application.notes}</p>}
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button onClick={() => setEditing(true)} style={{ padding: "0.5rem 1rem", background: "#3b82f6", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}>
                Edit
              </button>
              <button
                onClick={() => { if (confirm("Delete this application?")) deleteMutation.mutate(); }}
                style={{ padding: "0.5rem 1rem", background: "#ef4444", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label>Job Title</label>
              <input {...register("jobTitle")} style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
            </div>
            <div>
              <label>Company</label>
              <input {...register("company")} style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
            </div>
            <div>
              <label>Location</label>
              <input {...register("location")} style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
            </div>
            <div>
              <label>Status</label>
              <select {...register("status")} style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </div>
            <div>
              <label>Applied Date</label>
              <input {...register("appliedDate")} type="date" style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
            </div>
            <div>
              <label>Follow Up Date</label>
              <input {...register("followUpDate")} type="date" style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
            </div>
            <div>
              <label>Notes</label>
              <textarea {...register("notes")} rows={4} style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" disabled={updateMutation.isPending} style={{ padding: "0.5rem 1rem", background: "#3b82f6", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}>
                {updateMutation.isPending ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={() => setEditing(false)} style={{ padding: "0.5rem 1rem", background: "#6b7280", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApplication } from "../api/applications.api";
import Navbar from "../components/Navbar";

interface FormData {
  jobTitle: string;
  company: string;
  location?: string;
  status: string;
  appliedDate: string;
  followUpDate?: string;
  notes?: string;
}

export default function AddApplication() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { status: "APPLIED" },
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      navigate("/applications");
    },
  });

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h1>Add Application</h1>
        {mutation.isError && <p style={{ color: "red" }}>{(mutation.error as any)?.response?.data?.error}</p>}
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label>Job Title *</label>
            <input {...register("jobTitle", { required: "Required" })} style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
            {errors.jobTitle && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.jobTitle.message}</span>}
          </div>
          <div>
            <label>Company *</label>
            <input {...register("company", { required: "Required" })} style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
            {errors.company && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.company.message}</span>}
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
            <label>Applied Date *</label>
            <input {...register("appliedDate", { required: "Required" })} type="date" style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
            {errors.appliedDate && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.appliedDate.message}</span>}
          </div>
          <div>
            <label>Follow Up Date</label>
            <input {...register("followUpDate")} type="date" style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
          </div>
          <div>
            <label>Notes</label>
            <textarea {...register("notes")} rows={4} style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
          </div>
          <button type="submit" disabled={mutation.isPending} style={{ padding: "0.7rem", background: "#3b82f6", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}>
            {mutation.isPending ? "Saving..." : "Add Application"}
          </button>
        </form>
      </div>
    </>
  );
}

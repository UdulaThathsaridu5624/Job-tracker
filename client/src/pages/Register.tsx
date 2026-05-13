import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function onSubmit(data: FormData) {
    try {
      await registerUser(data);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "5rem auto", padding: "2rem" }}>
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label>Name</label>
          <input {...register("name", { required: "Name is required" })} style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
          {errors.name && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.name.message}</span>}
        </div>
        <div>
          <label>Email</label>
          <input {...register("email", { required: "Email is required" })} type="email" style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
          {errors.email && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.email.message}</span>}
        </div>
        <div>
          <label>Password</label>
          <input {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })} type="password" style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
          {errors.password && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.password.message}</span>}
        </div>
        <button type="submit" style={{ padding: "0.7rem", background: "#3b82f6", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}>
          Register
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

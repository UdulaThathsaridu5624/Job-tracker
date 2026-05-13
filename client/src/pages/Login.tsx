import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function onSubmit(data: FormData) {
    try {
      const res = await loginUser(data);
      login(res.token, res.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "5rem auto", padding: "2rem" }}>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label>Email</label>
          <input {...register("email", { required: "Email is required" })} type="email" style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
          {errors.email && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.email.message}</span>}
        </div>
        <div>
          <label>Password</label>
          <input {...register("password", { required: "Password is required" })} type="password" style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.3rem" }} />
          {errors.password && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.password.message}</span>}
        </div>
        <button type="submit" style={{ padding: "0.7rem", background: "#3b82f6", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}>
          Login
        </button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}

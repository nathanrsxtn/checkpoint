import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import loginSplash from "@/images/loginSplash.png";
import "@/forms/loginForm.css";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || username.trim().length < 3) {
      toast.error("Username must be at least 3 characters.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.error || "Login failed.";
        setError(message);
        toast.error(message);
        return;
      }

      localStorage.setItem("User", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      toast.success(data.message || `Welcome back, ${data.user.username}!`);
      navigate(`/profile/${data.user.id}`);
    } catch (err) {
      console.error(err);
      const message = "Network error. Is the server running?";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="container">
      <img src={loginSplash} alt="loginSplash" className="loginSplash" />

      <form className="Form" onSubmit={handleSubmit}>
        <h2>Sign in to Checkpoint</h2>

        <input type="text" placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />

        <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />

        <button type="submit">Log in</button>

        <p className="Form-link">
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

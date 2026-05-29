import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import loginSplash from "@/images/loginSplash.png";
import "./loginForm.css";

function LoginForm() {
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.includes("@")) {
      toast.error("Please enter a valid username.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
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

      // TODO: Save BOTH the user and the token to localStorage.
      //   - data.user  →  save under key "User" (JSON.stringify it)
      //   - data.token →  save under key "token" (already a string)
      //
      //   Same pattern as SignupForm. The token is what powers the
      //   ProtectedRoute redirect and the Authorization header on logout.
      localStorage.setItem("User", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      toast.success(data.message || `Welcome back, ${data.user.username}!`);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      const message = "Network error. Is the server running?";
      setError(message);
      toast.error(message);
    }

    toast.success(`Welcome back, ${username}!`);
    navigate("/");
  };

  return (
      <div className="container">
        <img src={loginSplash} alt="loginSplash" className="loginSplash"></img> 
        
        <form className="Form" onSubmit={handleSubmit}>
          <h2>Sign in to Checkpoint</h2>

          <input
            type="username"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            // Each keystroke should update the password value.
            onChange={(event) => setPassword(event.target.value)}
          />

          <button type="submit">Log in</button>

          <p className="Form-link">
            No account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
  );
}

export default LoginForm;
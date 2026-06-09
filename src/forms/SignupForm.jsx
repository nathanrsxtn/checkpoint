import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./signUpForm.css";

function SignupForm() {
  // Use states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const image = "";

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!username.trim() || username.trim().length < 3) {
      toast.error("Username must be at least 3 characters.");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, image, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.error || "Signup failed.";
        setError(message);
        toast.error(message);
        return;
      }

      localStorage.setItem("User", JSON.stringify(data.user));

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success(data.message || "Signup successful.");
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
      <form className="Form" onSubmit={handleSubmit}>
        <h2>Sign up</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
        />

        <button type="submit">Sign up</button>

        <p className="Form-link">
          Already a member? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;
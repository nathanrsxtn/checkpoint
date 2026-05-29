import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./signUpForm.css";

// Assignment 5 â€” Signup route.
// This form practices multiple controlled inputs and validation.
// No account is created yet.
function SignupForm() {
  // TODO: Add state for the user's name.
  const [name, setName] = useState("");

  // TODO: Add state for the email address.
  const [email, setEmail] = useState("");

  // TODO: Add state for the password.
  const [password, setPassword] = useState("");

  // TODO: Add state for the confirm password field.
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
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
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        const message = data.error || "Signup failed.";
        setError(message);
        toast.error(message);
        return;
      }

      // TODO: Save the response to localStorage.
      //   - The server returned BOTH a user object AND a token string in this response:
      //       data.user   →  { username, email }
      //       data.token  →  a JWT string (long, starts with "eyJ")
      //   - Save data.user under the key  "User"  (same as A6).
      //   - Save data.token under the key  "token"  (NEW for A7).
      //   - Both go in as JSON-stringified strings for User; the token is already a string.
      //
      //   The ProtectedRoute we build later reads  localStorage.token  to decide
      //   whether the user is logged in, so it MUST be saved here for the redirect
      //   to work after a successful signup.

      localStorage.setItem("User", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);



      toast.success(data.message || "Signup successful.");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      const message = "Network error. Is the server running?";
      setError(message);
      toast.error(message);
    }

    toast.success(`Welcome to PlateScout, ${name}!`);
    navigate("/");
  };

  return (
      <div className="container">
        <form className="Form" onSubmit={handleSubmit}>
          <h2>Sign up</h2>

          <input
            placeholder="Name"
            value={name}
            // TODO: Make this a controlled input for the name field.
            onChange={(event) => setName(event.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            // TODO: Store the typed email in state.
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            // TODO: Update password state as the user types.
            onChange={(event) => setPassword(event.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            // TODO: Track the confirm password value separately from password.
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
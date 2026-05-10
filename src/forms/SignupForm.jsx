import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Forms.css";

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

  const navigate = useNavigate();

  const handleSubmit = (event) => {
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

    toast.success(`Welcome to PlateScout, ${name}!`);
    navigate("/");
  };

  return (
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
  );
}

export default SignupForm;
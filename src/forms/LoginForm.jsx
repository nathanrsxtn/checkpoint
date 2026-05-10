import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Forms.css";

// Assignment 5 â€” Login route.
// This form does not authenticate with a backend yet.
// A valid submission shows a toast message and returns the user to the home page.
function LoginForm() {
  // TODO: Create state to store the user's email.
  // Start the email value as an empty string.
  const [email, setEmail] = useState("");

  // TODO: Create state to store the user's password.
  // Start the password value as an empty string.
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    toast.success(`Welcome back, ${email}!`);
    navigate("/");
  };

  return (
    <form className="Form" onSubmit={handleSubmit}>
      <h2>Log in</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        // TODO: Connect this input to the email state.
        // When the user types, save event.target.value into email.
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        // TODO: Connect this input to the password state.
        // Each keystroke should update the password value.
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type="submit">Log in</button>

      <p className="Form-link">
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </form>
  );
}

export default LoginForm;
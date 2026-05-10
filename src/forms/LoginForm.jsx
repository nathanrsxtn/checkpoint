import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import loginSplash from "@/images/loginSplash.png";
import "./loginForm.css";

// Assignment 5 â€” Login route.
// This form does not authenticate with a backend yet.
// A valid submission shows a toast message and returns the user to the home page.
function LoginForm() {
  const [username, setUsername] = useState("");

  // TODO: Create state to store the user's password.
  // Start the password value as an empty string.
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username.includes("@")) {
      toast.error("Please enter a valid username.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    toast.success(`Welcome back, ${username}!`);
    navigate("/");
  };

  return (
      <div class="container">
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
            // TODO: Connect this input to the password state.
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
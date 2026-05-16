import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import loginSplash from "@/images/loginSplash.png";
import "./loginForm.css";

function LoginForm() {
  const [username, setUsername] = useState("");

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
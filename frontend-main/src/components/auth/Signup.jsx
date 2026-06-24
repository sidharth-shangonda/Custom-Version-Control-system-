import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./auth.css";
import logo from "../../assets/github-mark-white.svg";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email.trim() || !username.trim() || !password.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:3002/signup", {
        email: email.trim(),
        username: username.trim().toLowerCase().replace(/\s+/g, ""),
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Signup Failed. Try a different username or email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card-container">
        <div className="auth-logo-wrapper">
          <img className="auth-logo" src={logo} alt="GitHub Logo" />
        </div>

        <h2 className="auth-title">Join ApnaGit</h2>

        {error && <div className="auth-error-banner">{error}</div>}

        <div className="auth-card">
          <form onSubmit={handleSignup} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="username-input">Username</label>
              <input
                id="username-input"
                autoComplete="username"
                className="auth-input"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError("");
                }}
                disabled={loading}
                required
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="email-input">Email address</label>
              <input
                id="email-input"
                autoComplete="email"
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                disabled={loading}
                required
              />
            </div>
            
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="password-input">Password</label>
              <input
                id="password-input"
                autoComplete="new-password"
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        <div className="auth-redirect-box">
          <p>
            Already have an account? <Link to="/auth" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

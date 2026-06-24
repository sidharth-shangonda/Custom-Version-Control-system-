import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./auth.css";
import logo from "../../assets/github-mark-white.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const res = await axios.post("http://localhost:3002/login", {
        email: email.trim(),
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Invalid email or password.");
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

        <h2 className="auth-title">Sign in to ApnaGit</h2>

        {error && <div className="auth-error-banner">{error}</div>}

        <div className="auth-card">
          <form onSubmit={handleLogin} className="auth-form">
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
              <div className="auth-label-row">
                <label className="auth-label" htmlFor="password-input">Password</label>
                <a href="#forgot" className="auth-link-forgot" onClick={(e) => e.preventDefault()}>Forgot password?</a>
              </div>
              <input
                id="password-input"
                autoComplete="current-password"
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <div className="auth-redirect-box">
          <p>
            New to ApnaGit? <Link to="/signup" className="auth-link">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

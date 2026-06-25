import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./createRepository.css";

const CreateRepository = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true); // true = Public, false = Private
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Repository name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        owner: userId,
        name: name.trim().toLowerCase().replace(/\s+/g, "-"),
        description: description.trim(),
        visibility: visibility,
        content: [],
        issues: []
      };

      await axios.post("http://localhost:3002/repo/create", payload);
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create repository. Make sure name is unique.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-repo-wrapper">
        <div className="create-repo-container">
          <div className="create-repo-header">
            <h2>Create a new repository</h2>
            <p>A repository contains all project files, including the revision history.</p>
          </div>

          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button
                type="button"
                className="banner-close-btn"
                onClick={() => setError("")}
                title="Dismiss error"
              >
                &times;
              </button>
            </div>
          )}
          {success && (
            <div className="success-banner">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
              </svg>
              Repository created successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-repo-form">
            <div className="form-group">
              <label htmlFor="repo-name" className="form-label">
                Repository name <span className="required">*</span>
              </label>
              <div className="repo-name-input-wrapper">
                <span className="owner-prefix">owner /</span>
                <input
                  type="text"
                  id="repo-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="my-awesome-project"
                  disabled={loading || success}
                  required
                />
              </div>
              <p className="form-helper">
                Great repository names are short and memorable. Example: <code>custom-vcs</code>
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="repo-desc" className="form-label">
                Description <span className="optional">(optional)</span>
              </label>
              <textarea
                id="repo-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your repository..."
                rows={3}
                disabled={loading || success}
              />
            </div>

            <div className="form-divider"></div>

            <div className="form-group">
              <label className="form-label">Visibility</label>
              
              <div className="visibility-options">
                <div 
                  className={`visibility-option-card ${visibility ? "selected" : ""}`}
                  onClick={() => !(loading || success) && setVisibility(true)}
                >
                  <input
                    type="radio"
                    name="visibility"
                    id="vis-public"
                    checked={visibility === true}
                    onChange={() => setVisibility(true)}
                    disabled={loading || success}
                  />
                  <div className="option-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
                    </svg>
                  </div>
                  <div className="option-details">
                    <h5>Public</h5>
                    <p>Anyone on the internet can see this repository. You choose who can commit.</p>
                  </div>
                </div>

                <div 
                  className={`visibility-option-card ${!visibility ? "selected" : ""}`}
                  onClick={() => !(loading || success) && setVisibility(false)}
                >
                  <input
                    type="radio"
                    name="visibility"
                    id="vis-private"
                    checked={visibility === false}
                    onChange={() => setVisibility(false)}
                    disabled={loading || success}
                  />
                  <div className="option-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <div className="option-details">
                    <h5>Private</h5>
                    <p>You choose who can see and commit to this repository.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-divider"></div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-submit-repo"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Creating repository...
                  </>
                ) : (
                  "Create repository"
                )}
              </button>
              <button
                type="button"
                className="btn-cancel-repo"
                onClick={() => navigate("/")}
                disabled={loading || success}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRepository;

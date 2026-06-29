import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import "./repoDetail.css";

const RepoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3002/repo/${id}`);
        // The API returns an array, let's take the first element
        if (response.data && response.data.length > 0) {
          setRepo(response.data[0]);
        } else {
          setError("Repository not found.");
        }
      } catch (err) {
        console.error("Error fetching repository details:", err);
        setError("Failed to load repository details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRepoDetails();
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="repo-detail-wrapper">
        <div className="repo-detail-container">
          {loading ? (
            <div className="repo-detail-loading">
              <div className="spinner"></div>
              <p>Loading repository details...</p>
            </div>
          ) : error ? (
            <div className="repo-detail-error">
              <h3>Error</h3>
              <p>{error}</p>
              <Link to="/">
                <button>Back to Dashboard</button>
              </Link>
            </div>
          ) : (
            <div className="repo-header-block">
              <div className="repo-title-row">
                <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" className="repo-icon">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 1 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 0 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8z"/>
                </svg>
                <h2>{repo.name}</h2>
                <span className={`badge-visibility ${repo.visibility === false ? "private" : "public"}`}>
                  {repo.visibility === false ? "Private" : "Public"}
                </span>
              </div>
              <p className="repo-desc-text">{repo.description || "No description provided."}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RepoDetail;

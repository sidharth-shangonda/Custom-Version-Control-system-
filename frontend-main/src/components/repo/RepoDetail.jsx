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
  const [activeTab, setActiveTab] = useState("files");

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
            <>
              {/* Header block */}
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

              {/* Tabs Block */}
              <div className="repo-tabs">
                <button 
                  className={`repo-tab-btn ${activeTab === "files" ? "active" : ""}`}
                  onClick={() => setActiveTab("files")}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="tab-icon">
                    <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l3.414 3.414c.329.328.513.773.513 1.237v9.086A1.75 1.75 0 0 1 13.75 16H3.75A1.75 1.75 0 0 1 2 14.25V1.75zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h10a.25.25 0 0 0 .25-.25V5.5H10.25A1.75 1.75 0 0 1 8.5 3.75V1.5H3.75zm6.5 3H14l-3.75-3.75v3.5c0 .138.112.25.25.25z"/>
                  </svg>
                  Files
                  <span className="tab-badge">{repo.content?.length || 0}</span>
                </button>
                <button 
                  className={`repo-tab-btn ${activeTab === "issues" ? "active" : ""}`}
                  onClick={() => setActiveTab("issues")}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="tab-icon">
                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                    <path fillRule="evenodd" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0z"/>
                  </svg>
                  Issues
                  <span className="tab-badge">{repo.issues?.length || 0}</span>
                </button>
              </div>

              {/* Main Content Areas */}
              <div className="repo-tab-content">
                {activeTab === "files" && (
                  <div className="repo-files-explorer">
                    {repo.content && repo.content.length > 0 ? (
                      <div className="files-list">
                        <div className="files-list-header">
                          <span>Name</span>
                          <span>Source</span>
                        </div>
                        {repo.content.map((file, idx) => (
                          <div key={idx} className="file-item">
                            <div className="file-name-col">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="file-icon">
                                <path d="M3.75 1.5a.25.25 0 0 0-.25.25v11.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V6H9.75A1.75 1.75 0 0 1 8 4.25V1.5H3.75zm5.75.25v3a.25.25 0 0 0 .25.25h3l-3.25-3.25zM2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l3.414 3.414c.329.328.513.773.513 1.237v9.086A1.75 1.75 0 0 1 13.75 16H3.75A1.75 1.75 0 0 1 2 14.25V1.75z"/>
                              </svg>
                              <span className="file-name">{file}</span>
                            </div>
                            <div className="file-source-col">
                              <span className="file-sync-tag">S3 Bucket Sync</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-files-state">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <h4>No files tracked yet</h4>
                        <p>Use the CLI tool command <code>add &lt;file&gt;</code> followed by <code>commit &lt;msg&gt;</code> to track files.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RepoDetail;

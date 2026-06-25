import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/auth");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user repositories
        const repoRes = await axios.get(`http://localhost:3002/repo/user/${userId}`);
        setRepositories(repoRes.data.repositories || []);
        
        // Fetch suggested repositories (all)
        const allRepoRes = await axios.get("http://localhost:3002/repo/all");
        setSuggestedRepositories(allRepoRes.data || []);

        // Fetch user profile info
        const profileRes = await axios.get(`http://localhost:3002/userProfile/${userId}`);
        setUserProfile(profileRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filtered = repositories.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          
          {/* Left Sidebar: Profile & Quick Actions */}
          <aside className="dashboard-sidebar-left">
            <div className="profile-card">
              <div className="profile-card-avatar">
                {userProfile?.username?.substring(0, 2).toUpperCase() || "U"}
              </div>
              <div className="profile-card-info">
                <h3>{userProfile?.username || "Developer"}</h3>
                <p>{userProfile?.email || "loading..."}</p>
              </div>
              <div className="profile-card-stats">
                <div className="stat-item">
                  <span className="stat-count">{repositories.length}</span>
                  <span className="stat-label">Repositories</span>
                </div>
              </div>
              <Link to="/create" className="btn-new-repo-link">
                <button className="btn-new-repo">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
                  </svg>
                  New Repository
                </button>
              </Link>
            </div>
          </aside>

          {/* Center Content: Main Repositories List */}
          <main className="dashboard-main-content">
            <div className="dashboard-section-header">
              <h2>Your Repositories</h2>
              <div className="search-box">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l4 4" />
                </svg>
                <input
                  type="text"
                  placeholder="Filter repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchQuery("")}
                    title="Clear filter"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading repositories...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <h3>No repositories found</h3>
                <p>Create a repository to start tracking version control commits.</p>
                <Link to="/create">
                  <button className="btn-create-empty">Create Repository</button>
                </Link>
              </div>
            ) : (
              <div className="repos-grid">
                {searchResults.map((repo) => (
                  <div key={repo._id} className="repo-card">
                    <div className="repo-card-header">
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" className="repo-icon">
                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 1 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 0 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8z"/>
                      </svg>
                      <h4 className="repo-card-title">{repo.name}</h4>
                      <span className={`badge-visibility ${repo.visibility === false ? "private" : "public"}`}>
                        {repo.visibility === false ? "Private" : "Public"}
                      </span>
                    </div>
                    <p className="repo-card-desc">
                      {repo.description || "No description provided."}
                    </p>
                    <div className="repo-card-footer">
                      <div className="repo-stat" title="Number of files tracked by .apnaGit in this repository">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M4 1.75C4 .784 4.784 0 5.75 0h4.5C11.216 0 12 .784 12 1.75v12.5A1.75 1.75 0 0 1 10.25 16h-4.5A1.75 1.75 0 0 1 4 14.25V1.75zM5.75 1.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h4.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-4.5z"/>
                        </svg>
                        <span>{repo.content?.length || 0} files</span>
                      </div>
                      <div className="repo-stat" title="Number of open/closed issues in this repository">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                          <path fillRule="evenodd" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0z"/>
                        </svg>
                        <span>{repo.issues?.length || 0} issues</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* Right Sidebar: Suggestions & Events */}
          <aside className="dashboard-sidebar-right">
            <div className="sidebar-right-card">
              <h3>Explore Public Repos</h3>
              <div className="suggested-repos-list">
                {suggestedRepositories.slice(0, 5).map((repo) => (
                  <div key={repo._id} className="suggested-repo-item">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 1 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 0 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8z"/>
                    </svg>
                    <div className="suggested-repo-info">
                      <h5>{repo.name}</h5>
                      <p>{repo.description || "No description."}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-right-card">
              <h3>Developer Events</h3>
              <ul className="events-list">
                <li>
                  <span className="event-date">Dec 15</span>
                  <div className="event-detail">
                    <h6>Tech Conference</h6>
                    <p>MERN & Cloud Architecture</p>
                  </div>
                </li>
                <li>
                  <span className="event-date">Dec 25</span>
                  <div className="event-detail">
                    <h6>Developer Meetup</h6>
                    <p>Git Internals Workshop</p>
                  </div>
                </li>
                <li>
                  <span className="event-date">Jan 05</span>
                  <div className="event-detail">
                    <h6>React Summit</h6>
                    <p>Next-gen frontend ecosystems</p>
                  </div>
                </li>
              </ul>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
};

export default Dashboard;

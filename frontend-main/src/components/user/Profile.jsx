import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentUser } = useAuth();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/auth");
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Fetch user profile
        const userRes = await axios.get(`http://localhost:3002/userProfile/${userId}`);
        setUserDetails(userRes.data);

        // Fetch user repositories
        const repoRes = await axios.get(`http://localhost:3002/repo/user/${userId}`);
        setRepositories(repoRes.data.repositories || []);
      } catch (err) {
        console.error("Cannot fetch profile details: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    window.location.href = "/auth";
  };

  return (
    <>
      <Navbar />
      <div className="profile-wrapper">
        <div className="profile-container">
          
          {/* Left Column: User Card info */}
          <div className="profile-left-column">
            <div className="profile-user-card">
              <div className="profile-user-avatar">
                {userDetails?.username?.substring(0, 2).toUpperCase() || "U"}
              </div>
              <h2 className="profile-username">{userDetails?.username || "Developer"}</h2>
              <p className="profile-email">{userDetails?.email || "loading..."}</p>
              
              <div className="profile-user-bio">
                Building the future of decentralized and custom version control platforms.
              </div>

              <button className="btn-edit-profile">Edit Profile</button>
              
              <div className="profile-followers-stats">
                <span className="followers-count"><strong>12</strong> followers</span>
                <span className="followers-count"><strong>18</strong> following</span>
              </div>

              <button onClick={handleLogout} className="btn-logout">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M2 2.75C2 1.784 2.784 1 3.75 1h4.5a.75.75 0 0 1 0 1.5h-4.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h4.5a.75.75 0 0 1 0 1.5h-4.5A1.75 1.75 0 0 1 2 13.25V2.75zm10.44 4.5H6.75a.75.75 0 0 0 0 1.5h5.69l-1.97 1.97a.75.75 0 1 0 1.06 1.06l3.25-3.25a.75.75 0 0 0 0-1.06l-3.25-3.25a.75.75 0 1 0-1.06 1.06l1.97 1.97z"/>
                </svg>
                Sign Out
              </button>
            </div>
          </div>

          {/* Right Column: Heatmap & Repository Overview */}
          <div className="profile-right-column">
            
            {/* Heatmap Section */}
            <div className="profile-heatmap-card">
              <HeatMapProfile />
            </div>

            {/* Repositories Overview Section */}
            <div className="profile-repos-section">
              <div className="profile-section-title">
                <h3>Popular Repositories</h3>
                <span className="repo-count-badge">{repositories.length}</span>
              </div>

              {loading ? (
                <div className="profile-loading">
                  <div className="spinner-small"></div>
                  <span>Loading repositories...</span>
                </div>
              ) : repositories.length === 0 ? (
                <div className="profile-empty-repos">
                  <p>This user has no repositories.</p>
                </div>
              ) : (
                <div className="profile-repos-grid">
                  {repositories.slice(0, 6).map((repo) => (
                    <div key={repo._id} className="profile-repo-card">
                      <div className="profile-repo-card-header">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="repo-icon">
                          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 1 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 0 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8z"/>
                        </svg>
                        <h4 className="profile-repo-name">{repo.name}</h4>
                        <span className={`badge-visibility ${repo.visibility === false ? "private" : "public"}`}>
                          {repo.visibility === false ? "Private" : "Public"}
                        </span>
                      </div>
                      <p className="profile-repo-desc">
                        {repo.description || "No description provided."}
                      </p>
                      <div className="profile-repo-footer">
                        <span>{repo.content?.length || 0} files</span>
                        <span>•</span>
                        <span>{repo.issues?.length || 0} issues</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;

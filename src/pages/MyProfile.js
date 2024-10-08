import React, { useEffect, useState } from "react";
import { getProfile, logout, updateProfile } from "../services/ProfileService";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import PerformanceChart from "../components/PerformanceChartComponent";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [sortedSessions, setSortedSessions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "ascending" });
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    console.log("Saving profile...");
    await updateProfile(profile, profilePicture);
    setIsEditing(false);
    window.location.reload();
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getProfile();
      setProfile(profile);
      setSortedSessions(profile.analytics.sessions || []);
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile && profile.analytics.sessions) {
      let sortableSessions = [...profile.analytics.sessions];

      // Sorting logic based on the key and direction
      sortableSessions.sort((a, b) => {
        if (sortConfig.key === "date") {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sortConfig.direction === "ascending"
              ? dateA - dateB
              : dateB - dateA;
        } else if (sortConfig.key === "medianScore") {
          return sortConfig.direction === "ascending"
              ? a.medianScore - b.medianScore
              : b.medianScore - a.medianScore;
        }
        return 0;
      });

      setSortedSessions(sortableSessions);
    }
  }, [sortConfig, profile]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  const profilePictureSrc = profile.profilePicture.data
    ? `data:${profile.profilePicture.contentType};base64,${Buffer.from(
        profile.profilePicture.data
      ).toString("base64")}`
    : "images/blank-profile-picture.png";

  const handleSessionClick = (session) => {
    navigate(`/session/${session.id}`, { state: { session } });
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">Welcome! {profile.name} </h1>
      <p className="lead">View and edit your profile details.</p>
      {isEditing ? (
        <div>
          <form>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <h3>Name</h3>
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="profilePicture" className="form-label">
                <h3>Profile Picture</h3>
              </label>
              <input
                type="file"
                className="form-control"
                id="profilePicture"
                onChange={handleFileChange}
              />
            </div>
          </form>
          <button className="btn btn-primary mt-3" onClick={handleSave}>
            Save
          </button>
        </div>
      ) : (
        <div>
          <img
            src={profilePictureSrc}
            className="profile-picture"
            alt="Profile"
          />
          <div className="button-group mt-3">
            <button className="btn btn-primary" onClick={handleEdit}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <PerformanceChart sessions={sortedSessions} />

          <div className="mt-5">
            <h3>Sessions</h3>
            <table className="table">
              <thead>
              <tr>
                <th onClick={() => handleSort("date")}>
                  Date {sortConfig.key === "date" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("medianScore")}>
                  Median
                  Score {sortConfig.key === "medianScore" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
              </tr>
              </thead>
              <tbody>
              {sortedSessions &&
                  sortedSessions.map((session) => (
                      <tr
                          key={session.id}
                          onClick={() => handleSessionClick(session)}
                      >
                        <td>{new Date(session.date).toLocaleDateString()}</td>
                        <td>{session.medianScore}</td>
                      </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfile;

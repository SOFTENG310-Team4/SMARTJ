import React, { useEffect, useState } from "react";
import { getProfile, logout, updateProfile } from "../services/ProfileService";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import PerformanceChart from "../components/PerformanceChartComponent";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
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
    };

    fetchProfile();
  }, []);

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
          <button className="btn btn-primary mt-3" onClick={handleEdit}>
            Edit
          </button>
        </div>
      )}

      <button className="btn btn-primary mt-3" onClick={handleLogout}>
        Logout
      </button>

      <PerformanceChart sessions={profile.analytics.sessions} />

      <div className="mt-5">
        <h3>Sessions</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Median Score</th>
            </tr>
          </thead>
          <tbody>
            {profile.analytics.sessions &&
              profile.analytics.sessions.map((session) => (
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
  );
}

export default MyProfile;

import React, { useEffect, useState } from "react";
import {
  getProfile,
  logout,
  updateProfile,
  deleteProfile,
} from "../services/ProfileService";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import PerformanceChart from "../components/PerformanceChartComponent";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
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

  const handleDelete = async () => {
    await deleteProfile();
    handleLogout();
  };

  const confirmDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
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
    navigate(`/ProfileSession`, { state: { session } });
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
          <button
            className="btn btn-danger mt-3"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
          <button className="btn btn-danger mt-3" onClick={confirmDelete}>
            Delete Profile
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

          <PerformanceChart sessions={profile.analytics.sessions} />

          <div className="mt-5 ">
            <h3>Sessions</h3>
            <div className="session-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Median Score</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.analytics.sessions &&
                    profile.analytics.sessions
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((session) => (
                        <tr
                          key={session.id}
                          onClick={() => handleSessionClick(session)}
                        >
                          <td>{new Date(session.date).toLocaleString()}</td>
                          <td>{session.medianScore}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete your profile?</p>
          <button className="btn btn-danger" onClick={handleDelete}>
            Yes
          </button>
          <button className="btn btn-secondary" onClick={cancelDelete}>
            No
          </button>
        </div>
      )}
    </div>
  );
}

export default MyProfile;

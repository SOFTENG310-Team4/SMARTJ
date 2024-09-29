import React, { useEffect, useState } from "react";
import { getProfile, logout, updateProfile } from "../services/ProfileService";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
    await updateProfile(profile);
    setIsEditing(false);
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

  return (
    <div className="container text-center mt-5">
      {/* Main title of the profile page */}
      <h1 className="display-4">Welcome! {profile.name} </h1>
      <p className="lead">View and edit your profile details.</p>

      {isEditing ? ( // If the user is editing the profile details
        <div>
          <form>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <input
              type="text"
              value={profile.profilePicture}
              onChange={(e) =>
                setProfile({ ...profile, profilePicture: e.target.value })
              }
            />
          </form>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      ) : (
        <div>
          <img
            src={profile.profilePicture}
            class="profile-picture"
            alt="Profile"
          />
          <button className="btn btn-primary" onClick={handleEdit}>
            Edit
          </button>
        </div>
      )}

      {/* Placeholder for profile management content */}
      {/* You can add components or sections here for users to view and update their profile information */}

      <button className="btn btn-primary" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default MyProfile;

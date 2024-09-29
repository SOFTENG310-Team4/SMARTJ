import React, { useEffect, useState } from "react";
import {
  getProfile,
  logout,
  updateProfile,
  uploadProfilePicture,
} from "../services/ProfileService";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";

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
    : "images\blank-profile-picture.png";

  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">Welcome! {profile.name} </h1>
      <p className="lead">View and edit your profile details.</p>

      {isEditing ? (
        <div>
          <form>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <input type="file" onChange={handleFileChange} />
          </form>
          <button className="btn btn-primary" onClick={handleSave}>
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
          <button className="btn btn-primary" onClick={handleEdit}>
            Edit
          </button>
        </div>
      )}

      <button className="btn btn-primary" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default MyProfile;

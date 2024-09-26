import React, { useEffect, useState } from "react";
import { getProfile, logout } from "../services/UserService";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload();
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

      {/* Subtitle providing a brief description */}
      <p className="lead">View and edit your profile details.</p>

      {/* Placeholder for profile management content */}
      {/* You can add components or sections here for users to view and update their profile information */}

      <button className="btn btn-primary" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default MyProfile;

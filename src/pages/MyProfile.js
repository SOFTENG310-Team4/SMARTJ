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
import dayjs from "dayjs";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [timeRange, setTimeRange] = useState("all");
  const [tableSessions, setTableSessions] = useState([]);

  const [tableSort, setTableSort] = useState({
    column: "date",
    direction: "asc",
  });
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
      setFilteredSessions(profile.analytics.sessions || []);
      setTableSessions(profile.analytics.sessions || []);
    };

    fetchProfile();
  }, []);

  // Filter sessions based on the selected time range
  useEffect(() => {
    if (profile && profile.analytics.sessions) {
      const now = dayjs();
      let filtered = profile.analytics.sessions;

      switch (timeRange) {
        case "week":
          filtered = filtered.filter((session) =>
            dayjs(session.date).isAfter(now.subtract(1, "week"))
          );
          break;
        case "month":
          filtered = filtered.filter((session) =>
            dayjs(session.date).isAfter(now.subtract(1, "month"))
          );
          break;
        case "year":
          filtered = filtered.filter((session) =>
            dayjs(session.date).isAfter(now.subtract(1, "year"))
          );
          break;
        case "all":
        default:
          filtered = profile.analytics.sessions;
          break;
      }

      setFilteredSessions(filtered);
    }
  }, [timeRange, profile]);

  // Sort table sessions
  const handleTableSort = (column) => {
    const newDirection =
      tableSort.column === column && tableSort.direction === "asc"
        ? "desc"
        : "asc";

    const sortedSessions = [...tableSessions].sort((a, b) => {
      if (column === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return newDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (column === "medianScore") {
        return newDirection === "asc"
          ? a.medianScore - b.medianScore
          : b.medianScore - a.medianScore;
      }
      return 0;
    });

    setTableSort({ column, direction: newDirection });
    setTableSessions(sortedSessions);
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
                    <th
                      onClick={() => handleTableSort("date")}
                      style={{ cursor: "pointer" }}
                    >
                      Date{" "}
                      {tableSort.column === "date" &&
                        (tableSort.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      onClick={() => handleTableSort("medianScore")}
                      style={{ cursor: "pointer" }}
                    >
                      Median Score{" "}
                      {tableSort.column === "medianScore" &&
                        (tableSort.direction === "asc" ? "↑" : "↓")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableSessions &&
                    tableSessions.map((session) => (
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

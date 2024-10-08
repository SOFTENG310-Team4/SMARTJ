import React, { useEffect, useState } from "react";
import { getProfile, logout, updateProfile } from "../services/ProfileService";
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
  const [tableSort, setTableSort] = useState({ column: "date", direction: "asc" });

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

  const profilePictureSrc = profile.profilePicture.data
      ? `data:${profile.profilePicture.contentType};base64,${Buffer.from(
          profile.profilePicture.data
      ).toString("base64")}`
      : "images/blank-profile-picture.png";

  const handleSessionClick = (session) => {
    navigate(`/session/${session.id}`, { state: { session } });
  };

  // Handle time range change (fix for undefined issue)
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value); // Updates the state when the user selects a different time range
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

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

              {/* Time Range Selector */}
              <div className="mt-4">
                <label htmlFor="timeRange" className="form-label">
                  <h5>Filter By Time Range:</h5>
                </label>
                <select
                    id="timeRange"
                    className="form-select"
                    value={timeRange}
                    onChange={handleTimeRangeChange}
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              {/* Performance Chart with filtered data */}
              <PerformanceChart sessions={filteredSessions} />

              {/* Table Sorting */}
              <div className="mt-5">
                <h3>Sessions</h3>
                <table className="table">
                  <thead>
                  <tr>
                    <th
                        onClick={() => handleTableSort("date")}
                        style={{ cursor: "pointer" }}
                    >
                      Date {tableSort.column === "date" && (tableSort.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                        onClick={() => handleTableSort("medianScore")}
                        style={{ cursor: "pointer" }}
                    >
                      Median Score {tableSort.column === "medianScore" && (tableSort.direction === "asc" ? "↑" : "↓")}
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

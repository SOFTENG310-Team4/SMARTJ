import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "../../styles/components/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "jquery";
import "../../index.css";

import Home from "../pages/Home";
import JobFinder from "../pages/JobFinder";
import ContactUs from "../pages/ContactUs";
import MyProfile from "../pages/MyProfile";
import InterviewPractice from "../pages/InterviewPractice";
import InterviewSettings from "../pages/InterviewSettings";
import "@fortawesome/fontawesome-free/css/all.min.css";
import SummaryPage from "../pages/SummaryPage";
import Register from "../pages/Register";
import Login from "../pages/Login";
import { getProfile } from "../services/ProfileService"; // Import getProfile
import { Buffer } from "buffer";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null); // Add profile state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchProfile(); // Fetch profile data if authenticated
    }
  }, []);

  const fetchProfile = async () => {
    const profileData = await getProfile();
    setProfile(profileData);
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Navbar component for site navigation */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">
            <img
              src="images/logo.png"
              alt="Search Icon"
              width="50"
              height="50"
            />
            SMARTJ
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* Navigation links */}
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/interview-settings">
                  Interview Practice
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/job-finder">
                  Job Finder
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact-us">
                  Contact Us
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/my-profile">
                      {profile && profile.profilePicture.data ? (
                        <img
                          src={`data:${
                            profile.profilePicture.contentType
                          };base64,${Buffer.from(
                            profile.profilePicture.data
                          ).toString("base64")}`}
                          alt="Profile"
                          className="profile-picture-nav"
                        />
                      ) : (
                        "My Profile"
                      )}
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>

        {/* Main content area that renders the routes */}
        <div className="flex-grow-1">
          <Routes>
            {/* Define routes and their corresponding components */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/interview-settings" element={<InterviewSettings />} />
            <Route path="/interview-practice" element={<InterviewPractice />} />
            <Route path="/job-finder" element={<JobFinder />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/summary" element={<SummaryPage />} />
          </Routes>
        </div>

        {/* Footer component for site-wide information */}
        <footer
            className="text-center text-white mt-auto footer"
        >
          <div className="container p-4 pb-0">
            <section className="mb-4">
              {/* Social media and GitHub links */}
              <a
                className="btn btn-outline-light btn-floating m-1"
                href="#!"
                role="button"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                className="btn btn-outline-light btn-floating m-1"
                href="#!"
                role="button"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                className="btn btn-outline-light btn-floating m-1"
                href="#!"
                role="button"
              >
                <i className="fab fa-google"></i>
              </a>
              <a
                className="btn btn-outline-light btn-floating m-1"
                href="#!"
                role="button"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                className="btn btn-outline-light btn-floating m-1"
                href="#!"
                role="button"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                className="btn btn-outline-light btn-floating m-1"
                href="https://github.com/SOFTENG310-Team4/SMARTJ"
                role="button"
              >
                <i className="fab fa-github"></i>
              </a>
            </section>
          </div>

          <div
              className="text-center p-3 copyright-section"
          >
            {/* Footer copyright information */}© 2024 Copyright:
            <a
              className="text-black"
              href="https://github.com/SOFTENG310-Team4/SMARTJ/"
            >
              SMARTJ.co.nz
            </a>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

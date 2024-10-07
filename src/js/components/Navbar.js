import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {Buffer} from "buffer";
import {getProfile} from "../services/ProfileService";
import "../../styles/components/Navbar.css";

const Navbar = () => {
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
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            {/* Menu toggle for smaller screen sizes*/}
            <button
                className="navbar-toggle"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation">

                <span className="navbar-toggler-icon"></span>
            </button>

            {/* Brand */}
            <Link className="navbar-brand" to="/">
                <h1 className="nav-text">SMARTJ</h1>
            </Link>

            <div className="sm:hidden">
                {isAuthenticated ? (
                    <div className="nav-item">
                        <Link className="nav-link" to="/my-profile">
                            {profile && profile.profilePicture ? (
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
                    </div>
                ) : ( <> </> )}
            </div>

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
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
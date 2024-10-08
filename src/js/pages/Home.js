import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/Home.css";

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);


  return (
      <div className="flex container-xxl text-center mt-5 home-container">

          <div className="landing">
              <div className="landing-heading">
                  {/* Main heading for the homepage*/}
                  <h1 className="landing-primary-text">
                      SMARTJ
                  </h1>

                  {/* Introduction paragraph explaining the purpose of the application */}
                  <p className="landing-subtext">
                      Helping Active Job Seekers In Tech Prepare For <span className="gradient-text">Interviews</span>
                  </p>

                  {/* Buttons for signing up or logging in or navigation*/}
                  {isAuthenticated ? (
                      <div>
                          <div className="landing-options">
                              <div>
                                  <Link to="/interview-settings" className="primary-btn">
                                      Start Interview Practice
                                  </Link>
                              </div>
                              <div>
                                  <Link to="/job-finder" className="primary-btn">
                                      Go To Job Finder
                                  </Link>
                              </div>
                          </div>
                          <p className="landing-note-text">Jump into a new practice session or view existing jobs</p>
                      </div>
                  ) : (
                      <div>
                          <div className="landing-options">
                              <div>
                                  <Link to="/register" className="primary-btn">
                                      Sign Up For Free
                                  </Link>
                              </div>
                              <div>
                                  <Link to="/login" className="secondary-btn">
                                      Use Existing Account
                                  </Link>
                              </div>
                          </div>
                          <p className="landing-note-text">Sign Up and get Full Access to all SMARTJ tools</p>
                      </div>
                  )}
              </div>
              <img className="landing-image" src="images/landing-image.svg" alt="Landing Page Image"/>
          </div>


          <div className="placeholder-card"/>
          <div className="placeholder-card"/>
      </div>
  );
}

export default Home;

import React, { useState, useEffect } from "react";
import { loginUser } from "../services/ProfileService";
import {Link, useNavigate} from "react-router-dom";
import "../../styles/pages/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/my-profile");
    }
  }, [navigate]);

  const validate = () => {
    let valid = true;
    let errors = { email: "", password: "", general: "" };

    if (!email) {
      errors.email = "Invalid email";
      valid = false;
    }

    if (!password) {
      errors.password = "Invalid password";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await loginUser({ email, password });
        if (localStorage.getItem("token")) {
          navigate("/my-profile");
          window.location.reload();
        }
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: "Login failed. Please check your email and password.",
        }));
      }
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
      <>
        <Link className="login-home" to="/">
          <h1 className="nav-text">SMARTJ</h1>
        </Link>
        <div className="login-container">
          <div className="mt-5 login-form-container">
            <form onSubmit={handleLogin} className="login-form">
              <h1 className="login-header">Sign in</h1>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""} login-input`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""} login-input`}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
              {errors.general && (
                  <div className="alert alert-danger" role="alert">
                    {errors.general}
                  </div>
              )}
              <button type="submit" className="login-button">
                Sign in
              </button>
            </form>
            <div className="register-existing-text">
              <p className="mt-3">
                Don't have an account?{" "}
                <a href="/register" className="text-primary">
                  Sign up
                </a>
              </p>
            </div>
          </div>
          <img src="images/interview_practice.png" className="login-image"/>
        </div>
      </>
  );
}

export default Login;

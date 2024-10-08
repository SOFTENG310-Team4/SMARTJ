import React, { useState } from "react";
import { registerUser } from "../services/ProfileService";
import {Link, useNavigate} from "react-router-dom";
import "../../styles/pages/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    let errors = { name: "", email: "", password: "" };

    if (!name) {
      errors.name = "Invalid name";
      valid = false;
    }
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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (validate()) {
      var response;
      response = await registerUser({ email, password, name });
      console.log(response);
      if (response.message === "User created successfully") {
        navigate("/login");
      } else {
        alert("Same email already in use");
      }
    }
  };

  return (
      <>
        <Link className="register-home" to="/">
          <h1>SMARTJ</h1>
        </Link>
        <div className="register-container">
          <div className="mt-5 register-form-container">
            <form onSubmit={handleRegister} className="register-form">
              <h1 className="register-header">Create your account</h1>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name<span className="mandatory-field">*</span>
                </label>
                <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""} register-input`}
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                />
                {errors.name && <div className="invalid-name">{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email<span className="mandatory-field">*</span>
                </label>
                <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""} register-input`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
                {errors.email && <div className="invalid-email">{errors.email}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password<span className="mandatory-field">*</span>
                </label>
                <input
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""} register-input`}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                />
                {errors.password && (
                    <div className="invalid-password">{errors.password}</div>
                )}
              </div>
              <button type="submit" className="register-button">
                Sign Up
              </button>
            </form>
            <div className="register-existing-text">
              <p className="mt-3">
                Already have an account?{" "}
                <a href="/login" className="text-primary">
                  Login
                </a>
              </p>
            </div>
          </div>
          <img className="register-image" src="images/interview_practice.png"/>
        </div>
      </>
  );
}

export default Register;

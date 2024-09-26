import React, { useState } from "react";
import { registerUser } from "../services/UserService";
import { useNavigate } from "react-router-dom";

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
      await registerUser({ email, password, name });
      // Redirect to the login page
      navigate("/login");
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="display-4 text-center mb-5">Register</h1>

      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <div className="invalid-name">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="invalid-email">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <div className="invalid-password">{errors.password}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;

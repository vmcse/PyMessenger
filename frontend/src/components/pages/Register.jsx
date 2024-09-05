import React from "react";

import { useAuthServiceContext } from "../../auth/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./templates/Layout";

const Register = () => {
  const { register } = useAuthServiceContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password1, password2 } = formData;
    const res = await register(username, email, password1, password2);
    if (res) {
      navigate("/login");
    }
  };

  return (
    <Layout>
      <div className=" container card card-body mt-4 mb-4">
        <h1>Register</h1>

        <form className="d-flex flex-column gap-3">
          <div className="form-group mb-3">
            <label>Username</label>
            <input
              className="form-control"
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label>Email address</label>
            <input
              className="form-control"
              id="email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              className="form-control"
              id="password1"
              name="password1"
              type="password"
              value={formData.password1}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label>Confirm Password</label>
            <input
              className="form-control"
              id="password2"
              name="password2"
              type="password"
              value={formData.password2}
              onChange={handleChange}
            />
          </div>
          <div className="form-group text-center">
            <button className="btn btn-primary " onClick={handleSubmit}>
              Register
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Register;

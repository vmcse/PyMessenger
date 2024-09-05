import { useNavigate } from "react-router-dom";
import { useAuthServiceContext } from "../../auth/AuthContext";
import { useState } from "react";
import Layout from "./templates/Layout";

const Login = () => {
  const { login } = useAuthServiceContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const res = await login(email, password);
    if (res) {
      console.log(res);
    } else {
      navigate("/");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout>
      <div className="container card card-body mt-4 mb-4">
        <h1>Login</h1>

        <form className="d-flex flex-column gap-3">
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
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group text-center">
            <button className="btn btn-primary " onClick={handleSubmit}>
              Login
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Login;

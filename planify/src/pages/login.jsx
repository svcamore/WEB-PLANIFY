import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null); // Untuk error handling

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error

    try {
      const response = await axios.post(API_URL+"/auth/login", form);
      const { token } = response.data.data;

      // Simpan token ke localStorage
      localStorage.setItem("token", token);

      // Redirect ke workspace
      navigate("/workspace");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center bg-light">
      <title>Planify - Login</title>
      <div className="row w-100 justify-content-center align-items-center">
        <div className="col-lg-5 p-5">
          <div className="card shadow-lg rounded-4 p-4">
            <div className="d-flex align-items-center justify-content-center gap-1 mb-2">
              <img src="logo planify new.png" width="50" alt="Planify Logo" />
              <h5 className="fw-bold mb-0">Planify</h5>
            </div>
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-2">Welcome to Planify!</h2>
              <p className="mb-0">
                Don’t have an account?{" "}
                <a href="/sign_up">Sign up for free</a>
              </p>
            </div>

            {/* Tampilkan pesan error */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <div className="mb-1 text-end">
                  <a href="#" className="text-primary small">
                    Forget password?
                  </a>
                </div>
              </div>
              <div className="mb-3 position-relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  onClick={togglePassword}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={
                      passwordVisible
                        ? "https://img.icons8.com/ios-glyphs/24/closed-eye.png"
                        : "https://img.icons8.com/ios-glyphs/24/visible--v1.png"
                    }
                    alt="Toggle Password Visibility"
                  />
                </span>
              </div>
              <div className="d-flex justify-content-center mb-3">
                <button
                  type="submit"
                  className="btn btn-primary fw-semibold w-100 text-center"
                >
                  Login
                </button>
              </div>
            </form>

            <div className="d-flex align-items-center my-4">
              <hr className="flex-grow-1 border-1 border-muted" />
              <span className="mx-3 text-muted">Or continue with</span>
              <hr className="flex-grow-1 border-1 border-muted" />
            </div>
            <div className="text-center">
              <button className="btn btn-outline-light border shadow-sm rounded-circle">
                <img src="google.png" width="28" alt="Google Logo" />
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">
          <img
            src="gmb.png"
            alt="Illustration"
            className="img-fluid illustration-img"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

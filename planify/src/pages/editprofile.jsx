import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Tambahkan untuk navigasi
import '../pages/editprofile.css';
import Sidebar from "../components/setting/sidebar";

const AccountSettings = () => {
  const navigate = useNavigate(); // ✅ Inisialisasi navigasi
  const API_URL = process.env.REACT_APP_API_URL;
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", profileImage: "" });
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });

  const token = localStorage.getItem("token");

  const toggleNewPasswordVisibility = () => setNewPasswordVisible(!newPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);
  const handleGoBack = () => {
    navigate("/workspace"); // ✅ Kembali ke halaman workspace
  };
  const fetchUser = async () => {
    if (!token) return;

    try {
      const res = await fetch(API_URL+"/auth/user", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal fetch user");
      const data = await res.json();
      setUser(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        profileImage: data.profileImage || "" // ← ini ditambahkan
        });

    } catch (err) {
      console.error("Gagal ambil user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveChanges = async () => {
    try {
      const res = await fetch(API_URL+"/auth/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Profil berhasil diperbarui");
        fetchUser(); // refresh data
      } else {
        alert(data.message || "Gagal memperbarui profil");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Terjadi kesalahan");
    }
  };

  const handlePasswordChange = async () => {
    const { newPassword, confirmPassword } = passwordData;
    if (newPassword !== confirmPassword) {
      alert("Konfirmasi password tidak cocok");
      return;
    }

    try {
      const res = await fetch(API_URL+"/auth/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password berhasil diubah");
        setPasswordData({ newPassword: "", confirmPassword: "" });
      } else {
        alert(data.message || "Gagal mengubah password");
      }
    } catch (err) {
      console.error("Password update error:", err);
      alert("Terjadi kesalahan");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("image", file);
    formDataUpload.append("nameFolder", "PROFILE");

    try {
        const res = await fetch(API_URL+"/upload?nameFolder=PROFILE", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formDataUpload
        });

        const data = await res.json();
        if (res.ok && data.url) {
        setFormData(prev => ({ ...prev, profileImage: data.url }));
        console.log(formData.profileImage)
        // Opsional langsung update ke database juga:
        await fetch(API_URL+"/auth/user", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ photo_profile: data.url })
        });

        alert("Foto profil berhasil diperbarui");
        } else {
        alert(data.message || "Gagal upload gambar");
        }
    } catch (err) {
        console.error("Upload error:", err);
        alert("Terjadi kesalahan saat upload gambar");
    }
    };


  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          {/* ✅ Tombol kembali */}
              <button
                className="back-arrow me-3"
                onClick={handleGoBack}
                aria-label="Go back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-arrow-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                  />
                </svg>
              </button>
          <h2 className="mb-4 text-primary fw-bold">Account Settings</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 mb-4">
          <Sidebar />
        </div>

        <div className="col-md-9">
          <div className="content-area">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Profile</h3>
              <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
            </div>
            <div className="profile-picture-wrapper">
                {
                    user ?(
                    <img
                        className="user-avatar profile-picture"
                        src={formData.profileImage ? "http://127.0.0.1:3000"+formData.profileImage:"http://127.0.0.1:3000"+user.photo_profile}
                        alt={user.name}
                    />
                    ):(
                    <p>Loading...</p>
                    )
                }
                <label className="upload-overlay">
                    Ganti Foto
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                    />
                </label>
                </div>


            <div className="row mb-4">
              <div className="col-md-12 mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-12">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
            </div>

            <div className="mt-5">
              <h4 className="mb-4">Change Password</h4>

              <div className="row">
                <div className="col-md-12 mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <div className="password-field">
                    <input
                      type={newPasswordVisible ? 'text' : 'password'}
                      className="form-control"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                    <span className="password-toggle" onClick={toggleNewPasswordVisibility}>👁️</span>
                  </div>
                </div>

                <div className="col-md-12">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <div className="password-field">
                    <input
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      className="form-control"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                    <span className="password-toggle" onClick={toggleConfirmPasswordVisibility}>👁️</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-end">
                <button className="btn btn-warning" onClick={handlePasswordChange}>Update Password</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

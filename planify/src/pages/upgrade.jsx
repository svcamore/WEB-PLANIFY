import React, { useState, useEffect } from "react";
import Sidebar from "../components/setting/sidebar";
import "../pages/upgrade.css";
import PaymentPage from "./paymentUp";
import { useNavigate } from "react-router-dom";
const AccountSettings = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate(); // ✅ Inisialisasi navigasi
  const [activeTab, setActiveTab] = useState("upgrade");
  const [plan, setPlan] = useState("monthly");
  const [showModal, setShowModal] = useState(false);
  const [proofImage, setProofImage] = useState(null);
  const [user, setUser] = useState(null);
  const handleGoBack = () => {
    navigate("/workspace"); // ✅ Kembali ke halaman workspace
  };
  const fetchUser = async () => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
    if (!token) return;

    try {
      const res = await fetch(API_URL+"/auth/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal fetch user");
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Gagal ambil user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  },[])

  const openUpgradeModal = () => setShowModal(true);
  const closeUpgradeModal = () => {
    setShowModal(false);
    setProofImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProofImage(file);
  };

  const handleSubmitProof = async () => {
    if (!proofImage) {
      alert("Silakan upload bukti pembayaran terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("amount", 75000);
    formData.append("payment_method", "transfer");
    formData.append("payment_date", new Date().toISOString().split("T")[0]);
    formData.append("image", proofImage); // dari <input type="file" />

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/payments?nameFolder=PAYMENTS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload gagal");

      alert("Bukti pembayaran berhasil dikirim. Admin akan memproses.");
      closeUpgradeModal();
    } catch (err) {
      console.error(err);
      alert("Gagal upload bukti. Coba lagi nanti.");
    }
  };


  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <title>Account Settings</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        rel="stylesheet"
      />
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
            <h2 className="mb-4 text-primary fw-bold">Account settings</h2>
          </div>
        </div>

        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-4">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            <div className="content-area">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <h3 className="mb-0">Upgrade Your Plan</h3>
                </div>
              </div>

              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="plan-card">
                    <h3>
                      Rp. 50.000,00 <small className="text-muted">/LifeTime</small>
                    </h3>
                    <p className="text-muted">
                      Level up productivity and creativity with expanded access
                    </p>
                    <ul className="list-unstyled text-start">
                      <li>
                        <span className="check-icon">✔</span>Customize card backgrounds
                      </li>
                    </ul>
                    {/* <button className="btn btn-select" onClick={() => setPlan("monthly")}>
                      Select Plan
                    </button> */}
                  </div>
                </div>
              </div>
              {
                (user && user.tier !== "premium") && (
                  <button className="btn btn-primary btn-upgrade" onClick={openUpgradeModal}>
                    Upgrade
                  </button>
                )
              }
            </div>
          </div>
        </div>
      </div>
{showModal && (
  <div
  className="modal-overlay"
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1050,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px", // agar ada space kalau konten terlalu tinggi
    boxSizing: "border-box",
  }}
>
  <div
    className="modal-content"
    style={{
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      width: "100%",
      maxWidth: "500px",
      maxHeight: "90vh", // batas tinggi
      overflowY: "auto",  // scroll saat konten tinggi
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
      position: "relative",
    }}
  >
    <button
        onClick={() => setShowModal(false)}
        aria-label="Close Payment Container"
        style={{
          position: "absolute",
          top: 0,
          right: 10,
          background: "transparent",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          color: "#333",
          fontWeight: "bold",
          lineHeight: 1,
        }}
      >
        &times;
      </button>
    <PaymentPage onSubmit={() => setShowModal(false)} />
  </div>
</div>

)}


    </>
  );
};

export default AccountSettings;

import React, { useState } from "react";
import "./PaymentPage.css"; // Tetap gunakan file CSS eksternal

const PaymentPage = ({onSubmit}) => {
  const [preview, setPreview] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const [proofImage, setProofImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setProofImage(file);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleConfirmPayment = async () => {
    if (!proofImage) {
      alert("Silakan upload bukti pembayaran terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("amount", 50000);
    formData.append("payment_method", "transfer");
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
      setIsModalOpen(true); // Open the modal
      alert("Bukti pembayaran berhasil dikirim. Admin akan memproses.");
      onSubmit();
    } catch (err) {
      console.error(err);
      alert("Gagal upload bukti. Coba lagi nanti.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!isOpen) return null; // jika ditutup, tidak tampilkan container

  return (
    <div className="payment-container" style={{ position: "relative" }}>
      <title>Planify - Payment</title>
      <div className="payment-content">
        {/* Kiri */}
        <div className="left-panel">
          <div className="header">
            <div
              aria-label="Planify logo"
              className="logo d-flex align-items-center mb-2"
            >
              <img
                src="/logo%20planify%20new.png"
                alt="Planify Logo"
                width="36"
                height="36"
                className="me-2"
              />
              Planify
            </div>
            <h2>Upgrade your Plan</h2>
          </div>

          <div
            className="plan-info"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ fontSize: "24px" }}>Rp50.000,00/month</h2>
            <p>Level up productivity and creativity with expanded access</p>
            <ul className="features-list">
              <li>
                <span className="check">✔</span> Access to group chat
              </li>
              <li>
                <span className="check">✔</span> Customize card backgrounds
              </li>
              <li>
                <span className="check">✔</span> Connect with multiple friends
                at once
              </li>
            </ul>
          </div>

          <div className="order-summary" style={{ marginTop: "20px" }}>
            <h3>Order summary</h3>
            <p>Planify Premium Subscription</p>
            <p>Billed monthly</p>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <span>Rp50.000,00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tax</span>
              <span>Rp0,00</span>
            </div>
            <hr />
            <h4 style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Total due today</span>
              <span>Rp50.000,00</span>
            </h4>
          </div>
        </div>

        {/* Kanan */}
        <div className="right-panel">
          {/* <div className="contact-info">
            <h3>Contact Information</h3>
            <input
              type="email"
              placeholder="Email"
            />
            <input
              type="tel"
              placeholder="628000000"
            />
          </div> */}

          <div className="payment-info">
            <h3>Quick and easy payment</h3>
            <p>
              Scan the QR code to go Premium — it's fast, secure, and
              hassle-free!
            </p>

            <input
              type="file"
              accept="image/*"
              className="form-control qr-code-upload"
              onChange={handleFileChange}
            />

            {preview && (
              <img
                src={preview}
                alt="QR Preview"
                className="qr-code"
                style={{
                  maxWidth: "200px",
                  height: "auto",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  marginTop: "12px",
                }}
              />
            )}
          </div>

          <div className="payment-confirmation">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                className="confirm-btn txt-center"
                onClick={handleConfirmPayment}
              >
                I've Paid
              </button>
            </div>

            <button className="btn">Payment Failed? Tap Here</button>
          </div>
        </div>
      </div>

      {/* Modal for Payment Confirmation */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Thank you for your payment!</h2>
            <p>
              After scanning the QR code, please wait a moment while we confirm
              your payment.
            </p>
            <button
              className="btn-enjoy"
              onClick={() => (window.location.href = "/workspace")}
            >
              Enjoy Premium Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;

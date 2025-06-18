import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaFolder,
  FaUser,
  FaPaperPlane,
  FaEllipsisV,
  FaTimes,
} from "react-icons/fa"; // Using react-icons for better icon management

const Dashboard = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const res = await fetch(API_URL + "/auth/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user data.");
      }

      const data = await res.json();
      setUser(data);
      if (data.tier && data.tier.toLowerCase() !== "admin") {
        navigate("/");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to load user information.");
      navigate("/"); // Redirect on user fetch error or unauthorized
    }
  };

  const fetchPayments = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear previous errors

    try {
      const res = await fetch(API_URL + "/payments/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to retrieve payment data.");
      }

      const json = await res.json();
      setPayments(json.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to load payment history.");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const confirmPayment = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/payments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "confirmed" }),
      });

      if (!response.ok) {
        throw new Error("Failed to confirm payment.");
      }
      alert("Payment successfully confirmed!");
      fetchPayments();
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Error confirming payment. Please try again.");
    }
  };

  const rejectPayment = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/payments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject payment.");
      }
      alert("Payment successfully rejected!");
      fetchPayments();
    } catch (error) {
      console.error("Error rejecting payment:", error);
      alert("Error rejecting payment. Please try again.");
    }
  };

  const fetchPaymentDetail = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/payments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch payment details.");
      const json = await res.json();
      setSelectedPayment(json.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching payment details:", error);
      alert("Failed to load payment details. Please try again.");
    }
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.fontFamily = "'Inter', sans-serif";
    document.body.style.backgroundColor = "#f0f2f5"; // Lighter background
    document.body.style.color = "#333"; // Darker text for better contrast
    fetchUser();
    fetchPayments();
  }, []);

  // Inline styles for better organization and readability
  const styles = {
    header: {
      backgroundColor: "#ffffff",
      display: "flex",
      alignItems: "center",
      padding: "15px 30px", // Increased padding
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Subtle shadow
      gap: "10px",
    },
    headerImg: {
      width: "40px", // Larger logo
      height: "40px",
    },
    logoText: {
      fontWeight: 700, // Bolder
      fontSize: "24px", // Larger
      color: "#333",
    },
    title: {
      flexGrow: 1,
      fontWeight: 700,
      fontSize: "24px",
      color: "#1a73e8",
      textAlign: "center",
    },
    signout: {
      fontSize: "14px",
      color: "#7a7a9d",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      padding: "8px 12px",
      borderRadius: "5px",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#f0f0f0",
      },
    },
    signoutIcon: {
      fontSize: "16px",
    },
    main: {
      padding: "30px 20px", // Increased padding
      maxWidth: "1200px", // Wider content area
      margin: "20px auto", // Centered with margin top
      backgroundColor: "#ffffff", // White background for main content
      borderRadius: "12px", // Rounded corners
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // More prominent shadow
    },
    welcomeSection: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "20px", // Increased gap
      marginBottom: "30px", // Increased margin
    },
    helloAdmin: {
      backgroundColor: "#1a4ed8",
      color: "#fff",
      borderRadius: "10px", // More rounded
      padding: "20px 25px", // Increased padding
      width: "280px", // Wider
      minHeight: "100px", // Taller
      fontWeight: 600,
      fontSize: "24px", // Larger text
      lineHeight: 1.3,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    helloAdminSmall: {
      display: "block",
      fontWeight: 400,
      fontSize: "12px",
      marginTop: "8px", // More space
      color: "#d9e1ff",
    },
    navButtons: {
      backgroundColor: "#fef9f8",
      borderRadius: "15px", // More rounded
      padding: "15px 20px",
      display: "flex",
      alignItems: "center",
      gap: "20px", // Increased gap
      width: "fit-content",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    },
    navButtonContainer: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 15px",
      borderRadius: "8px",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#e6eaf3",
      },
      backgroundColor: "transparent", // Default
    },
    navButtonContainerActive: {
      backgroundColor: "#e6eaf3", // Active state background
      color: "#1a73e8",
    },
    navButtonIcon: {
      fontSize: "20px",
      color: "#1a73e8", // Blue icons
    },
    navButtonText: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#333",
    },
    statsContainer: {
      display: "grid", // Using grid for better layout
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Responsive columns
      gap: "20px", // Increased gap
      marginBottom: "40px", // More space below
      justifyContent: "center",
    },
    statBox: {
      backgroundColor: "#fef9f8",
      borderRadius: "10px", // More rounded
      padding: "15px", // Increased padding
      textAlign: "center",
      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
      border: "1px solid #e0e0e0", // Subtle border
    },
    statLabel: {
      backgroundColor: "#a7baff",
      color: "#fff",
      fontSize: "14px", // Slightly larger
      fontWeight: 600,
      padding: "8px 0",
      borderRadius: "8px 8px 0 0", // More rounded corners
      userSelect: "none",
    },
    statValue: {
      backgroundColor: "#1a4ed8",
      color: "#fef9f8",
      fontWeight: 700, // Bolder
      fontSize: "28px", // Larger value
      padding: "10px 0",
      borderRadius: "0 0 8px 8px",
      userSelect: "none",
    },
    paymentHistory: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "25px", // Increased padding
      boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
      border: "1px solid #e0e0e0",
    },
    paymentHistoryTitle: {
      color: "#1a4ed8",
      fontWeight: 700,
      fontSize: "20px", // Larger title
      marginBottom: "20px", // More space
      borderBottom: "2px solid #e6eaf3", // Underline
      paddingBottom: "10px",
    },
    table: {
      width: "100%",
      borderCollapse: "separate", // For rounded corners on cells
      borderSpacing: "0 8px", // Space between rows
      fontSize: "14px",
      color: "#4a4a4a",
    },
    tableHeader: {
      backgroundColor: "#e6eaf3", // Light blue header
      borderRadius: "8px", // Rounded header
    },
    tableHeaderCell: {
      fontWeight: 600,
      padding: "12px 10px", // Increased padding
      textAlign: "left",
      color: "#1a4ed8", // Blue header text
      "&:first-child": {
        borderTopLeftRadius: "8px",
        borderBottomLeftRadius: "8px",
      },
      "&:last-child": {
        borderTopRightRadius: "8px",
        borderBottomRightRadius: "8px",
      },
    },
    tableBodyRow: {
      backgroundColor: "#fefefe", // Slightly off-white for rows
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: "translateY(-2px)", // Subtle lift on hover
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
    },
    tableBodyCell: {
      padding: "12px 10px",
      // borderBottom: "1px solid #d9d9d9", // Removed bottom border for spacing
    },
    status: {
      textAlign: "center",
    },
    statusPending: {
      backgroundColor: "#fff3cd", // Yellowish background
      color: "#856404", // Darker yellow text
      border: "1px solid #ffeeba",
      borderRadius: "16px", // More rounded
      padding: "4px 12px",
      fontWeight: 600,
      fontSize: "11px",
      display: "inline-block",
      minWidth: "70px",
    },
    statusPaid: {
      backgroundColor: "#d4edda", // Greenish background
      color: "#155724", // Darker green text
      border: "1px solid #c3e6cb",
      borderRadius: "16px",
      padding: "4px 12px",
      fontWeight: 600,
      fontSize: "11px",
      display: "inline-block",
      minWidth: "70px",
    },
    statusFailed: {
      backgroundColor: "#f8d7da", // Reddish background
      color: "#721c24", // Darker red text
      border: "1px solid #f5c6cb",
      borderRadius: "16px",
      padding: "4px 12px",
      fontWeight: 600,
      fontSize: "11px",
      display: "inline-block",
      minWidth: "70px",
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
    },
    confirmButton: {
      backgroundColor: "#28a745",
      color: "#fff",
      padding: "8px 12px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#218838",
      },
    },
    rejectButton: {
      backgroundColor: "#dc3545",
      color: "#fff",
      padding: "8px 12px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#c82333",
      },
    },
    detailButton: {
      backgroundColor: "#007bff", // Blue for detail
      color: "#fff",
      padding: "8px 12px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#0056b3",
      },
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: "20px",
      overflowY: "auto",
    },
    modalContent: {
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "12px",
      maxWidth: "600px",
      width: "100%",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
      position: "relative",
    },
    modalCloseButton: {
      position: "absolute",
      top: "15px",
      right: "15px",
      backgroundColor: "transparent",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
      color: "#555",
      "&:hover": {
        color: "#333",
      },
    },
    modalTitle: {
      marginBottom: "20px",
      color: "#1a4ed8",
      fontSize: "22px",
      borderBottom: "1px solid #eee",
      paddingBottom: "10px",
    },
    modalDetailText: {
      marginBottom: "10px",
      fontSize: "16px",
      color: "#333",
    },
    modalImage: {
      maxWidth: "100%",
      marginTop: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    closeModalButton: {
      marginTop: "30px",
      padding: "10px 20px",
      backgroundColor: "#6c757d", // Grey close button
      color: "#fff",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#5a6268",
      },
    },
    loadingMessage: {
      textAlign: "center",
      padding: "20px",
      fontSize: "18px",
      color: "#555",
    },
    errorMessage: {
      textAlign: "center",
      padding: "20px",
      fontSize: "18px",
      color: "#dc3545",
      backgroundColor: "#f8d7da",
      borderRadius: "8px",
      margin: "20px 0",
      border: "1px solid #f5c6cb",
    },
  };

  return (
    <div>
      <title>Planify - Admin Dashboard</title>
      <header style={styles.header}>
        <img
          alt="Blue square icon with white checkmark inside"
          style={styles.headerImg}
          src="/logo%20planify%20new.png"
        />
        <div style={styles.logoText}>Planify</div>
        <div style={styles.title}>Admin Dashboard</div>
        <a style={styles.signout} onClick={handleLogout}>
          <FaSignOutAlt style={styles.signoutIcon} /> Sign Out
        </a>
      </header>

      <main style={styles.main}>
        <section style={styles.welcomeSection}>
          <div
            aria-label="Welcome message"
            style={styles.helloAdmin}
            role="region"
          >
            Hello Admin!
            <small style={styles.helloAdminSmall}>
              We are very happy to help you!
            </small>
          </div>

          <nav style={styles.navButtons}>
            <div
              style={{
                ...styles.navButtonContainer,
                ...styles.navButtonContainerActive,
              }}
              onClick={() => navigate("/dshbrd_Admin")}
            >
              <FaFolder style={styles.navButtonIcon} />
              <span style={styles.navButtonText}>Dashboard</span>
            </div>

            <div
              style={styles.navButtonContainer}
              onClick={() => navigate("/userManagement")}
            >
              <FaUser style={styles.navButtonIcon} />
              <span style={styles.navButtonText}>Users</span>
            </div>

            <div
              style={styles.navButtonContainer}
              onClick={() => navigate("/send_Admin")}
            >
              <FaPaperPlane style={styles.navButtonIcon} />
              <span style={styles.navButtonText}>Send Notification</span>
            </div>
          </nav>
        </section>

        <section aria-label="Statistics summary" style={styles.statsContainer}>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Total Users</div>
            <div style={styles.statValue}>450</div> {/* Placeholder data */}
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Notifications Sent</div>
            <div style={styles.statValue}>5,667</div> {/* Placeholder data */}
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Payments Processed</div>
            <div style={styles.statValue}>4,350</div> {/* Placeholder data */}
          </div>
        </section>

        <section aria-label="Payment History" style={styles.paymentHistory}>
          <h2 style={styles.paymentHistoryTitle}>Payment History</h2>

          {loading ? (
            <p style={styles.loadingMessage}>Loading payments...</p>
          ) : error ? (
            <p style={styles.errorMessage}>{error}</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableHeaderCell}>Name</th>
                  <th style={styles.tableHeaderCell}>Email</th>
                  <th style={styles.tableHeaderCell}>Date</th>
                  <th style={styles.tableHeaderCell}>Time</th>
                  <th style={styles.tableHeaderCell}>Status</th>
                  <th style={styles.tableHeaderCell}>Amount</th>
                  <th style={styles.tableHeaderCell}>Actions</th>
                  <th style={styles.tableHeaderCell}>Details</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No payment data available.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} style={styles.tableBodyRow}>
                      <td style={styles.tableBodyCell}>
                        {payment.user_name}
                      </td>
                      <td style={styles.tableBodyCell}>
                        {payment.user_email}
                      </td>
                      <td style={styles.tableBodyCell}>
                        {new Date(payment.payment_date).toLocaleDateString(
                          "en-US",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </td>
                      <td style={styles.tableBodyCell}>
                        {new Date(payment.created_at).toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </td>
                      <td style={styles.status}>
                        {payment.status === "pending" && (
                          <span style={styles.statusPending}>Pending</span>
                        )}
                        {payment.status === "confirmed" && (
                          <span style={styles.statusPaid}>Paid</span>
                        )}
                        {payment.status === "rejected" && (
                          <span style={styles.statusFailed}>Failed</span>
                        )}
                      </td>
                      <td style={styles.tableBodyCell}>
                        Rp. {parseInt(payment.amount).toLocaleString("id-ID")}
                      </td>
                      <td style={styles.actionButtons}>
                        {payment.status === "pending" && (
                          <>
                            <button
                              style={styles.confirmButton}
                              onClick={() => confirmPayment(payment.id)}
                            >
                              Confirm
                            </button>
                            <button
                              style={styles.rejectButton}
                              onClick={() => rejectPayment(payment.id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {payment.status !== "pending" && (
                          <button style={styles.detailButton} disabled>
                            Actioned
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          style={styles.detailButton}
                          onClick={() => fetchPaymentDetail(payment.id)}
                        >
                          <FaEllipsisV />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </section>
      </main>

      {showModal && selectedPayment && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button
              onClick={() => setShowModal(false)}
              style={styles.modalCloseButton}
            >
              <FaTimes />
            </button>
            <h3 style={styles.modalTitle}>Payment Details</h3>
            <p style={styles.modalDetailText}>
              <strong>Name:</strong> {selectedPayment.name}
            </p>
            <p style={styles.modalDetailText}>
              <strong>Email:</strong> {selectedPayment.email}
            </p>
            <p style={styles.modalDetailText}>
              <strong>Date:</strong>{" "}
              {new Date(selectedPayment.payment_date).toLocaleDateString(
                "en-US",
                { day: "numeric", month: "long", year: "numeric" }
              )}
            </p>
            <p style={styles.modalDetailText}>
              <strong>Time:</strong>{" "}
              {new Date(selectedPayment.created_at).toLocaleTimeString(
                "en-US",
                { hour: "2-digit", minute: "2-digit" }
              )}
            </p>
            <p style={styles.modalDetailText}>
              <strong>Status:</strong> {selectedPayment.status}
            </p>
            <p style={styles.modalDetailText}>
              <strong>Amount:</strong> Rp.{" "}
              {parseInt(selectedPayment.amount).toLocaleString("id-ID")}
            </p>
            <p style={styles.modalDetailText}>
              <strong>Payment Proof:</strong>
            </p>
            <img
              src={"http://127.0.0.1:3000/uploads/" + selectedPayment.image}
              alt="Payment Proof"
              style={styles.modalImage}
            />
            <button
              onClick={() => setShowModal(false)}
              style={styles.closeModalButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
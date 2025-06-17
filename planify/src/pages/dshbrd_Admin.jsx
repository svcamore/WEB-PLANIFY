import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
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
      // Cek tier
      if (data.tier && data.tier.toLowerCase() !== "admin") {
        navigate("/");
      }
    } catch (err) {
      console.error("Gagal ambil user:", err);
    }
  };
  const fetchPayments = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_URL+"/payments/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil data pembayaran");

      const json = await res.json();
      setPayments(json.data); // ✅ ambil array-nya langsung dari `data`
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  const confirmPayment = async (id) => {
    console.log(id)
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
        throw new Error("Gagal mengonfirmasi pembayaran");
      }
      alert("Pembayaran Berhasil di Konfirmasi");
      fetchPayments();
    } catch (error) {
      console.error("Error saat mengonfirmasi pembayaran:", error);
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
        throw new Error("Gagal menolak pembayaran");
      }
      alert("Pembayaran Berhasil ditolak")
      fetchPayments();
      // console.log(`Pembayaran ${id} berhasil ditolak.`);
    } catch (error) {
      console.error("Error saat menolak pembayaran:", error);
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
      if (!res.ok) throw new Error("Gagal ambil detail pembayaran");
      const json = await res.json();
      setSelectedPayment(json.data); // pastikan backend mengembalikan `data`
      setShowModal(true);
    } catch (error) {
      console.error("Gagal fetch detail pembayaran:", error);
    }
  };


  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.fontFamily = "'Inter', sans-serif";
    document.body.style.backgroundColor = "#e6eaf3";
    document.body.style.color = "#000";
    fetchUser();
    fetchPayments();
  }, []);

  const styles = {
    a: {
      textDecoration: "none",
    },
    header: {
      backgroundColor: "#fef9f8",
      display: "flex",
      alignItems: "center",
      padding: "10px 20px",
      gap: "8px",
    },
    headerImg: {
      width: "32px",
      height: "32px",
    },
    logoText: {
      fontWeight: 600,
      fontSize: "20px",
      color: "#000",
    },
    title: {
      flexGrow: 1,
      fontWeight: 600,
      fontSize: "20px",
      color: "#1a73e8",
      textAlign: "center",
    },
    signout: {
      fontSize: "12px",
      color: "#7a7a9d",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      cursor: "pointer",
    },
    signoutIcon: {
      fontSize: "14px",
    },
    main: {
      padding: "20px 16px 40px",
      maxWidth: "900px",
      margin: "0 auto",
    },
    helloAdmin: {
      backgroundColor: "#1a4ed8",
      color: "#fff",
      borderRadius: "8px",
      padding: "12px 16px",
      width: "200px",
      height: "80px",
      fontWeight: 600,
      fontSize: "20px",
      lineHeight: 1.2,
      marginBottom: "20px",
    },
    helloAdminSmall: {
      display: "block",
      fontWeight: 400,
      fontSize: "10px",
      marginTop: "4px",
      color: "#d9e1ff",
    },
    navButtons: {
      backgroundColor: "#fef9f8",
      borderRadius: "12px",
      padding: "15px 16px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      Width: "fit-content",
      marginBottom: "24px",
    },
    btnDashboard: {
      cursor: "pointer",
      padding: "6px",
    },
    btnDashboardIcon: {
      fontSize: "22px",
    },
    userContainer: {
      display: "flex",
      alignItems: "center",
      background: "linear-gradient(90deg, #0038ff, #004bff)",
      borderRadius: "20px",
      padding: "10px 20px",
      color: "white",
      gap: "12px",
      cursor: "pointer",
    },
    iconUser: {
      color: "#0022ff",
      fontSize: "22px",
      backgroundColor: "transparent",
      border: "none",
    },
    textContainer: {
      display: "flex",
      flexDirection: "column",
      fontSize: "15px",
      fontWeight: "500",
    },
    iconSend: {
      fontSize: "22px",
      color: "#0022ff",
      cursor: "pointer",
      backgroundColor: "transparent",
      border: "none",
    },
    statsContainer: {
      display: "flex",
      gap: "16px",
      justifyContent: "center",
      marginBottom: "32px",
      flexWrap: "wrap",
    },
    statBox: {
      backgroundColor: "#fef9f8",
      borderRadius: "8px",
      width: "28%",
      minWidth: "160px",
      padding: "12px 0 16px",
      textAlign: "center",
    },
    statLabel: {
      backgroundColor: "#a7baff",
      color: "#fef9f8",
      fontSize: "12px",
      fontWeight: 600,
      padding: "6px 0",
      borderRadius: "4px 4px 0 0",
      userSelect: "none",
    },
    statValue: {
      backgroundColor: "#1a4ed8",
      color: "#fef9f8",
      fontWeight: 600,
      fontSize: "20px",
      padding: "8px 0",
      borderRadius: "0 0 4px 4px",
      userSelect: "none",
    },
    paymentHistory: {
      backgroundColor: "#fef9f8",
      borderRadius: "8px",
      padding: "20px 24px 24px",
    },
    paymentHistoryTitle: {
      color: "#1a4ed8",
      fontWeight: 700,
      fontSize: "16px",
      margin: "0 0 16px 0",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "12px",
      color: "#4a4a4a",
    },
    tableHeader: {
      borderBottom: "1px solid #a7baff",
    },
    tableHeaderCell: {
      fontWeight: 600,
      paddingBottom: "8px",
      textAlign: "left",
    },
    tableBodyRow: {
      borderBottom: "1px solid #d9d9d9",
    },
    tableBodyCell: {
      padding: "8px 0",
    },
    status: {
      textAlign: "center",
    },
    statusPending: {
      backgroundColor: "#f7f9d9",
      color: "#a3a92f",
      border: "1px solid #a3a92f",
      borderRadius: "12px",
      padding: "2px 10px",
      fontWeight: 600,
      fontSize: "10px",
      display: "inline-block",
      minWidth: "60px",
    },
    statusPaid: {
      backgroundColor: "#d9f7d9",
      color: "#2fa34f",
      border: "1px solid #2fa34f",
      borderRadius: "12px",
      padding: "2px 10px",
      fontWeight: 600,
      fontSize: "10px",
      display: "inline-block",
      minWidth: "60px",
    },
    statusFailed: {
      backgroundColor: "#f9d9d9",
      color: "#a32f2f",
      border: "1px solid #a32f2f",
      borderRadius: "12px",
      padding: "2px 10px",
      fontWeight: 600,
      fontSize: "10px",
      display: "inline-block",
      minWidth: "60px",
    },
    confirmButton: {
      backgroundColor: '#28a745',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    rejectButton: {
      backgroundColor: '#dc3545',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      color: '#fff'
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    detailButton: {
      backgroundColor: '#0000ff',
      color:"#fff",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
  };

  return (
    <div>
      <header style={styles.header}>
         <title>Planify - Admin</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-yada..."
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <img
          alt="Blue square icon with white checkmark inside"
          style={styles.headerImg}
          src="/logo%20planify%20new.png"
        />
        <div style={styles.logoText}>Planify</div>
        <div style={styles.title}>Dashboard</div>
        <a style={styles.signout} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt" style={styles.signoutIcon}></i>{" "}
          Sign Out
        </a>
      </header>
      <main style={styles.main}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
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
              style={styles.userContainer}
              onClick={() => (window.location.href = "/dshbrd_Admin")}
            >
              <i className="fas fa-folder" style={styles.btnDashboardIcon}></i>
              <div style={styles.textContainer}>
                <span>Dashboard</span>
              </div>
            </div>

            <button
              style={styles.iconUser}
              onClick={() => (window.location.href = "/userManagement")}
            >
              <i className="fas fa-user" style={styles.iconUser}></i>
            </button>

            <button
              style={styles.iconSend}
              onClick={() => (window.location.href = "/send_Admin")}
            >
              <i className="fas fa-paper-plane" style={styles.iconSend}></i>
            </button>
          </nav>
        </div>

        <section aria-label="Statistics summary" style={styles.statsContainer}>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>User</div>
            <div style={styles.statValue}>450</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Notification Sent</div>
            <div style={styles.statValue}>5.667</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Checks Made</div>
            <div style={styles.statValue}>4.350</div>
          </div>
        </section>
        <section aria-label="Payment History" style={styles.paymentHistory}>
          <h2 style={styles.paymentHistoryTitle}>Payment History</h2>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Name</th>
                <th style={styles.tableHeaderCell}>Email</th>
                <th style={styles.tableHeaderCell}>Date</th>
                <th style={styles.tableHeaderCell}>Time</th>
                <th style={styles.tableHeaderCell}>Status</th>
                <th style={styles.tableHeaderCell}>Payment Amount</th>
                <th style={styles.tableHeaderCell}>Action</th>
                <th style={styles.tableHeaderCell}>Detail</th>
              </tr>
            </thead>
            <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "10px" }}>
                  Tidak ada data pembayaran.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} style={styles.tableBodyRow}>
                  <td style={styles.tableBodyCell}>{payment.user_name}</td>
                  <td style={styles.tableBodyCell}>{payment.user_email}</td>
                  <td style={styles.tableBodyCell}>{new Date(payment.payment_date).toLocaleDateString("id-ID",{day: "numeric",month: "long",year: "numeric"})}</td>
                  <td style={styles.tableBodyCell}>{new Date(payment.created_at).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})}</td>
                  <td style={styles.status}>
                    {payment.status === "pending" ? (
                      <span style={styles.statusPending}>Pending</span>
                    ) : payment.status === "confirmed" ? (
                      <span style={styles.statusPaid}>Paid</span>
                    ) : (
                      <span style={styles.statusFailed}>Failed</span>
                    )}
                  </td>
                  <td style={styles.tableBodyCell}>Rp. {payment.amount}</td>
                  <td>
                    <button style={styles.confirmButton} onClick={() => confirmPayment(payment.id)}>Confirm</button>
                    <button style={styles.rejectButton} onClick={() => rejectPayment(payment.id)}>Reject</button>
                  </td>
                  <td>
                    <button style={styles.detailButton} onClick={() => fetchPaymentDetail(payment.id)}>Detail</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          </table>
        </section>
      </main>
      {showModal && selectedPayment && (
    <div style={{
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.6)", display: "flex",
  justifyContent: "center", alignItems: "center", zIndex: 1000,
  overflowY: "auto", padding: "20px" // agar ada ruang saat di-scroll
}}>
  <div style={{
    backgroundColor: "white", padding: "20px", borderRadius: "8px",
    maxWidth: "500px", width: "100%", maxHeight: "90vh", overflowY: "auto"
  }}>
    <h3 style={{ marginBottom: "10px" }}>Detail Pembayaran</h3>
    <p><strong>Nama:</strong> {selectedPayment.name}</p>
    <p><strong>Email:</strong> {selectedPayment.email}</p>
    <p><strong>Tanggal:</strong> {new Date(selectedPayment.payment_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
    <p><strong>Waktu:</strong> {new Date(selectedPayment.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</p>
    <p><strong>Status:</strong> {selectedPayment.status}</p>
    <p><strong>Jumlah:</strong> Rp. {selectedPayment.amount}</p>
    <p><strong>Bukti Pembayaran:</strong></p>
    <img src={"http://127.0.0.1:3000/uploads/" + selectedPayment.image} alt="Bukti Pembayaran" style={{ maxWidth: "100%", marginTop: "10px" }} />
    <br />
    <button onClick={() => setShowModal(false)} style={{ marginTop: "20px", padding: "8px 16px" }}>Tutup</button>
  </div>
</div>

  )}

    </div>
  );
};

export default Dashboard;

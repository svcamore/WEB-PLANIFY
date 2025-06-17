import React, { useEffect } from "react";

const UserManagement = () => {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.fontFamily = "'Inter', sans-serif";
    document.body.style.backgroundColor = "#e6eaf3";
    document.body.style.color = "#000";
  }, []);

  const styles = {
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
    },
    helloAdminSmall: {
      display: "block",
      fontWeight: 400,
      fontSize: "10px",
      marginTop: "4px",
      color: "#d9e1ff",
    },
    navButtons: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#fefefe",
      padding: "8px 16px",
      borderRadius: "20px",
      width: "fit-content",
      gap: "10px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    btnDashboard: {
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "6px",
    },
    btnDashboardIcon: {
      fontSize: "22px",
      color: "#0022ff",
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
      fontSize: "22px",
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
    userManagementSection: {
      backgroundColor: "#fef9f8",
      borderRadius: "8px",
      padding: "20px 24px 24px",
    },
    sectionTitle: {
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
    statusActive: {
      backgroundColor: "#d9f7d9",
      color: "#2fa34f",
      border: "1px solid #2fa34f",
      borderRadius: "12px",
      padding: "2px 10px",
      fontWeight: 600,
      fontSize: "10px",
      display: "inline-block",
      textAlign: "center",
    },
    statusInactive: {
      backgroundColor: "#f9d9d9",
      color: "#a32f2f",
      border: "1px solid #a32f2f",
      borderRadius: "12px",
      padding: "2px 10px",
      fontWeight: 600,
      fontSize: "10px",
      display: "inline-block",
      textAlign: "center",
    },
    userType: {
      color: "#1a73e8",
      fontWeight: 600,
    },
    flexNavWrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "24px",
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
        <div style={styles.title}>User Management</div>
        <a style={styles.signout} href="#">
          <i className="fas fa-sign-out-alt" style={styles.signoutIcon}></i>{" "}
          Sign Out
        </a>
      </header>

      <main style={styles.main}>
        <div style={styles.flexNavWrapper}>
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
            <button
              style={styles.btnDashboard}
              onClick={() => (window.location.href = "/dshbrd_Admin")}
            >
              <i className="fas fa-folder" style={styles.btnDashboardIcon}></i>
            </button>

            <div
              style={styles.userContainer}
              onClick={() => (window.location.href = "/userManagement")}
            >
              <i className="fas fa-user" style={styles.iconUser}></i>
              <div style={styles.textContainer}>
                <span>User</span>
                <span>Management</span>
              </div>
            </div>

            <button
              style={styles.iconSend}
              onClick={() => (window.location.href = "/send_Admin")}
            >
              <i className="fas fa-paper-plane" style={styles.iconSend}></i>
            </button>
          </nav>
        </div>

        <section style={styles.userManagementSection}>
          <h2 style={styles.sectionTitle}>User Management</h2>
          <p>Manage your users, checking who's online and see their database</p>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Name</th>
                <th style={styles.tableHeaderCell}>Status</th>
                <th style={styles.tableHeaderCell}>Last Online</th>
                <th style={styles.tableHeaderCell}>Type</th>
                <th style={styles.tableHeaderCell}>Username</th>
                <th style={styles.tableHeaderCell}>Email Address</th>
              </tr>
            </thead>
            <tbody>
              <tr style={styles.tableBodyRow}>
                <td style={styles.tableBodyCell}>Angelia Ayu</td>
                <td style={styles.tableBodyCell}>
                  <span style={styles.statusActive}>Active</span>
                </td>
                <td style={styles.tableBodyCell}>-</td>
                <td style={styles.tableBodyCell}>
                  <span style={styles.userType}>Premium</span>
                </td>
                <td style={styles.tableBodyCell}>User</td>
                <td style={styles.tableBodyCell}>angeliaayu@gmail.com</td>
              </tr>
              <tr style={styles.tableBodyRow}>
                <td style={styles.tableBodyCell}>Intan Alifa</td>
                <td style={styles.tableBodyCell}>
                  <span style={styles.statusInactive}>Inactive</span>
                </td>
                <td style={styles.tableBodyCell}>12 hours ago</td>
                <td style={styles.tableBodyCell}>
                  <span style={styles.userType}>Default</span>
                </td>
                <td style={styles.tableBodyCell}>Admin</td>
                <td style={styles.tableBodyCell}>intanalifa@gmail.com</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default UserManagement;

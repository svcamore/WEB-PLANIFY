import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaFolder,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa"; // Using react-icons

const UserManagement = () => {
  const API_URL = process.env.REACT_APP_API_URL; // Assuming API_URL is needed for future user data fetching
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // State to hold user data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Placeholder for fetching user data (add real API call when available)
  const fetchUsers = async () => {
    // In a real application, you would fetch user data from an API here.
    // For now, using mock data.
    setLoading(true);
    setError(null);
    try {
      // const token = localStorage.getItem("token");
      // if (!token) {
      //   navigate("/");
      //   return;
      // }
      // const res = await fetch(API_URL + "/users", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // if (!res.ok) throw new Error("Failed to fetch users.");
      // const data = await res.json();
      // setUsers(data.data); // Assuming API returns { data: [...] }

      // Mock data for demonstration
      const mockUsers = [
        {
          id: 1,
          name: "Angelia Ayu",
          status: "active",
          lastOnline: "-",
          type: "Premium",
          username: "angelia_ayu",
          email: "angeliaayu@gmail.com",
        },
        {
          id: 2,
          name: "Intan Alifa",
          status: "inactive",
          lastOnline: "12 hours ago",
          type: "Default",
          username: "intan_alifa",
          email: "intanalifa@gmail.com",
        },
        {
          id: 3,
          name: "Budi Santoso",
          status: "active",
          lastOnline: "-",
          type: "Default",
          username: "budi_s",
          email: "budi.s@example.com",
        },
        {
          id: 4,
          name: "Citra Dewi",
          status: "active",
          lastOnline: "-",
          type: "Premium",
          username: "citra_d",
          email: "citra.d@example.com",
        },
        {
          id: 5,
          name: "David Kurniawan",
          status: "inactive",
          lastOnline: "2 days ago",
          type: "Default",
          username: "david_k",
          email: "david.k@example.com",
        },
      ];
      setTimeout(() => {
        setUsers(mockUsers);
        setLoading(false);
      }, 1000); // Simulate API call delay
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load user data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.fontFamily = "'Inter', sans-serif";
    document.body.style.backgroundColor = "#f0f2f5"; // Lighter background
    document.body.style.color = "#333"; // Darker text for better contrast
    fetchUsers();
  }, []);

  const styles = {
    header: {
      backgroundColor: "#ffffff",
      display: "flex",
      alignItems: "center",
      padding: "15px 30px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      gap: "10px",
    },
    headerImg: {
      width: "40px",
      height: "40px",
    },
    logoText: {
      fontWeight: 700,
      fontSize: "24px",
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
      padding: "30px 20px",
      maxWidth: "1200px",
      margin: "20px auto",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    welcomeSection: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "20px",
      marginBottom: "30px",
    },
    helloAdmin: {
      backgroundColor: "#1a4ed8",
      color: "#fff",
      borderRadius: "10px",
      padding: "20px 25px",
      width: "280px",
      minHeight: "100px",
      fontWeight: 600,
      fontSize: "24px",
      lineHeight: 1.3,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    helloAdminSmall: {
      display: "block",
      fontWeight: 400,
      fontSize: "12px",
      marginTop: "8px",
      color: "#d9e1ff",
    },
    navButtons: {
      backgroundColor: "#fef9f8",
      borderRadius: "15px",
      padding: "15px 20px",
      display: "flex",
      alignItems: "center",
      gap: "20px",
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
      backgroundColor: "transparent",
    },
    navButtonContainerActive: {
      backgroundColor: "#e6eaf3",
      color: "#1a73e8",
    },
    navButtonIcon: {
      fontSize: "20px",
      color: "#1a73e8",
    },
    navButtonText: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#333",
    },
    userManagementSection: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "25px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
      border: "1px solid #e0e0e0",
    },
    sectionTitle: {
      color: "#1a4ed8",
      fontWeight: 700,
      fontSize: "20px",
      marginBottom: "20px",
      borderBottom: "2px solid #e6eaf3",
      paddingBottom: "10px",
    },
    sectionDescription: {
      fontSize: "15px",
      color: "#555",
      marginBottom: "25px",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0 8px",
      fontSize: "14px",
      color: "#4a4a4a",
    },
    tableHeader: {
      backgroundColor: "#e6eaf3",
      borderRadius: "8px",
    },
    tableHeaderCell: {
      fontWeight: 600,
      padding: "12px 10px",
      textAlign: "left",
      color: "#1a4ed8",
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
      backgroundColor: "#fefefe",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
    },
    tableBodyCell: {
      padding: "12px 10px",
    },
    statusActive: {
      backgroundColor: "#d4edda", // Greenish background
      color: "#155724", // Darker green text
      border: "1px solid #c3e6cb",
      borderRadius: "16px",
      padding: "4px 12px",
      fontWeight: 600,
      fontSize: "11px",
      display: "inline-block",
      textAlign: "center",
      minWidth: "70px",
    },
    statusInactive: {
      backgroundColor: "#f8d7da", // Reddish background
      color: "#721c24", // Darker red text
      border: "1px solid #f5c6cb",
      borderRadius: "16px",
      padding: "4px 12px",
      fontWeight: 600,
      fontSize: "11px",
      display: "inline-block",
      textAlign: "center",
      minWidth: "70px",
    },
    userType: {
      color: "#1a73e8", // Blue for user type
      fontWeight: 600,
      backgroundColor: "#e6eaf3", // Light blue background
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "12px",
      display: "inline-block",
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
      <title>Planify - User Management</title>
      <header style={styles.header}>
        <img
          alt="Blue square icon with white checkmark inside"
          style={styles.headerImg}
          src="/logo%20planify%20new.png"
        />
        <div style={styles.logoText}>Planify</div>
        <div style={styles.title}>User Management</div>
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
              style={styles.navButtonContainer}
              onClick={() => navigate("/dshbrd_Admin")}
            >
              <FaFolder style={styles.navButtonIcon} />
              <span style={styles.navButtonText}>Dashboard</span>
            </div>

            <div
              style={{
                ...styles.navButtonContainer,
                ...styles.navButtonContainerActive,
              }}
              onClick={() => navigate("/userManagement")}
            >
              <FaUser style={styles.navButtonIcon} />
              <span style={styles.navButtonText}>User Management</span>
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

        <section style={styles.userManagementSection}>
          <h2 style={styles.sectionTitle}>User Management</h2>
          <p style={styles.sectionDescription}>
            Manage your users, checking who's online and see their database.
          </p>
          {loading ? (
            <p style={styles.loadingMessage}>Loading users...</p>
          ) : error ? (
            <p style={styles.errorMessage}>{error}</p>
          ) : (
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
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No user data available.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} style={styles.tableBodyRow}>
                      <td style={styles.tableBodyCell}>{user.name}</td>
                      <td style={styles.tableBodyCell}>
                        {user.status === "active" ? (
                          <span style={styles.statusActive}>Active</span>
                        ) : (
                          <span style={styles.statusInactive}>Inactive</span>
                        )}
                      </td>
                      <td style={styles.tableBodyCell}>{user.lastOnline}</td>
                      <td style={styles.tableBodyCell}>
                        <span style={styles.userType}>{user.type}</span>
                      </td>
                      <td style={styles.tableBodyCell}>{user.username}</td>
                      <td style={styles.tableBodyCell}>{user.email}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserManagement;
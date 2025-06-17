import React, { useEffect } from "react";

const Riviews = () => {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.fontFamily = "'Inter', sans-serif";
    document.body.style.backgroundColor = "#e6eaf3";
    document.body.style.color = "#000";
  }, []);

  const reviews = [
    {
      name: "Angelia Ayu",
      time: "29 minutes ago",
      text: "Planify is the best application I’ve ever knew.",
      rating: 5,
    },
    {
      name: "Alycia Sinaga",
      time: "2 days ago",
      text: "Signed up last week and I’m already in love with this app so much. It helps me a lot to manage my task.",
      rating: 4,
    },
  ];

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
      padding: "15px 16px",
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
      color: "#0022ff",
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
    },
    flexNavWrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "24px",
    },
    reviewSection: {
      padding: "30px",
      backgroundColor: "#f3f5fa",
      borderRadius: "8px",
      marginTop: "20px",
    },
    sectionTitle: {
      fontSize: "20px",
      marginBottom: "10px",
      fontWeight: "bold",
    },
    ratingSummary: {
      display: "flex",
      gap: "20px",
      marginBottom: "20px",
    },
    averageRatingBox: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      textAlign: "center",
      flex: "1",
    },
    averageLabel: {
      fontSize: "14px",
      color: "#555",
    },
    averageScore: {
      fontSize: "32px",
      margin: "10px 0",
    },
    outOf: {
      fontSize: "16px",
      color: "#888",
    },
    reviewCountBox: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      flex: "1",
    },
    totalReviews: {
      fontWeight: "bold",
      marginBottom: "10px",
    },
    ratingBreakdownRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "8px",
      fontSize: "14px",
    },
    ratingLabel: {
      width: "60px",
    },
    progressBar: {
      flex: 1,
      height: "8px",
      backgroundColor: "#ddd",
      borderRadius: "5px",
      overflow: "hidden",
    },
    progressFill: (percent) => ({
      width: `${percent}%`,
      height: "100%",
      backgroundColor: "#1a73e8",
    }),
    ratingCount: {
      width: "30px",
      textAlign: "right",
    },
    reviewList: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
    },
    reviewCard: {
      borderBottom: "1px solid #ddd",
      padding: "15px 0",
    },
    reviewHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "5px",
      fontSize: "14px",
      color: "#333",
    },
    timeAgo: {
      color: "#888",
      fontSize: "13px",
    },
    reviewText: {
      marginBottom: "10px",
      fontSize: "14px",
      color: "#444",
    },
    reviewFooter: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "14px",
      color: "#333",
    },
    deleteIcon: {
      cursor: "pointer",
    },
  };

  return (
    <div>
      <header style={styles.header}>
        <title>Planify - Admin</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <img
          alt="Logo"
          style={styles.headerImg}
          src="/logo%20planify%20new.png"
        />
        <div style={styles.logoText}>Planify</div>
        <div style={styles.title}>Riviews</div>
        <a style={styles.signout} href="#">
          <i className="fas fa-sign-out-alt" style={styles.signoutIcon}></i>
          Sign Out
        </a>
      </header>

      <main style={styles.main}>
        <div style={styles.flexNavWrapper}>
          <div style={styles.helloAdmin}>
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

            <button
              style={styles.iconUser}
              onClick={() => (window.location.href = "/userManagement")}
            >
              <i className="fas fa-user" style={styles.iconUser}></i>
            </button>

            <div
              style={styles.userContainer}
              onClick={() => (window.location.href = "/reviews")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.location.href = "/reviews";
                }
              }}
            >
              <i className="fas fa-paper-plane" style={styles.iconSend}></i>
              <div style={styles.textContainer}>
                <span>Reviews</span>
              </div>
            </div>
          </nav>
        </div>

        <section style={styles.reviewSection}>
          <h2 style={styles.sectionTitle}>User Reviews</h2>
          <div style={styles.ratingSummary}>
            <div style={styles.averageRatingBox}>
              <p style={styles.averageLabel}>Average Rating</p>
              <h1 style={styles.averageScore}>
                4.95 <span style={styles.outOf}>/ 5 stars</span>
              </h1>
            </div>
            <div style={styles.reviewCountBox}>
              <p style={styles.totalReviews}>100 reviews</p>
              {[
                { label: "5 ⭐", count: 100 },
                { label: "4 ⭐", count: 75 },
                { label: "3 ⭐", count: 80 },
                { label: "2 ⭐", count: 15 },
                { label: "1 ⭐", count: 3 },
              ].map((item, i) => (
                <div key={i} style={styles.ratingBreakdownRow}>
                  <span style={styles.ratingLabel}>{item.label}</span>
                  <div style={styles.progressBar}>
                    <div
                      style={styles.progressFill((item.count / 100) * 100)}
                    ></div>
                  </div>
                  <span style={styles.ratingCount}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.reviewList}>
            {reviews.map((review, index) => (
              <div key={index} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <strong>{review.name}</strong>
                  <span style={styles.timeAgo}>{review.time}</span>
                </div>
                <p style={styles.reviewText}>{review.text}</p>
                <div style={styles.reviewFooter}>
                  <span>⭐ {review.rating}</span>
                  <span style={styles.deleteIcon}>🗑️</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Riviews;

import React, { useEffect, useState } from "react"; // Added useState for potential future dynamic data
import { useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaFolder,
  FaUser,
  FaPaperPlane,
  FaTrashAlt, // Using react-icons for trash icon
} from "react-icons/fa";

const Reviews = () => {
  const navigate = useNavigate();
  // Using useState for reviews so it can be dynamically updated if needed
  const [reviews, setReviews] = useState([
    {
      id: 1, // Added ID for key prop
      name: "Angelia Ayu",
      time: "29 minutes ago",
      text: "Planify is the best application I’ve ever knew.",
      rating: 5,
    },
    {
      id: 2, // Added ID for key prop
      name: "Alycia Sinaga",
      time: "2 days ago",
      text: "Signed up last week and I’m already in love with this app so much. It helps me a lot to manage my task.",
      rating: 4,
    },
    {
      id: 3,
      name: "Budi Santoso",
      time: "1 hour ago",
      text: "Great app for planning, easy to use interface.",
      rating: 5,
    },
    {
      id: 4,
      name: "Citra Dewi",
      time: "3 days ago",
      text: "It's okay, but could use more features for collaboration.",
      rating: 3,
    },
    {
      id: 5,
      name: "Dian Permata",
      time: "5 minutes ago",
      text: "Absolutely love Planify! It keeps me so organized.",
      rating: 5,
    },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.fontFamily = "'Inter', sans-serif";
    document.body.style.backgroundColor = "#f0f2f5"; // Lighter background
    document.body.style.color = "#333"; // Darker text for better contrast
  }, []);

  // Calculate average rating dynamically
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : 0;

  // Placeholder for review counts for progress bars (you might want to calculate these dynamically too)
  const reviewCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };
  const maxReviews = reviews.length; // Max for percentage calculation

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
    reviewSection: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "25px", // Increased padding
      boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
      border: "1px solid #e0e0e0",
      marginTop: "20px",
    },
    sectionTitle: {
      color: "#1a4ed8",
      fontWeight: 700,
      fontSize: "20px", // Larger title
      marginBottom: "20px", // More space
      borderBottom: "2px solid #e6eaf3", // Underline
      paddingBottom: "10px",
    },
    ratingSummary: {
      display: "grid", // Use grid for flexible layout
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", // Responsive columns
      gap: "20px",
      marginBottom: "30px", // More space below
    },
    averageRatingBox: {
      backgroundColor: "#fefefe", // Lighter background for boxes
      padding: "25px", // Increased padding
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
      border: "1px solid #e0e0e0",
    },
    averageLabel: {
      fontSize: "15px",
      color: "#555",
      marginBottom: "8px",
    },
    averageScore: {
      fontSize: "42px", // Larger score
      fontWeight: 700,
      color: "#1a4ed8", // Blue color for score
      margin: "10px 0",
    },
    outOf: {
      fontSize: "18px", // Larger text
      color: "#888",
    },
    reviewCountBox: {
      backgroundColor: "#fefefe",
      padding: "25px",
      borderRadius: "10px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
      border: "1px solid #e0e0e0",
    },
    totalReviews: {
      fontWeight: 700, // Bolder
      fontSize: "18px", // Larger
      color: "#333",
      marginBottom: "15px",
      textAlign: "center",
    },
    ratingBreakdownRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "10px",
      fontSize: "15px",
      color: "#555",
    },
    ratingLabel: {
      width: "70px", // Wider label for better alignment
      fontWeight: 600,
      color: "#1a73e8", // Blue for labels
    },
    progressBar: {
      flex: 1,
      height: "10px", // Taller bar
      backgroundColor: "#e0e0e0",
      borderRadius: "5px",
      overflow: "hidden",
    },
    progressFill: (percent) => ({
      width: `${percent}%`,
      height: "100%",
      backgroundColor: "#28a745", // Green progress bar
      borderRadius: "5px",
    }),
    ratingCount: {
      width: "40px", // Wider count
      textAlign: "right",
      fontWeight: 500,
      color: "#333",
    },
    reviewList: {
      backgroundColor: "#ffffff",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
      border: "1px solid #e0e0e0",
      marginTop: "20px",
    },
    reviewCard: {
      borderBottom: "1px solid #eee", // Lighter divider
      padding: "20px 0", // More padding
      "&:last-child": {
        borderBottom: "none", // No border for the last item
      },
    },
    reviewHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center", // Align items vertically
      marginBottom: "8px",
      fontSize: "16px", // Larger text
      color: "#333",
    },
    reviewerName: {
      fontWeight: 700, // Bolder name
      color: "#1a4ed8", // Blue for name
    },
    timeAgo: {
      color: "#888",
      fontSize: "13px",
    },
    reviewText: {
      marginBottom: "12px", // More space
      fontSize: "15px",
      color: "#444",
      lineHeight: 1.5,
    },
    reviewFooter: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "15px",
      color: "#333",
    },
    starRating: {
      color: "#ffc107", // Yellow stars
      fontWeight: 600,
      fontSize: "16px",
    },
    deleteIcon: {
      cursor: "pointer",
      color: "#dc3545", // Red trash icon
      fontSize: "18px", // Larger icon
      transition: "color 0.2s ease",
      "&:hover": {
        color: "#c82333",
      },
    },
  };

  return (
    <div>
      <title>Planify - Reviews</title>
      <header style={styles.header}>
        <img
          alt="Blue square icon with white checkmark inside"
          style={styles.headerImg}
          src="/logo%20planify%20new.png"
        />
        <div style={styles.logoText}>Planify</div>
        <div style={styles.title}>Reviews</div>
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
              style={styles.navButtonContainer}
              onClick={() => navigate("/userManagement")}
            >
              <FaUser style={styles.navButtonIcon} />
              <span style={styles.navButtonText}>Users</span>
            </div>

            <div
              style={{
                ...styles.navButtonContainer,
                ...styles.navButtonContainerActive,
              }}
              onClick={() => navigate("/send_Admin")}
            >
              <FaPaperPlane style={styles.navButtonIcon} />
              <span style={styles.navButtonText}>Reviews</span>
            </div>
          </nav>
        </section>

        <section style={styles.reviewSection}>
          <h2 style={styles.sectionTitle}>User Reviews</h2>
          <div style={styles.ratingSummary}>
            <div style={styles.averageRatingBox}>
              <p style={styles.averageLabel}>Average Rating</p>
              <h1 style={styles.averageScore}>
                {averageRating} <span style={styles.outOf}>/ 5 stars</span>
              </h1>
            </div>
            <div style={styles.reviewCountBox}>
              <p style={styles.totalReviews}>{reviews.length} reviews</p>
              {Object.entries(reviewCounts).sort(([a], [b]) => b - a).map(([rating, count], i) => (
                <div key={i} style={styles.ratingBreakdownRow}>
                  <span style={styles.ratingLabel}>{rating} ⭐</span>
                  <div style={styles.progressBar}>
                    <div
                      style={styles.progressFill((count / maxReviews) * 100)}
                    ></div>
                  </div>
                  <span style={styles.ratingCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.reviewList}>
            {reviews.length === 0 ? (
                <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                    No reviews available.
                </p>
            ) : (
                reviews.map((review) => (
                    <div key={review.id} style={styles.reviewCard}>
                        <div style={styles.reviewHeader}>
                            <strong style={styles.reviewerName}>{review.name}</strong>
                            <span style={styles.timeAgo}>{review.time}</span>
                        </div>
                        <p style={styles.reviewText}>{review.text}</p>
                        <div style={styles.reviewFooter}>
                            <span style={styles.starRating}>⭐ {review.rating}</span>
                            <span style={styles.deleteIcon} title="Delete Review">
                                <FaTrashAlt />
                            </span>
                        </div>
                    </div>
                ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Reviews;
import React from "react";

export default function Sidebar({ user }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <ul>
        <li
          onClick={() => window.location.href = "/workspace"}
          className={`nav-item ${window.location.pathname === "/workspace" ? "active2" : ""}`}
        >
          <i className="fas fa-home me-2"></i> Dashboard
        </li>

        <li
          onClick={() => window.location.href = "/recentFile"}
          className={`nav-item ${window.location.pathname === "/recentFile" ? "active2" : ""}`}
        >
          <i className="fas fa-clock me-2"></i> Recent
        </li>

        <li
          onClick={() => window.location.href = "/favorite"}
          className={`nav-item ${window.location.pathname === "/favorite" ? "active" : ""}`}
        >
          <i className="fas fa-star me-2"></i> Favorites
        </li>
      </ul>

      {/* Premium Box hanya jika user belum premium */}
      {user?.tier !== "premium" && (
        <div className="premium-box text-center p-3 border rounded">
          <i className="fas fa-gem" style={{ fontSize: "2rem", color: "#4361ee" }}></i>
          <p className="mb-1">
            <strong>Current plan:</strong>
            <br />
            Free Trial
          </p>
          <small>Upgrade to Premium to get exclusive features</small>
          <div
            className="btn btn-sm w-100 rounded-pill mt-2"
            role="button"
            onClick={() => window.location.href = "/setting/upgrade"}
            style={{ cursor: "pointer" }}
          >
            ⚡ Go Premium
          </div>
        </div>
      )}

      <ul>
        <li
          onClick={() => window.location.href = "/setting/profile"}
          className={`bottom-menu nav-item ${window.location.pathname === "/setting/profile" ? "active" : ""}`}
        >
          <i className="fas fa-cog me-2"></i> Setting
        </li>

        <li
          onClick={handleLogout}
          className="nav-item"
        >
          <i className="fas fa-sign-out-alt me-2"></i> Logout
        </li>
      </ul>
    </div>
  );
}

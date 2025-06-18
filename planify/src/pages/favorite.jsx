import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import "../pages/works.css";

function App() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [workbooks, setWorkbooks] = useState([]); // Change 'favorites' to 'workbooks' for clarity
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(API_URL + "/auth/user", {
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

  const fetchFavoriteWorkbooks = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(API_URL + "/workbook", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Filter for workbooks where is_favorite is 1 (true) and not archived
        const favorited = data.filter(
          (item) => item.is_favorite === 1 && item.is_archived === 0
        );
        const mapped = favorited.map((item) => ({
          id: item.id,
          title: item.title,
          image: item.thumbnail,
          createdAt: new Date(item.last_edited_at).toLocaleString(),
          isFavorite: item.is_favorite === 1,
        }));
        setWorkbooks(mapped); // Set the favorited workbooks to state
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  const handleFavoriteClick = async (id, currentFavoriteStatus) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/workbook/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_favorite: currentFavoriteStatus ? 0 : 1, // Toggle the favorite status
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Validation errors:", error);
        throw new Error("Gagal mengubah status favorit workbook");
      }

      alert(
        currentFavoriteStatus
          ? "Berhasil menghapus dari favorit"
          : "Berhasil menambahkan ke favorit"
      );
      fetchFavoriteWorkbooks(); // Re-fetch to update the list
    } catch (err) {
      console.error("Error updating workbook favorite status:", err);
      alert("Gagal mengubah status favorit workbook.");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchFavoriteWorkbooks(); // Fetch favorite workbooks on component mount
  }, []);

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };

  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <title>Planify - Dashboard</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        rel="stylesheet"
      />

      <div className="d-flex">
        {/* Sidebar kiri */}
        <div className="sidebar-left">
          <i
            className="fas fa-home toggle-sidebar mb-2"
            onClick={toggleRightSidebar}
          />
          <i
            className="fas fa-clock toggle-sidebar mb-2"
            onClick={toggleRightSidebar}
          />
          <i
            className="fas fa-star toggle-sidebar"
            onClick={toggleRightSidebar}
          />
          <div className="sidebar-bottom-icons">
            <i
              className="fas fa-gem toggle-sidebar mb-1"
              onClick={toggleRightSidebar}
            />
            <i
              className="fas fa-cog toggle-sidebar mb-1"
              onClick={toggleRightSidebar}
            />
            <i
              className="fas fa-sign-out-alt toggle-sidebar"
              onClick={toggleRightSidebar}
            />
          </div>
        </div>

        {/* Sidebar kanan */}
        <div
          className={`sidebar-right ${showRightSidebar ? "show" : ""}`}
          aria-hidden={!showRightSidebar}
        >
          <Sidebar user={user} />
        </div>

        {/* Konten utama */}
        <main className="content flex-grow-1" role="main">
          <header className="app-header" role="banner">
            <div className="logo">
              <div className="logo-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              Planify
            </div>
            <nav className="nav-actions">
              <button className="btn-icon" aria-label="Message">
                <i className="far fa-envelope"></i>
              </button>
              <button className="btn-icon" aria-label="Notification">
                <i className="far fa-bell"></i>
              </button>
              <button className="btn-icon" aria-label="Help">
                <i className="far fa-circle-question"></i>
              </button>
              <button className="premium-btn" aria-label="Go Premium">
                Go Premium
              </button>
              <img
                className="user-avatar"
                src="https://storage.googleapis.com/a1aa/image/b1775588-94f7-4a59-b686-0a1dddb0891b.jpg"
                alt="User Avatar"
                width="40"
                height="40"
              />
            </nav>
          </header>

          <div className="container-fluid mt-4">
            <h2 className="h4 mb-3">Favorite</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {workbooks.map((item) => (
                  <tr key={item.id}>
                    {" "}
                    {/* Use item.id as key */}
                    <td className="d-flex align-items-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        width="50"
                        className="me-2"
                      />
                      {item.title}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i
                          className={`fas fa-star ${
                            item.isFavorite ? "text-warning" : "text-muted"
                          }`}
                          onClick={() =>
                            handleFavoriteClick(item.id, item.isFavorite)
                          }
                          style={{ cursor: "pointer", fontSize: "18px" }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
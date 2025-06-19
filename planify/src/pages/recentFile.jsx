import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar"; // Ini adalah komponen Sidebar yang Anda buat untuk sidebar kanan
import NotificationPopup from "../components/Notif"; // Asumsi Notif.jsx ada
import "../pages/worksc.css"; // Pastikan ini sesuai dengan nama file CSS Anda (worksc.css atau works.css)

function App() {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [recentWorkbooks, setRecentWorkbooks] = useState([]);
  const [user, setUser] = useState(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const dummyNotifications = [
    { id: 1, user: "Sistem", action: "Ada update baru!", time: "Baru saja" },
  ];

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
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
        if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }
        throw new Error("Gagal fetch user");
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Gagal ambil user:", err);
    }
  };

  const fetchRecentWorkbooks = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
        return;
    }

    fetch(API_URL + "/workbook", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
          if (!res.ok) {
              throw new Error('Gagal mengambil data workbook');
          }
          return res.json();
      })
      .then((data) => {
        const filtered = data.filter((item) => item.is_archived === 0);
        const sorted = filtered.sort((a, b) => {
            const dateA = new Date(a.last_opened_at || a.created_at);
            const dateB = new Date(b.last_opened_at || b.created_at);
            return dateB - dateA;
        });

        const mapped = sorted.map((item) => ({
          id: item.id,
          title: item.title,
          image: item.thumbnail,
          openedAt: new Date(item.last_opened_at || item.last_edited_at || item.created_at).toLocaleString(),
          isFavorite: item.is_favorite === 1,
        }));
        setRecentWorkbooks(mapped);
      })
      .catch((err) => {
          console.error("Fetch error for recent workbooks:", err);
      });
  };

  const handleFavoriteClick = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const newFavoriteStatus = item.isFavorite ? 0 : 1;

    try {
      const res = await fetch(`${API_URL}/workbook/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_favorite: newFavoriteStatus }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengubah status favorit workbook");
      }

      setRecentWorkbooks(prevWorkbooks =>
        prevWorkbooks.map(wb =>
          wb.id === item.id ? { ...wb, isFavorite: !item.isFavorite } : wb
        )
      );

      alert(
        item.isFavorite
          ? "Berhasil menghapus dari favorit"
          : "Berhasil menambahkan ke favorit"
      );

    } catch (err) {
      console.error("Error updating favorite status:", err);
      alert("Gagal mengubah status favorit workbook.");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchRecentWorkbooks();
  }, [API_URL, navigate]);

  const handleWorkbookClick = (workbookId) => {
    navigate(`/kalender/${workbookId}`);
  };

  return (
    <>
      {/* PENTING: TAG <meta> dan <link> DIBAWAH INI HARUS DIHAPUS DARI SINI */}
      {/* DAN DIPASTIKAN ADA DI FILE public/index.html */}
      {/* <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <title>Planify - Recent File</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        rel="stylesheet"
      /> */}

      <div className="d-flex">
        {/* Sidebar Kiri - DIKEMBALIKAN SESUAI KODE ASLI ANDA */}
        <div className="sidebar-left">
          <i
            className="fas fa-home toggle-sidebar mb-2"
            onClick={() => navigate('/workspace')}
          />
          <i
            className="fas fa-clock toggle-sidebar mb-2"
            onClick={() => navigate('/recent-files')}
          />
          <i
            className="fas fa-star toggle-sidebar"
            onClick={() => navigate('/favorite')}
          />
          <div className="sidebar-bottom-icons">
            <i
              className="fas fa-gem toggle-sidebar mb-1"
              onClick={() => alert("Go Premium!")}
            />
            <i
              className="fas fa-cog toggle-sidebar mb-1"
              onClick={() => alert("Pengaturan")}
            />
            <i
              className="fas fa-sign-out-alt toggle-sidebar"
              onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
              }}
            />
          </div>
        </div>

        {/* Sidebar Kanan (Komponen Sidebar yang diimpor) */}
        <div
          className={`sidebar-right ${showRightSidebar ? "show" : ""}`}
          aria-hidden={!showRightSidebar}
        >
          <Sidebar user={user} />
        </div>

        {/* Konten Utama */}
        <main className="content flex-grow-1" role="main">
          <header className="app-header" role="banner">
            <div
              aria-label="Planify logo"
              className="logo d-flex align-items-center"
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
            <nav className="nav-actions">
              <button className="btn-icon" aria-label="Message">
                <i className="far fa-envelope"></i>
              </button>
              <button className="btn-icon" aria-label="Notification" onClick={() => setIsNotifOpen(true)}>
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
                src={user?.avatar || "https://storage.googleapis.com/a1aa/image/b1775588-94f7-4a59-b686-0a1dddb0891b.jpg"}
                alt="User Avatar"
                width="40"
                height="40"
                onClick={toggleRightSidebar} // Untuk membuka/menutup sidebar kanan
              />
            </nav>
          </header>

          {/* Tabel Recent Files */}
          <div className="container-fluid mt-4">
            <h2 className="h4 mb-3">Recent Files</h2>
            <table className="table table-striped table-hover shadow-sm">
              <thead className="table-light">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Type</th>
                  <th scope="col">Last Opened</th>
                  <th scope="col">Favorite</th>
                </tr>
              </thead>
              <tbody>
                {recentWorkbooks.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="text-center text-muted py-4">
                            Tidak ada workbook yang baru dibuka.
                        </td>
                    </tr>
                ) : (
                    recentWorkbooks.map((item) => (
                        <tr key={item.id} style={{ cursor: "pointer" }} onClick={() => handleWorkbookClick(item.id)}>
                            <td className="d-flex align-items-center py-2">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    width="40"
                                    height="40"
                                    className="me-3 rounded"
                                    style={{ objectFit: "cover" }}
                                />
                                <span className="fw-bold">{item.title}</span>
                            </td>
                            <td>Public</td>
                            <td>{item.openedAt}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                                <i
                                    className={`fas fa-star ${item.isFavorite ? 'text-warning' : 'text-muted'}`}
                                    onClick={() => handleFavoriteClick(item)}
                                    style={{ cursor: 'pointer', transition: '0.3s ease', fontSize: '1.2em' }}
                                />
                            </td>
                        </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      {/* Notification Popup */}
      <NotificationPopup
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={dummyNotifications}
      />
    </>
  );
}

export default App;
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import "../pages/works.css";

function App() {
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [favorites, setFavorites] = useState([]); // Store favorites based on title
  const [archivedWorkbooks, setArchivedWorkbooks] = useState([]); // Store archived workbooks
  const [workbooks, setWorkbooks] = useState([]); // array data workbooks for archived
  const [user, setUser] = useState(null);

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };
  const handleFavoriteClick = (item) => {
    if (favorites.includes(item.title)) {
      setFavorites(favorites.filter(title => title !== item.title)); // Remove from favorites
    } else {
      setFavorites([...favorites, item.title]); // Add to favorites
    }
  };

  const handleArchiveClick = (item) => {
    setArchivedWorkbooks([...archivedWorkbooks, item]); // Archive the workbook
  };

const fetchUser = async () => {
  const token = localStorage.getItem("token"); // Ambil token dari localStorage
  if (!token) return;

  try {
    const res = await fetch("http://127.0.0.1:3000/api/auth/user", {
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

  const fetchWorkbooks = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://127.0.0.1:3000/api/workbook", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((item) => item.is_archived === 1);
        const mapped = filtered.map((item) => ({
          id: item.id,
          title: item.title,
          image: item.thumbnail,
          createdAt: new Date(item.last_edited_at).toLocaleString(),
        }));
        setWorkbooks(mapped);
      })
      .catch((err) => console.error("Fetch error:", err));
  };
  useEffect(()=>{
    fetchWorkbooks();
    fetchUser();
  },[])

  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <title>Planify - Archived</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        rel="stylesheet"
      />

      <div className="d-flex">
        {/* Left Sidebar */}
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
            className="fas fa-folder toggle-sidebar mb-1"
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

        {/* Right Sidebar */}
        <div
          className={`sidebar-right ${showRightSidebar ? "show" : ""}`}
          aria-hidden={!showRightSidebar}
        >
          <Sidebar user={user} />
        </div>

        {/* Main Content */}
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
              <button className="btn-icon" aria-label="Notification">
                <i className="far fa-bell"></i>
              </button>
              <button className="btn-icon" aria-label="Help">
                <i className="far fa-circle-question"></i>
              </button>
              {
                (!user || user.tier !== "premium") && (
                  <button className="premium-btn" aria-label="Go Premium">
                    Go Premium
                  </button>
                )
              }
              {
                user ?(
                  <img
                    className="user-avatar"
                    src={user.photo_profile}
                    alt={user.name}
                    width="40"
                    height="40"
                  />
                ):(
                  <p>Loading...</p>
                )
              }
            </nav>
          </header>

          {/* Archived Table */}
          <div className="container-fluid mt-4">
            <h2 className="h4 mb-3">Archived</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Edited</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {workbooks.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-3">
                      Data Archive Tidak Ditemukan.
                    </td>
                  </tr>
                ) : (
                  workbooks.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={item.image}
                          alt={item.title}
                          width="50"
                          className="me-2"
                        />
                        {item.title}
                      </td>
                      <td>Public</td>
                      <td>{item.createdAt}</td>
                      <td>
                        <i
                          className={`fas fa-star ${favorites.includes(item.title) ? 'text-warning' : 'text-muted'}`}
                          onClick={() => handleFavoriteClick(item)}
                          style={{ cursor: 'pointer', transition: '0.3s ease' }}
                        />
                        <i
                          className="fas fa-archive ms-2"
                          onClick={() => handleArchiveClick(item)}
                          style={{ cursor: 'pointer', transition: '0.3s ease' }}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Archived Workbooks Section */}
          <div className="container-fluid mt-4">
            <h2 className="h4 mb-3">Archived Workbooks</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Edited</th>
                </tr>
              </thead>
              <tbody>
                {archivedWorkbooks.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={item.image}
                        alt={item.title}
                        width="50"
                        className="me-2"
                      />
                      {item.title}
                    </td>
                    <td>Public</td>
                    <td>{item.createdAt}</td>
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

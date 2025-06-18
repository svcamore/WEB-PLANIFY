import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/sidebar";
import NotificationPopup from "../components/Notif";
import "../pages/works.css";

function App() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [workbooks, setWorkbooks] = useState([]);

  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [workbookId, setWorkbookId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dummyNotifications = [
    {
      id: 1,
      user: "Anda",
      action: "menambahkan tugas baru ke 'To Do'",
      time: "2 menit lalu",
    },
    {
      id: 2,
      user: "Anda",
      action: "mengedit catatan pada 'Notes'",
      time: "10 menit lalu",
    },
  ];

  const fetchWorkbooks = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(API_URL + "/workbook", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((item) => item.is_archived === 0);
        const mapped = filtered.map((item) => ({
          id: item.id,
          title: item.title,
          image: item.thumbnail,
          createdAt: new Date(item.last_edited_at).toLocaleString(),
          isFavorite: item.is_favorite === 1, // Map is_favorite from API
        }));
        setWorkbooks(mapped);
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
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

  useEffect(() => {
    function handleClickOutsideMenu(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutsideMenu);
    // Cek login + fetch workbook
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchWorkbooks();
    fetchUser();
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, []);

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setTitle("");
    setImagePreview(null);
    setEditingIndex(null);
    setImageUrl(null); // Reset image URL when closing modal
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      const formData = new FormData();
      formData.append("image", file);
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      fetch(API_URL + "/upload?nameFolder=WORKBOOK", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setImageUrl("http://127.0.0.1:3000" + data.url);
          console.log("URL gambar:", data.url);
        })
        .catch((err) => console.error("Upload gagal:", err));
    }
  };

  const handleCreateOrUpdateWorkbook = async (e, id) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const newWorkbook = {
      title: title,
      thumbnail: imageUrl,
    };

    if (editingIndex !== null) {
      handleEditProsesWorkbook(workbookId, title, imageUrl);
      await fetchWorkbooks();
      closeModal();
      return;
    }
    try {
      const response = await fetch(API_URL + "/workbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newWorkbook),
      });
      if (!response.ok) {
        throw new Error("Gagal membuat workbook");
      }

      const result = await response.json();

      setWorkbooks((prev) => [
        {
          id: result.id,
          title: result.title,
          image: result.thumbnail,
          createdAt: new Date(result.last_edited_at).toLocaleString(),
          isFavorite: result.is_favorite === 1,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Error creating workbook:", err);
      alert("Gagal membuat workbook.");
    }
    await fetchWorkbooks();
    closeModal();
  };

  const handleEditProsesWorkbook = async (
    id,
    updatedTitle,
    updatedThumbnail = null
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const bodyData = {
      title: updatedTitle,
    };

    if (updatedThumbnail) {
      bodyData.thumbnail = updatedThumbnail;
    }

    try {
      const res = await fetch(`${API_URL}/workbook/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Validation errors:", error);
        throw new Error("Gagal mengedit workbook");
      }

      await fetchWorkbooks();
    } catch (err) {
      console.error("Error updating workbook:", err);
      alert("Gagal edit workbook.");
    }
  };

  const handleArchiveWorkbook = async (id) => {
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
          is_archived: 1,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Validation errors:", error);
        throw new Error("Gagal archive workbook");
      }

      alert("Berhasil archive workbook");
      await fetchWorkbooks();
    } catch (err) {
      console.error("Error updating workbook:", err);
      alert("Gagal archive workbook.");
    }
  };

  const handleFavoriteWorkbook = async (id, currentFavoriteStatus) => {
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
      await fetchWorkbooks();
    } catch (err) {
      console.error("Error updating workbook favorite status:", err);
      alert("Gagal mengubah status favorit workbook.");
    }
  };

  const handleDeleteWorkbook = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirmDelete = window.confirm("Yakin ingin menghapus workbook ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/workbook/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Gagal menghapus:", error);
        throw new Error("Gagal menghapus workbook");
      }

      await fetchWorkbooks();
    } catch (err) {
      console.error("Error deleting workbook:", err);
      alert("Gagal menghapus workbook.");
    }
  };

  const handleEditWorkbook = (index) => {
    const workbookToEdit = workbooks[index];
    setTitle(workbookToEdit.title);
    setImagePreview(workbookToEdit.image);
    setImageUrl(workbookToEdit.image); // Set imageUrl when editing
    setEditingIndex(index);
    setWorkbookId(workbookToEdit.id);
    openModal();
  };

  const toggleNoteMenu = (id, e) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleNoteAction = (action, id) => {
    const workbook = workbooks.find((wb) => wb.id === id);
    const index = workbooks.findIndex((wb) => wb.id === id);

    switch (action) {
      case "Edit":
        handleEditWorkbook(index);
        break;
      case "Archived":
        handleArchiveWorkbook(id);
        break;
      case "Favorite":
        if (workbook) {
          handleFavoriteWorkbook(id, workbook.isFavorite);
        }
        break;
      case "Delete":
        handleDeleteWorkbook(id);
        break;
      default:
        break;
    }
    setActiveMenuId(null);
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
            {!user ||
              (user.tier !== "premium" && (
                <i
                  className="fas fa-gem toggle-sidebar mb-1"
                  onClick={toggleRightSidebar}
                />
              ))}
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

        <div
          className={`sidebar-right ${showRightSidebar ? "show" : ""}`}
          aria-hidden={!showRightSidebar}
        >
          <Sidebar user={user} />
        </div>

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

            <nav aria-label="User  actions" className="nav-actions">
              <button
                className="btn-icon"
                aria-label="Notification"
                onClick={() => setIsNotifOpen(true)}
              >
                <i className="far fa-bell"></i>
              </button>
              {!user ||
                (user.tier !== "premium" && (
                  <button className="premium-btn" aria-label="Go Premium">
                    Go Premium
                  </button>
                ))}
              {user ? (
                <img
                  className="user-avatar"
                  src={"http://127.0.0.1:3000" + user.photo_profile}
                  alt={user.name}
                  width="40"
                  height="40"
                />
              ) : (
                <p>Loading...</p>
              )}
            </nav>
          </header>

          {/* Main Content Area */}
          <div className="container-fluid mt-4">
            {/* Welcome Section */}
            <div className="row mb-4">
              <div className="col-md-8">
                {user ? (
                  <>
                    <h1 className="h2 mb-2">Hi, {user.name} !</h1>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
                <p className="text-muted">
                  What's on your mind today? Let's get things done!
                </p>
              </div>
              {user ? (
                <div className="col-md-4 text-end">
                  <img
                    src={"http://127.0.0.1:3000" + user.photo_profile}
                    alt={user.name}
                    className="img-fluid"
                    style={{ maxWidth: "100px", height: "auto" }}
                  />
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>

            {/* Workspace Section */}
            <div className="row">
              <div className="col-12">
                <h2 className="h4 mb-3">Workspace</h2>

                <ul className="nav nav-tabs mb-4">
                  <li className="nav-item">
                    <a className="nav-link active">
                      <i className="fas fa-book me-2"></i>All Workbook
                    </a>
                  </li>
                  <li className="nav-item">
                    <div
                      className="nav-link d-flex align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => (window.location.href = "/archived")}
                    >
                      <i className="fas fa-archive me-2"></i>
                      <span>Archived</span>
                    </div>
                  </li>
                </ul>

                {/* Workbook List */}
                <div className="row">
                  {workbooks.map((wb) => (
                    <div className="col-md-3 col-sm-6 mb-3" key={wb.id}>
                      <div
                        className="card h-100 shadow card-hover"
                        onClick={() =>
                          (window.location.href = "/kalender/" + wb.id)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={wb.image}
                          className="card-img-top"
                          alt={wb.title}
                          style={{ height: "160px", objectFit: "cover" }}
                        />
                        <div className="card-body">
                          <h5 className="card-title">
                            {wb.title}{" "}
                            {wb.isFavorite && (
                              <i
                                className="fas fa-star"
                                style={{ color: "gold", marginLeft: "5px" }}
                              ></i>
                            )}
                          </h5>
                          <p
                            className="text-muted"
                            style={{ fontSize: "0.9rem" }}
                          >
                            {wb.createdAt}
                          </p>
                          <div className="note-actions">
                            <i
                              className="fas fa-ellipsis-h"
                              onClick={(e) => {
                                e.stopPropagation(); // agar tidak ikut trigger ke window.location
                                toggleNoteMenu(wb.id, e);
                              }}
                              style={{
                                cursor: "pointer",
                                fontSize: "18px",
                                color: "white",
                                padding: "6px",
                                borderRadius: "50%",
                                transition: "background-color 0.2s",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.backgroundColor =
                                  "rgba(215, 212, 212, 0.84)")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "transparent")
                              }
                            />

                            {activeMenuId === wb.id && (
                              <div
                                className="crud-menu"
                                ref={menuRef}
                                onClick={(e) => e.stopPropagation()} // supaya klik di dalam menu tidak redirect
                                style={{
                                  position: "absolute",
                                  top: "30px",
                                  right: "0",
                                  backgroundColor: "white",
                                  border: "1px solid #e0e0e0",
                                  borderRadius: "8px",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                  zIndex: "10000",
                                  minWidth: "120px",
                                  padding: "8px 0",
                                }}
                              >
                                {["Edit", "Favorite", "Archived", "Delete"].map(
                                  (action) => (
                                    <div
                                      key={action}
                                      onClick={() =>
                                        handleNoteAction(action, wb.id)
                                      }
                                      style={{
                                        padding: "12px 20px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        color: "#333",
                                        transition: "background-color 0.2s",
                                      }}
                                      onMouseEnter={(e) =>
                                        (e.target.style.backgroundColor =
                                          "#f5f5f5")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.target.style.backgroundColor =
                                          "white")
                                      }
                                    >
                                      {action === "Favorite"
                                        ? wb.isFavorite
                                          ? "Unfavorite"
                                          : "Favorite"
                                        : action}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add New Workbook */}
                  <div className="col-md-3 col-sm-6 mb-3">
                    <div
                      className="card text-center shadow-sm card-hover"
                      style={{
                        minHeight: "200px",
                        border: "2px dashed #ddd",
                        cursor: "pointer",
                      }}
                      onClick={openModal}
                    >
                      <div className="card-body d-flex flex-column justify-content-center">
                        <div className="mb-3">
                          <i
                            className="fas fa-plus"
                            style={{ fontSize: "3rem", color: "#007bff" }}
                          ></i>
                        </div>
                        <p className="card-text">New Workbook</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal for Create or Edit Workbook */}
            {showModal && (
              <div
                className="modal fade show"
                style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
              >
                <div
                  className="modal-dialog modal-dialog-centered modal-lg"
                  role="document"
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        {editingIndex !== null
                          ? "Edit Workbook"
                          : "Create New Workbook"}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={closeModal}
                      ></button>
                    </div>

                    <div className="modal-body">
                      <form
                        onSubmit={(e) =>
                          handleCreateOrUpdateWorkbook(e, editingIndex)
                        }
                      >
                        <div className="mb-3">
                          <label
                            htmlFor="workspace-name"
                            className="form-label"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="workspace-name"
                            name="workspace-name"
                            placeholder="Enter workspace title"
                            className="form-control"
                            autoComplete="off"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="picture-cover" className="form-label">
                            Picture / Cover
                          </label>
                          <input
                            type="file"
                            id="picture-cover"
                            name="picture-cover"
                            accept="image/*"
                            className="form-control"
                            onChange={handleImageUpload}
                          />
                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="mt-3"
                              style={{
                                width: "100%",
                                maxHeight: "200px",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </div>

                        <div className="modal-footer d-flex justify-content-end">
                          <button type="submit" className="btn btn-primary">
                            {editingIndex !== null
                              ? "Update Workbook"
                              : "Create Workbook"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary ms-2"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
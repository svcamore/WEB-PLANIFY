import "./App.css";
import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "./components/sidebar";
import NotificationPopup from "./components/Notif";
import React from "react";

function App() {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const { id } = useParams();
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("Notes");
  const [showAddNotePopup, setShowAddNotePopup] = useState(false);
  const [showEditNotePopup, setShowEditNotePopup] = useState(false);
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  // Add state to track which note's menu is currently open
  const [activeMenuId, setActiveMenuId] = useState(null);

  //get workbook id and id ntoes
  const [notesId, setNotesId] = useState("");
  const [workbookId, setWorkbookId] = useState("");

  const [workbook, setWorkbook] = useState({});
  const fetchWorkbooks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token tidak ditemukan.");
      return null;
    }

    try {
      const res = await fetch(`${API_URL}/workbook/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal fetch workbook: ${res.status}`);
      }

      const data = await res.json();

      // Misalnya struktur respon: { id: 1, name: "Workbook A", ... }
      // return data.name || null;
      setWorkbook(data);

    } catch (err) {
      console.error("Error mengambil nama workbook:", err.message);
      return null;
    }
  };
  // Ref for tracking clicks outside the menu
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
  const [user, setUser] = useState(null);
  const fetchUser = async () => {
    // const token = localStorage.getItem("token"); // Ambil token dari localStorage
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
    } catch (err) {
      console.error("Gagal ambil user:", err);
    }
  };
  // Handle clicks outside of the menu
  useEffect(() => {
    fetchUser();
    fetchNoteByWorkbookId(id);
    fetchWorkbooks();
  },[]);

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const openAddNotePopup = () => {
    setShowAddNotePopup(true);
  };

  const closeAddNotePopup = () => {
    setShowAddNotePopup(false);
    setNoteTitle("");
    setNoteContent("");
  };

  // const saveNote = () => {
  //   if (noteTitle.trim() === "") {
  //     alert("Judul catatan tidak boleh kosong!");
  //     return;
  //   }

  //   const newNote = {
  //     id: Date.now(),
  //     title: noteTitle,
  //     content: noteContent,
  //   };

  //   setNotes([newNote, ...notes]);
  //   closeAddNotePopup();
  // };

  // Toggle the menu for a specific note
  const toggleNoteMenu = (noteId, e) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === noteId ? null : noteId);
  };

  // Handle note actions
  const handleNoteAction = async (action, noteId) => {
    switch (action) {
      case "Edit":
        // Find the note to edit
        const noteToEdit = notes.find((note) => note.id === noteId);
        if (noteToEdit) {
          setNotesId(noteToEdit.id);
          setWorkbookId(noteToEdit.workbook_id)
          setNoteTitle(noteToEdit.title);
          setNoteContent(noteToEdit.content);
          setShowEditNotePopup(true);
          // Remove the old note
          // setNotes(notes.filter((note) => note.id !== noteId));
        }
        break;
      case "Detail":
        alert(
          `Note Details: ${notes.find((note) => note.id === noteId)?.title}`
        );
        break;
      case "Delete":
        try {
          await fetch(`${API_URL}/notes/${noteId}`, {
            method: "DELETE",
            headers,
          });
          setNotes(notes.filter((note) => note.id !== noteId));
        } catch (err) {
          console.error("Gagal hapus catatan:", err);
        }
        break;
      default:
        break;
    }
    setActiveMenuId(null);
  };
  const tabRoutes = {
    Calendar: "/kalender/"+id,
    Tasks: "/task/"+id,
    Notes: "/notes/"+id,
  };
  const saveNote = async () => {
    if (noteTitle.trim() === "") {
      alert("Judul catatan tidak boleh kosong!");
      return;
    }

    const newNote = {
      title: noteTitle,
      content: noteContent,
      workbook_id: id, // atau ID workbook yang sedang aktif
    };

    try {
      const res = await fetch(API_URL+"/notes", {
        method: "POST",
        headers,
        body: JSON.stringify(newNote),
      });

      if (!res.ok) throw new Error("Gagal menyimpan catatan");

      // const savedNote = await res.json();
      // setNotes([savedNote, ...notes]);
      fetchNoteByWorkbookId(id);
      closeAddNotePopup();
    } catch (err) {
      console.error("Error saat menyimpan catatan:", err);
    }
  };
  const updateNote = async () => {
    const updatedNote = {
      title: noteTitle,
      content: noteContent
    };
    try {
      const res = await fetch(`${API_URL}/notes/${notesId}/${workbookId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedNote),
      });

      if (!res.ok) throw new Error("Gagal update catatan");

      const result = await res.json();
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? result : note))
      );
      setShowEditNotePopup(false);
      fetchNoteByWorkbookId(id);
    } catch (err) {
      console.error("Error saat update catatan:", err);
    }
  };
  const fetchNoteByWorkbookId = async (noteId) => {
    try {
      const res = await fetch(`${API_URL}/notes?workbook_id=${noteId}`, {
        headers,
      });

      if (!res.ok) throw new Error("Gagal ambil detail catatan");

      const note = await res.json();
      setNotes(note);
      // console.log("Detail note:", note);
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <title>Planify - Notes</title>
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
            {
              (!user || user.tier !== "premium") && (
                <i
                  className="fas fa-gem toggle-sidebar mb-1"
                  onClick={toggleRightSidebar}
                />
              )
            }
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
              <button className="btn-icon" aria-label="Notification" onClick={() => setIsNotifOpen(true)}>
                <i className="far fa-bell"></i>
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
                    src={"http://127.0.0.1:3000"+user.photo_profile}
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

          <section
            aria-label="Workbook and notes content"
            className="workbook-container"
          >
            <div className="workbook-header">
              <h1 className="workbook-title">{workbook ?(workbook.title)+" Workbook's":"Default Workbook"}</h1>
            </div>

            <nav aria-label="Workbook tabs" className="tab-nav" role="tablist">
              {Object.keys(tabRoutes).map((tab) => {
                const iconClass =
                  tab === "Calendar" ? "calendar" : tab === "Tasks" ? "tasks" : "sticky-note";

                return (
                  <Link
                    to={tabRoutes[tab]}
                    key={tab}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      className={`tab-item ${activeTab === tab ? "active" : ""}`}
                      onClick={() => handleTabClick(tab)}
                      role="tab"
                      aria-selected={activeTab === tab}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") handleTabClick(tab);
                      }}
                    >
                      <i className={`fas fa-${iconClass}`} style={{ marginRight: "6px" }} />
                      {tab}
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="notes-container">
              <div
                className="add-note-btn"
                onClick={openAddNotePopup}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openAddNotePopup();
                  }
                }}
              >
                <span>Add Note</span>
                <i className="fas fa-plus"></i>
              </div>

              <div className="notes-grid">
                {notes.length === 0 && <p>Tidak ada catatan.</p>}
                {notes.map((note) => (
                  <div
                    className="note-card"
                    key={note.id}
                    style={{ position: "relative" }}
                  >
                    <div className="note-actions">
                      <i
                        className="fas fa-ellipsis-h"
                        onClick={(e) => toggleNoteMenu(note.id, e)}
                        style={{ cursor: "pointer" }}
                      ></i>

                      {activeMenuId === note.id && (
                        <div
                          className="crud-menu"
                          ref={menuRef}
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
                          {["Edit", "Detail", "Delete"].map((action) => (
                            <div
                              key={action}
                              onClick={() => handleNoteAction(action, note.id)}
                              style={{
                                padding: "12px 20px",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "#333",
                                transition: "background-color 0.2s",
                                zIndex: "10000",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = "#f5f5f5")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "white")
                              }
                            >
                              {action}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <h3 className="note-title">{note.title}</h3>
                    <div className="note-content">{note.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      <div
        className={`custom-popup-overlay ${showAddNotePopup ? "active" : ""}`}
        onClick={() => setShowAddNotePopup(false)} // Klik area luar menutup popup
      >
        <div
          className="custom-popup-box"
          role="dialog"
          aria-modal="true"
          aria-labelledby="popupTitle"
          onClick={(e) => e.stopPropagation()} // Mencegah klik dalam popup menutup
        >
          <h5 className="custom-popup-title" id="popupTitle">
            Add Note
          </h5>

          <form
            className="popup-form"
            onSubmit={(e) => {
              e.preventDefault();
              saveNote();
            }}
            id="noteForm"
          >
            <div className="custom-form-group">
              <label htmlFor="noteTitle" className="custom-label">
                Title
              </label>
              <input
                type="text"
                id="noteTitle"
                className="custom-input"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="custom-form-group">
              <label htmlFor="noteContent" className="custom-label">
                Content
              </label>
              <textarea
                id="noteContent"
                className="custom-input"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </div>

            <div className="custom-popup-actions1">
              <div className="popup-tools">
                <button type="button" className="popup-tool" title="Add Emoji">
                  <i className="far fa-smile"></i>
                </button>
                <button
                  type="button"
                  className="popup-tool"
                  title="Add Checklist"
                >
                  <i className="fas fa-tasks"></i>
                </button>
                <button type="button" className="popup-tool" title="Add Image">
                  <i className="far fa-image"></i>
                </button>
                <button
                  type="button"
                  className="popup-tool"
                  title="Add Reminder"
                >
                  <i className="far fa-bell"></i>
                </button>
              </div>

              <button type="button" className="btn-save" onClick={saveNote}>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* update notes */}
      <div
        className={`custom-popup-overlay ${showEditNotePopup ? "active" : ""}`}
        onClick={() => setShowEditNotePopup(false)} // Klik area luar menutup popup
      >
        <div
          className="custom-popup-box"
          role="dialog"
          aria-modal="true"
          aria-labelledby="popupTitle"
          onClick={(e) => e.stopPropagation()} // Mencegah klik dalam popup menutup
        >
          <h5 className="custom-popup-title" id="popupTitle">
            Edit Note
          </h5>

          <form
            className="popup-form"
            onSubmit={(e) => {
              e.preventDefault();
              updateNote();
            }}
            id="noteForm"
          >
            <div className="custom-form-group">
              <label htmlFor="noteTitle" className="custom-label">
                Title
              </label>
              <input
                type="text"
                id="noteTitle"
                className="custom-input"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="custom-form-group">
              <label htmlFor="noteContent" className="custom-label">
                Content
              </label>
              <textarea
                id="noteContent"
                className="custom-input"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </div>

            <div className="custom-popup-actions1">
              <div className="popup-tools">
                <button type="button" className="popup-tool" title="Add Emoji">
                  <i className="far fa-smile"></i>
                </button>
                <button
                  type="button"
                  className="popup-tool"
                  title="Add Checklist"
                >
                  <i className="fas fa-tasks"></i>
                </button>
                <button type="button" className="popup-tool" title="Add Image">
                  <i className="far fa-image"></i>
                </button>
                <button
                  type="button"
                  className="popup-tool"
                  title="Add Reminder"
                >
                  <i className="far fa-bell"></i>
                </button>
              </div>

              <button type="button" className="btn-save" onClick={updateNote}>
                Update
              </button>
            </div>
          </form>
        </div>
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

import React, { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import NotificationPopup from "../components/Notif";
import "../pages/kalender.css";

function App() {
  const API_URL = process.env.REACT_APP_API_URL;
  // mengambil parameter id dari link
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("Calendar");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [taskInputVisible, setTaskInputVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(5); // Indeks untuk bulan Mei
  const months = [
  { name: "January", year: 2025 },
  { name: "February", year: 2025 },
  { name: "March", year: 2025 },
  { name: "April", year: 2025 },
  { name: "May", year: 2025 },
  { name: "June", year: 2025 },
  { name: "July", year: 2025 },
  { name: "August", year: 2025 },
  { name: "September", year: 2025 },
  { name: "October", year: 2025 },
  { name: "November", year: 2025 },
  { name: "December", year: 2025 },
];
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
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    dueDate: "",
    reminderDate: "",
    reminderTime: "",
    status: "To Do",
  });
  const fileInputRef = useRef(null);
  const linkInputRef = useRef(null);
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

  const [taskDetails, setTaskDetails] = useState({});

  const getTaskDetail = () =>{
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(API_URL+"/calender_events",{
      headers: {
      Authorization: `Bearer ${token}`,
    },
    })
      .then((res) => res.json())
      .then((data) => {
        const newTasks = {};
        data.forEach((task) => {
          const startDate = new Date(task.start_date);
          const createdDate = new Date(task.created_at);

          const year = startDate.getFullYear();
          const month = String(startDate.getMonth() + 1).padStart(2, '0'); // bulan dari 0-11
          const day = String(startDate.getDate()).padStart(2, '0');

          const formattedStartDate = `${year}-${month}-${day}`;
          newTasks[formattedStartDate] = {
            title: task.title,
            description: task.description,
            status: task.status,
            createdBy: "img/profile.png", // or map from `task.created_by` if needed
            dueDate: startDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            createdDate: createdDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            link: task.link,
            file: task.file || "empty",
          };
        });

        // Merge existing taskDetails with newTasks
        setTaskDetails(newTasks);
      })
      .catch((err) => console.error("Gagal mengambil data task:", err));
  }
  // Fungsi saat ikon file diklik
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  // Fungsi saat ikon link diklik
  const handleLinkClick = () => {
    linkInputRef.current.focus();
  };

  const menuRef = useRef(null);

  const [user, setUser] = useState(null);
  const fetchUser = async () => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
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
  useEffect(() => {
    fetchUser();
    // function handleClickOutside(event) {
    //   if (menuRef.current && !menuRef.current.contains(event.target)) {
    //     setActiveMenuId(null);
    //   }
    // }
    getTaskDetail();
    fetchWorkbooks();
    // document.addEventListener("mousedown", handleClickOutside);
    // return () => {
    //   document.removeEventListener("mousedown", handleClickOutside);
    // };
  },[]);

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const openPopup = (date) => {
    const data = taskDetails[date];
    if (data) {
      setPopupData(data);
      setPopupVisible(true);
      setCurrentDate(date);
    } else {
      setCurrentDate(date);
      setTaskInputVisible(true);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPopupData({});
  };

  const handleSaveTask = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token tidak tersedia");
      return;
    }

    const startDate = new Date(currentDate);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 jam untuk end_date

    const requestBody = {
      workbook_id: id, // Ubah sesuai kebutuhan
      title: newTask.name,
      description: newTask.description,
      status: newTask.status, // Atur sesuai kebutuhan (bisa juga ambil dari newTask.status)
      created_by: user.name, // Atur sesuai user login, atau ambil dari state
      start_date: startDate.toISOString().slice(0, 19).replace("T", " "),
      end_date: endDate.toISOString().slice(0, 19).replace("T", " "),
      link: "", // Bisa tambahkan input jika mau
      file: "empty", // Default file
    };

    fetch(API_URL+"/calender_events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Gagal menyimpan task ke server.");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Task berhasil disimpan ke server:", data);

      // Tambahkan ke state lokal juga agar langsung muncul di UI
      const currentDateKey = newTask.dueDate.split("T")[0]; // yyyy-mm-dd
      const createdDate = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      // setTaskDetails((prev) => ({
      //   ...prev,
      //   [currentDateKey]: {
      //     title: newTask.name,
      //     description: newTask.description,
      //     status: "●",
      //     createdBy: "img/profile.png",
      //     dueDate: newTask.dueDate,
      //     createdDate: createdDate,
      //     link: "",
      //     file: "empty",
      //   },
      // }));

      // Reset form
      setTaskInputVisible(false);
      setNewTask({
        name: "",
        description: "",
        dueDate: "",
        reminderDate: "",
        reminderTime: "",
        status: "To Do",
      });
      getTaskDetail();
    })
    .catch((err) => {
      console.error("Gagal menyimpan task:", err);
    });
  };

  const tabRoutes = {
    Calendar: "/kalender/"+id,
    Tasks: "/task/"+id,
    Notes: "/notes/"+id,
  };
    const nextMonth = () => {
    setCurrentMonthIndex((prevIndex) => (prevIndex + 1) % 12);
  };

  const previousMonth = () => {
    setCurrentMonthIndex((prevIndex) => (prevIndex - 1 + 12) % 12);
  };

  const getDaysInMonth = (monthIndex) => {
    return new Date(2025, monthIndex + 1, 0).getDate(); // Menghitung jumlah hari dalam bulan
  };

  const getFirstDayOfMonth = (monthIndex) => {
    return new Date(2025, monthIndex, 1).getDay(); // Menghitung hari pertama bulan
  };

  const daysInMonth = getDaysInMonth(currentMonthIndex);
  const firstDay = getFirstDayOfMonth(currentMonthIndex);
  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <title>Planify - Calendar</title>
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

            <div className="calendar-header">
              <div className="month-nav" role="group">
                <button
                  aria-label="Previous month"
                  className="nav-arrow"
                  tabIndex="0"
                  type="button"
                  onClick={previousMonth}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div
                  aria-atomic="true"
                  aria-live="polite"
                  className="month-title"
                  onContextMenu={(e) => {
                    e.preventDefault(); // Mencegah menu konteks default
                    nextMonth(); // Pindah ke bulan selanjutnya saat klik kanan
                  }}
                >
                  {months[currentMonthIndex].name}{" "}
                  {months[currentMonthIndex].year}
                </div>
                <button
                  aria-label="Next month"
                  className="nav-arrow"
                  tabIndex="0"
                  type="button"
                  onClick={nextMonth}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <table
              aria-label={`Calendar for ${months[currentMonthIndex].name} ${months[currentMonthIndex].year}`}
              className="calendar-grid"
              role="grid"
            >
              <thead>
                <tr>
                  <th scope="col">Sunday</th>
                  <th scope="col">Monday</th>
                  <th scope="col">Tuesday</th>
                  <th scope="col">Wednesday</th>
                  <th scope="col">Thursday</th>
                  <th scope="col">Friday</th>
                  <th scope="col">Saturday</th>
                </tr>
              </thead>
              <tbody>
                {/* Render Tanggal */}
                {Array.from({ length: 6 }, (_, weekIndex) => (
                  <tr key={weekIndex}>
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const dayNumber = weekIndex * 7 + dayIndex - firstDay + 1;
                      return (
                        <td
                          key={dayIndex}
                          onClick={() => {
                            if (dayNumber > 0 && dayNumber <= daysInMonth) {
                              openPopup(
                                `${months[currentMonthIndex].year}-${String(
                                  currentMonthIndex + 1
                                ).padStart(2, "0")}-${String(
                                  dayNumber
                                ).padStart(2, "0")}`
                              );
                            }
                          }}
                        >
                          {dayNumber > 0 && dayNumber <= daysInMonth ? (
                            <div className="day-number">{dayNumber}</div>
                          ) : (
                            <div className="day-number"></div>
                          )}
                          <div className="event-list">
                            {taskDetails[
                              `${months[currentMonthIndex].year}-${String(
                                currentMonthIndex + 1
                              ).padStart(2, "0")}-${String(dayNumber).padStart(
                                2,
                                "0"
                              )}`
                            ] && (
                              <div
                                className={`event ${
                                  taskDetails[
                                    `${months[currentMonthIndex].year}-${String(
                                      currentMonthIndex + 1
                                    ).padStart(2, "0")}-${String(
                                      dayNumber
                                    ).padStart(2, "0")}`
                                  ].status === "To Do"
                                    ? "event-blue"
                                    : taskDetails[
                                        `${
                                          months[currentMonthIndex].year
                                        }-${String(
                                          currentMonthIndex + 1
                                        ).padStart(2, "0")}-${String(
                                          dayNumber
                                        ).padStart(2, "0")}`
                                      ].status === "Doing"
                                    ? "event-yellow"
                                    : "event-green" // Status "Done"
                                }`}
                                title={
                                  taskDetails[
                                    `${months[currentMonthIndex].year}-${String(
                                      currentMonthIndex + 1
                                    ).padStart(2, "0")}-${String(
                                      dayNumber
                                    ).padStart(2, "0")}`
                                  ].title
                                }
                              >
                                {
                                  taskDetails[
                                    `${months[currentMonthIndex].year}-${String(
                                      currentMonthIndex + 1
                                    ).padStart(2, "0")}-${String(
                                      dayNumber
                                    ).padStart(2, "0")}`
                                  ].title
                                }
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Popup Overlay for Task Details */}
            {popupVisible && (
              <div className="modal" style={{ display: "flex" }}>
                <div className="modal-content2">
                  <span className="close-btn" onClick={closePopup}>
                    &times;
                  </span>
                  <h2>{popupData.title}</h2>
                  <p>{popupData.description}</p>
                  <div className="task-info">
                    <p>
                      <strong>Status:</strong>{" "}
                      {popupData.status === "To Do" && (
                        <span
                          style={{
                            backgroundColor: "#4361ee",
                            color: "white",
                            padding: "5px 15px",
                            borderRadius: "20px",
                            display: "inline-block",
                            fontSize: "14px",
                          }}
                        >
                          <i className="text-secondary me-1"></i> To Do
                        </span>
                      )}
                      {popupData.status === "Doing" && (
                        <span
                          style={{
                            backgroundColor: "yellow",
                            color: "black",
                            padding: "5px 15px",
                            borderRadius: "20px",
                            display: "inline-block",
                            fontSize: "14px",
                          }}
                        >
                          <i className=" text-warning me-1"></i> Doing
                        </span>
                      )}
                      {popupData.status === "Done" && (
                        <span
                          style={{
                            backgroundColor: "#06d6a0",
                            color: "white",
                            padding: "5px 15px",
                            borderRadius: "20px",
                            display: "inline-block",
                            fontSize: "14px",
                          }}
                        >
                          <i className="text-success me-1"></i> Done
                        </span>
                      )}
                    </p>

                    <p>
                      <strong>Created by:</strong>{" "}
                      <img
                        src={popupData.createdBy}
                        alt="User  "
                        style={{
                          borderRadius: "50%",
                          verticalAlign: "middle",
                          width: 24,
                          height: 24,
                        }}
                      />
                    </p>
                    <p>
                      <strong>Due Date:</strong> {popupData.dueDate}
                    </p>
                    <p>
                      <strong>Created Date:</strong> {popupData.createdDate}
                    </p>
                    <p>
                      <strong>Link:</strong>
                      {popupData.link ? (
                        <a
                          href={popupData.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Link
                        </a>
                      ) : (
                        "No link available"
                      )}
                    </p>
                    <p>
                      <strong>File:</strong> {popupData.file}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Task Input Form Overlay */}
            {taskInputVisible && (
              <div className="modal2" style={{ display: "flex" }}>
                <div className="modal-content2">
                  <span
                    className="close-btn"
                    onClick={() => setTaskInputVisible(false)}
                    style={{ cursor: "pointer" }}
                  >
                    &times;
                  </span>
                  <h4 style={{ paddingBottom: "30px", textAlign: "center" }}>
                    Add New Task
                  </h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveTask();
                    }}
                  >
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="taskName" className="form-label">
                          Task Name
                        </label>
                        <input
                          type="text"
                          id="taskName"
                          className="form-control"
                          value={newTask.name}
                          onChange={(e) =>
                            setNewTask({ ...newTask, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label d-block">
                          Task Status
                        </label>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="taskStatus"
                            id="statusTodo"
                            value="To Do" // Pastikan ada spasi di sini
                            checked={newTask.status === "To Do"} // Pastikan perbandingan juga menggunakan "To Do"
                            onChange={(e) =>
                              setNewTask({ ...newTask, status: e.target.value })
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="statusTodo"
                            style={{
                              backgroundColor: "#4361ee",
                              color: "white",
                              padding: "5px 10px",
                              borderRadius: "20px",
                            }}
                          >
                            <i className="text-secondary me-1"></i> To Do
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="taskStatus"
                            id="statusDoing"
                            value="Doing"
                            checked={newTask.status === "Doing"}
                            onChange={(e) =>
                              setNewTask({ ...newTask, status: e.target.value })
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="statusDoing"
                            style={{
                              backgroundColor: "yellow",
                              color: "black",
                              padding: "5px 10px",
                              borderRadius: "20px",
                            }}
                          >
                            <i className="text-warning me-1"></i> Doing
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="taskStatus"
                            id="statusDone"
                            value="Done"
                            checked={newTask.status === "Done"}
                            onChange={(e) =>
                              setNewTask({ ...newTask, status: e.target.value })
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="statusDone"
                            style={{
                              backgroundColor: "#06d6a0",
                              color: "white",
                              padding: "5px 10px",
                              borderRadius: "20px",
                            }}
                          >
                            <i className="text-success me-1"></i> Done
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="taskDescription" className="form-label">
                          Description
                        </label>
                        <textarea
                          id="taskDescription"
                          className="form-control"
                          value={newTask.description}
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              description: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="taskDueDate" className="form-label">
                          Due Date
                        </label>
                        <input
                          type="date"
                          id="taskDueDate"
                          className="form-control"
                          value={newTask.dueDate}
                          onChange={(e) =>
                            setNewTask({ ...newTask, dueDate: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label
                          htmlFor="taskReminderDate"
                          className="form-label"
                        >
                          Due Date Reminder
                        </label>
                        <input
                          type="date"
                          id="taskReminderDate"
                          className="form-control"
                          value={newTask.reminderDate}
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              reminderDate: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label
                          htmlFor="taskReminderTime"
                          className="form-label"
                        >
                          Reminder Time
                        </label>
                        <input
                          type="time"
                          id="taskReminderTime"
                          className="form-control"
                          value={newTask.reminderTime || ""}
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              reminderTime: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="icon-container">
                      {/* Ikon Upload File */}
                      <i
                        className="fas fa-file-circle-plus icon"
                        title="Upload File"
                        onClick={() => fileInputRef.current.click()}
                      ></i>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          alert(`File selected: ${file?.name}`);
                        }}
                      />

                      {/* Ikon Link */}
                      <i
                        className="fas fa-link icon ms-2"
                        title="Add Link"
                        onClick={() => linkInputRef.current.focus()}
                      ></i>
                      <input
                        type="url"
                        ref={linkInputRef}
                        placeholder="https://example.com"
                        className="hidden-link-input"
                        onChange={(e) => {
                          setNewTask({
                              ...newTask,
                              link: e.target.value,
                            })
                        }}
                      />
                    </div>

                    <div className="text-end">
                      <button type="submit" className="btn btn-primary">
                        Save Task
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
          {/* Notification Popup */}
      <NotificationPopup
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={dummyNotifications}
      />
        </main>
      </div>
    </>
  );
}

export default App;

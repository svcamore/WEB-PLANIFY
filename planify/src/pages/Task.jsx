import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import NotificationPopup from "../components/Notif";
import "../pages/task.css";

function App() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("Tasks");
  const [taskInputVisible, setTaskInputVisible] = useState(false);
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
  const [newTask, setNewTask] = useState({
  name: "",
  description: "",
  dueDate: "",
  reminderDate: "",
  reminderTime: "",
  link: "", // tambahkan ini
});

  const [tasks, setTasks] = useState({
    "To Do": [],
    Doing: [],
    Done: [],
  });
  const [currentColumn, setCurrentColumn] = useState("To Do");
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
  // Fungsi pengecekan task
  const fetchTaskById = async (workbook_id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/tasks/${workbook_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 404) {
          console.info(`Workbook ${workbook_id} belum punya task.`);
          setTasks({ "To Do": [], Doing: [], Done: [] });
          return;
        }

        // if (!res.ok) {
        //   throw new Error(`HTTP error! status: ${res.status}`);
        // }

        const data = await res.json();

        const categorizedTasks = {
          "To Do": [],
          Doing: [],
          Done: [],
        };

        data.forEach((task) => {
          const startDate = new Date(task.due_date);
          const createdDate = new Date(task.created_at);

          const taskItem = {
            id: task.id,
            name: task.title,
            description: task.description,
            dueDate: startDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            reminderDate: task.due_date_reminder?.split("T")[0],
            reminderTime: task.reminder_time,
            createdDate: createdDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            link: task.link_file,
            file: task.file || "empty",
            status: "●", // opsional, jika kamu pakai di tampilan
            createdBy: "img/profile.png", // opsional jika kamu ingin icon
          };

          const column =
            task.tipe === "todo"
              ? "To Do"
              : task.tipe === "doing"
              ? "Doing"
              : task.tipe === "done"
              ? "Done"
              : "To Do";

          categorizedTasks[column].push(taskItem);
        });

        setTasks(categorizedTasks);
      })
      .catch((err) => {
        // console.error("Gagal ambil task:", err.message);
      });
  };



  const createTaskToAPI = async (taskData, tipe) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await axios.post(API_URL+"/tasks", {
      workbook_id: id, // Sesuaikan jika dinamis
      title: taskData.name,
      description: taskData.description,
      due_date: taskData.dueDate,
      due_date_reminder: taskData.reminderDate,
      reminder_time: taskData.reminderTime,
      link_file: taskData.link || "",
      tipe:tipe
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Task created:", response.data);
    if(response.data.success){
      alert("Berhasil menambahkan task")
    }
    return response; // penting: kembalikan response ke saveTask
  } catch (error) {
    console.error("Error creating task:", error);
    alert("Gagal menyimpan ke server.");
    throw error;
  }
};
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
    fetchTaskById(id)
    fetchWorkbooks();
  },[]);

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const openPopup = (column) => {
    setCurrentColumn(column);
    setTaskInputVisible(true);
  };

  const closePopup = () => {
    setTaskInputVisible(false);
    setNewTask({
      name: "",
      description: "",
      dueDate: "",
      reminderDate: "",
      reminderTime: "",
    });
  };

const saveTask = async () => {
  const taskToSave = { ...newTask };

  // Perubahan di sini: Konversi nama kolom ke tipe yang sesuai untuk API
  let taskType;
  switch (currentColumn) {
    case "To Do":
      taskType = "todo";
      break;
    case "Doing":
      taskType = "doing";
      break;
    case "Done":
      taskType = "done";
      break;
    default:
      taskType = "todo"; // Fallback default
  }

  try {
    // Perubahan di sini: Kirim 'taskType' yang sudah ditentukan ke API
    const response = await createTaskToAPI(taskToSave, taskType); 

    if (response && response.data && response.data.data) {
      const savedTask = {
        ...taskToSave,
        id: response.data.data.id, 
        link: taskToSave.link || "",
      };

      setTasks((prevTasks) => ({
        ...prevTasks,
        [currentColumn]: [...prevTasks[currentColumn], savedTask],
      }));

      closePopup();
    }
  } catch (err) {
    console.error("Gagal menyimpan dan menampilkan task:", err);
  }
};


  const deleteTask = (column, index) => {
    const updatedTasks = [...tasks[column]];
    updatedTasks.splice(index, 1);
    setTasks({ ...tasks, [column]: updatedTasks });
  };
  const tabRoutes = {
    Calendar: "/kalender/"+id,
    Tasks: "/task/"+id,
    Notes: "/notes/"+id,
  };

  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <title>Planify - Tasks</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
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
                src="/logoplanifynew.png"
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

          <section className="workbook-container">
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

            <div className="kanban-wrapper">
              {Object.keys(tasks).map((column) => (
                <div key={column} className="kanban-column">
                  <div className="column-header">
                    <div className="column-title">{column}</div>
                  </div>
                  <div className="task-list">
                    {tasks[column].map((task, index) => (
                      <div className="task-card" key={index}>
                        <div className="task-title">{task.name}</div>
                        <div className="task-description">
                          {task.description}
                        </div>
                        <div className="task-due-date">Due: {task.dueDate}</div>
                        <div className="task-reminder">
                          Reminder: {task.reminderDate}
                        </div>
                        <button
                          className="btn btn-sm btn-danger mt-2"
                          onClick={() => deleteTask(column, index)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="add-list-btn"
                    onClick={() => openPopup(column)}
                  >
                    + Add List
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {taskInputVisible && (
        <div className="modal2" style={{ display: "flex" }}>
          <div className="modal-content2">
            <span
              className="close-btn"
              onClick={closePopup}
              style={{ cursor: "pointer" }}
            >
              &times;
            </span>
            <h2>Add New Task</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveTask();
              }}
            >
              <div className="mb-3">
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

              <div className="mb-3">
                <label htmlFor="taskDescription" className="form-label">
                  Description
                </label>
                <textarea
                  id="taskDescription"
                  className="form-control"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
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

              <div className="mb-3">
                <label htmlFor="taskReminderDate" className="form-label">
                  Due Date Reminder
                </label>
                <input
                  type="date"
                  id="taskReminderDate"
                  className="form-control"
                  value={newTask.reminderDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, reminderDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="taskReminderTime" className="form-label">
                  Reminder Time
                </label>
                <input
                  type="time"
                  id="taskReminderTime"
                  className="form-control"
                  value={newTask.reminderTime}
                  onChange={(e) =>
                    setNewTask({ ...newTask, reminderTime: e.target.value })
                  }
                  required
                />
              </div>

              <div className="icon-container mb-3">
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
                    setNewTask({ ...newTask, link: e.target.value });
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

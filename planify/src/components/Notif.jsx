import React from "react";

const defaultNotifications = [
  {
    id: 1,
    user: "Andi",
    action: "menambahkan tugas baru ke 'To Do'",
    time: "2 menit lalu",
  },
  {
    id: 2,
    user: "Budi",
    action: "mengedit catatan pada 'Notes'",
    time: "10 menit lalu",
  },
  {
    id: 3,
    user: "Citra",
    action: "menyelesaikan tugas di 'Doing'",
    time: "1 jam lalu",
  },
];

const NotificationPopup = ({ isOpen, onClose, notifications = [] }) => {
  if (!isOpen) return null;

  const dataToShow = notifications.length > 0 ? notifications : defaultNotifications;

  return (
    <>
      {/* Style CSS */}
      <style>{`
        .notification-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(1px);
          z-index: 1050;
        }

        .notification-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          max-width: 500px;
          z-index: 1060;
          outline: none;
        }

        .notification-item:hover,
        .notification-item:focus {
          background-color: #e0e7ff;
          cursor: pointer;
          outline: none;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="notification-backdrop"
        onClick={onClose}
        aria-label="Close notifications"
      ></div>

      {/* Popup container */}
      <div
        className="notification-popup card shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notificationTitle"
      >
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 id="notificationTitle" className="mb-0">
            Notifications
          </h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>

        <div
          className="card-body overflow-auto"
          style={{ maxHeight: "400px" }}
          tabIndex={0}
        >
          {dataToShow.map((notification) => (
            <div
              key={notification.id}
              className="d-flex align-items-start p-3 mb-3 rounded border border-primary bg-light notification-item"
              role="button"
              tabIndex={0}
              onClick={() => console.log("Clicked:", notification)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  console.log("Clicked:", notification);
                }
              }}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white me-3"
                style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #4f46e5, #9333ea)",
                  fontSize: "20px",
                  userSelect: "none",
                }}
                aria-hidden="true"
              >
                👤
              </div>
              <div>
                <p className="mb-1">
                  <strong className="text-primary">{notification.user}</strong>{" "}
                  {notification.action}
                </p>
                <small className="text-muted">{notification.time}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="card-footer p-3">
          <button
            type="button"
            className="btn btn-outline-primary w-100"
            onClick={() => alert("View all notifications clicked")}
          >
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationPopup;

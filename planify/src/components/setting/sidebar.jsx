import { useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: "👤", label: "Profile", path: "/setting/profile" },
    { icon: "⬆️", label: "Upgrade", path: "/setting/upgrade" },
    { icon: "🌐", label: "Language & Region", path: "/setting/bahasa" }
  ];

  return (
    <div className="sidebar">
      {menuItems.map((item) => (
        <button
          key={item.path}
          className={`sidebar-item ${
            location.pathname === item.path ? "active" : ""
          }`}
          onClick={() => navigate(item.path)}
        >
          <div className="sidebar-icon">{item.icon}</div>
          {item.label}
        </button>
      ))}
    </div>
  );
}

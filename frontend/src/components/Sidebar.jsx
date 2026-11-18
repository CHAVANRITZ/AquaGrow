
import {
  DashboardRounded,
  AnalyticsRounded,
  WaterDropRounded,
  SettingsRounded,
  DevicesRounded,
  AgricultureRounded
} from "@mui/icons-material";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Overview",
    path: "/",
    icon: <DashboardRounded />
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: <AnalyticsRounded />
  },
  {
    title: "Pump Control",
    path: "/pump",
    icon: <WaterDropRounded />
  },
  {
    title: "Irrigation Settings",
    path: "/settings",
    icon: <SettingsRounded />
  },
  {
    title: "Devices",
    path: "/devices",
    icon: <DevicesRounded />
  }
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <AgricultureRounded />
        </div>

        <div>
          <h2>AquaGrow</h2>
          <span>SMART AGRICULTURE</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">WORKSPACE</p>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="connection-dot"></div>
        <div>
          <strong>System Online</strong>
          <span>Backend connected</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

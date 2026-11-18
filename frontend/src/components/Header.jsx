
import {
  NotificationsNoneRounded,
  AccountCircleRounded,
  KeyboardArrowDownRounded,
  MenuRounded
} from "@mui/icons-material";

function Header() {
  return (
    <header className="top-header">
      <div className="header-left">
        <button className="mobile-menu">
          <MenuRounded />
        </button>

        <div>
          <p className="header-breadcrumb">Workspace / Overview</p>
          <h2>Dashboard</h2>
        </div>
      </div>

      <div className="header-right">
        <button className="notification-button">
          <NotificationsNoneRounded />
          <span className="notification-dot"></span>
        </button>

        <div className="header-divider"></div>

        <div className="profile-section">
          <AccountCircleRounded className="profile-icon" />

          <div className="profile-info">
            <strong>Admin</strong>
            <span>Farm Manager</span>
          </div>

          <KeyboardArrowDownRounded />
        </div>
      </div>
    </header>
  );
}

export default Header;

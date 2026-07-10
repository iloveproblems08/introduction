import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "../themetoggle/ThemeToggle";
import "./Sidebar.css";

const SIDEBAR_COLLAPSED_KEY = "portfolio-sidebar-collapsed";

function getInitialCollapsedState() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(getInitialCollapsedState);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  }, [collapsed]);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <button
          className="sidebar-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "☰" : "←"}
        </button>
      </div>

      <nav className="sidebar-nav">
        <SidebarLink to="/home" collapsed={collapsed}>
          Home
        </SidebarLink>

        <SidebarLink to="/about" collapsed={collapsed}>
          About
        </SidebarLink>

        <SidebarLink to="/projects" collapsed={collapsed}>
          Projects
        </SidebarLink>

        <SidebarLink to="/contact" collapsed={collapsed}>
          Contact
        </SidebarLink>
      </nav>

      <div className="sidebar-footer">
        {!collapsed && <span>Theme</span>}
        <ThemeToggle />
      </div>
    </aside>
  );
}

function SidebarLink({ to, children, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-link ${isActive ? "active" : ""}`
      }
    >
      {collapsed ? children.charAt(0) : children}
    </NavLink>
  );
}
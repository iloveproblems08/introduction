import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <>
      <Sidebar />

      <main className="app-content">
        <Outlet />
      </main>
    </>
  );
}
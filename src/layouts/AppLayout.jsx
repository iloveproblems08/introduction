import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
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
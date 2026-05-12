import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../pages/AdminPage/components/SideBar";
import AdminHeader from "../pages/AdminPage/components/Header";

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <div className={`transition-all duration-300 lg:ml-[260px] ${isSidebarOpen ? "ml-0" : ""}`}>
                <div className="sticky top-0 z-40">
                    <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                </div>
                <main className="p-4 md:p-6 lg:p-8 pt-20 md:pt-24 min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
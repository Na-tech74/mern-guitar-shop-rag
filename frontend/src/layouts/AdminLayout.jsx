import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/dashboard/SideBar";
import AdminHeader from "../components/dashboard/Header";

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <div className="flex-1 lg:ml-[260px]">
                <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="p-6 bg-gray-50 min-h-[calc(100vh-70px)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
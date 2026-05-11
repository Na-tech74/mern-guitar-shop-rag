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
            <div className="lg:ml-[260px]">
                <div className="fixed top-0 right-0 left-0 lg:left-[260px] z-40">
                    <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                </div>
                <main className="p-6 pt-[86px] min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
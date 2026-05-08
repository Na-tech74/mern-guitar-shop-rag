// layouts/AuthLayout.jsx

import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/dashboard/SideBar";
import AdminHeader from "../components/dashboard/Header";
import { useState } from "react";

export default function AuthLayout() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <AdminSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* Main */}
            <div className="flex-1 lg:ml-[260px]">

                {/* Header */}
                <div className="fixed left-0 right-0 top-0 z-40 lg:left-[260px]">
                    <AdminHeader
                        toggleSidebar={() => setIsSidebarOpen(true)}
                    />
                </div>

                {/* Content */}
                <main className="pt-[70px] p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../pages/AdminPage/components/SideBar";
import AdminHeader from "../pages/AdminPage/components/Header";

export default function AdminLayout() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
            <div className="min-h-screen bg-gray-100 lg:flex">
                <AdminSidebar
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                />

                <div className="flex min-w-0 flex-1 flex-col">
                    <AdminHeader
                        toggleMobileSidebar={() => setIsMobileOpen((v) => !v)}
                    />
                    <main className="flex-1 p-4 md:p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
    );
}

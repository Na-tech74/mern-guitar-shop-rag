import { Outlet } from "react-router-dom";
import AdminHeader from "../components/dashboard/Header";

export default function AuthLayout() {
    return (
        <>
            <AdminHeader/>
            <main className="container mx-auto mt-4">
                <Outlet />
            </main>
        </>
    )
};
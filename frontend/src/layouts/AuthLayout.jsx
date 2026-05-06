import { Outlet } from "react-router-dom";
import AdminPage from "../pages/AdminPage/AdminPage";

export default function AuthLayout() {
    return (
        <>
            <AdminPage />
            <main className="container mx-auto mt-4">
                <Outlet />
            </main>
        </>
    )
};
import { useEffect } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
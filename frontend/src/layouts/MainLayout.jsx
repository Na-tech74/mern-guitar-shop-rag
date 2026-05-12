import { useState, useEffect, useRef } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    const [headerHeight, setHeaderHeight] = useState(0);
    const headerRef = useRef(null);

    useEffect(() => {
        const header = document.querySelector("header");
        if (!header) return;

        // Đo ngay lần đầu
        setHeaderHeight(header.offsetHeight);

        // Theo dõi nếu header thay đổi kích thước
        const observer = new ResizeObserver(() => {
            setHeaderHeight(header.offsetHeight);
        });

        observer.observe(header);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1" style={{ marginTop: headerHeight }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
import Header from '../components/Header';
import Footer from '../components/Footer'
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <>
            <Header />
            <main className="container mx-auto mt-4">
                <Outlet />
            </main>
            <Footer/>
        </>
    );
}
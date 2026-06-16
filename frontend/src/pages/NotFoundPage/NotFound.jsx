import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../../components/Breadcrumb";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "404 - Không tìm thấy" }]} />
            </div>
            <div className="flex items-center justify-center px-4 py-20">
                <div className="text-center space-y-4">
                    <p className="text-6xl font-bold text-gray-200">404</p>
                    <p className="text-gray-500">Trang không tồn tại.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition"
                    >
                        <FontAwesomeIcon icon={faHouse} className="text-xs" />
                        Trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}

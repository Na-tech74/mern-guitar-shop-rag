import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center space-y-4">
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
    );
}

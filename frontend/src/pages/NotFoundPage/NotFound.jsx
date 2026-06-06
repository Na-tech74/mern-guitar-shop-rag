import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="text-center space-y-6">
                <div className="relative inline-block">
                    <span className="text-[150px] font-bold text-gray-100 block leading-none">404</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FontAwesomeIcon icon={faHome} className="text-6xl text-gray-700" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-100">Trang không tồn tại</h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-amber-700 text-white font-medium rounded-lg transition"
                    >
                        <FontAwesomeIcon icon={faHome} />
                        Về trang chủ
                    </Link>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 px-6 py-3 border border-gray-600 hover:bg-gray-800 text-gray-200 font-medium rounded-lg transition"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}
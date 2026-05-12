import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center space-y-6">
                <div className="relative inline-block">
                    <span className="text-[150px] font-bold text-amber-100 block leading-none">404</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FontAwesomeIcon icon={faHome} className="text-6xl text-amber-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-800">Trang không tồn tại</h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition"
                    >
                        <FontAwesomeIcon icon={faHome} />
                        Về trang chủ
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}
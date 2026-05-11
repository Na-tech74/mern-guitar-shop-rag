// components/dashboard/AdminHeader.jsx

import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faBell,
    faMessage,
    faSearch,
    faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";

export default function AdminHeader({ toggleSidebar }) {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/");
    };

    return (
        <header className="h-[70px] border-b border-gray-200 bg-white fixed-top">

            <div className="flex h-full items-center gap-4 px-6">

                {/* LEFT */}
                <div className="flex items-center gap-3">

                    <button
                        onClick={toggleSidebar}
                        className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100 lg:hidden"
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>

                    <div className="hidden items-center gap-2 md:flex">

                        <span className="text-sm text-gray-400">
                            Trang chủ
                        </span>

                        <span className="text-gray-300">
                            /
                        </span>

                        <span className="text-sm font-medium text-gray-700">
                            Bảng điều khiển
                        </span>
                    </div>
                </div>

                {/* SEARCH */}
                <div className="relative ml-4 hidden max-w-sm flex-1 lg:block">

                    <FontAwesomeIcon
                        icon={faSearch}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="
                            h-10
                            w-full
                            rounded-xl
                            border
                            border-gray-200
                            bg-gray-50
                            pl-11
                            pr-4
                            text-sm
                            outline-none
                            focus:border-amber-500
                            focus:bg-white
                        "
                    />
                </div>

                {/* RIGHT */}
                <div className="ml-auto flex items-center gap-2">

                    <button className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100">
                        <FontAwesomeIcon icon={faBell} />

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
                    </button>

                    <button className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100">
                        <FontAwesomeIcon icon={faMessage} />
                    </button>

                    <div className="mx-2 h-5 w-[1px] bg-gray-200" />

                    <div className="flex items-center gap-2">

                        <button
                            onClick={handleLogout}
                            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                            title="Đăng xuất"
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
} 
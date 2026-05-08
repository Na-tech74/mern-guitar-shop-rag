import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faSearch, faUserCircle, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import useLogout from "../../hooks/auth/useLogout";
export default function AdminHeader({ toggleSidebar }) {

    const { userInfo, handleLogout } = useLogout();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="flex items-center justify-between px-4 py-3 lg:px-6">

                {/* LEFT */}
                <div className="flex items-center gap-3">
                    <button onClick={toggleSidebar} className="flex h-10 w-10 items-center justify-center rounded-xl border bg-gray-50 hover:bg-gray-100 lg:hidden">
                        <FontAwesomeIcon icon={faBars} className="text-gray-700" />
                    </button>

                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                        <p className="hidden text-sm text-gray-500 md:block">Chào mừng bạn quay lại</p>
                    </div>
                </div>

                {/* SEARCH */}
                <div className="hidden w-full max-w-md lg:block">
                    <div className="relative">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                        />
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                    {/* Notification */}
                    <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100">
                        <FontAwesomeIcon icon={faBell} className="text-gray-700" />

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                    </button>

                    {/* PROFILE */}
                    <div className="group relative">
                        <button className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                                <FontAwesomeIcon icon={faUserCircle} />
                            </div>

                            <div className="hidden text-left md:block">
                                <h4 className="text-sm font-semibold text-gray-800">
                                    {userInfo?.name || "admin"}
                                </h4>

                                <p className="text-xs text-gray-500">
                                    {userInfo?.email || "admin@gmail.com"}
                                </p>
                            </div>

                        </button>

                        {/* Dropdown */}
                        <div className="invisible absolute right-0 top-14 w-52 translate-y-2 rounded-2xl border border-gray-100 bg-white p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">

                            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-gray-100">
                                <FontAwesomeIcon icon={faUserCircle} />
                                Profile
                            </button>

                            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-gray-100">
                                <FontAwesomeIcon icon={faCog} />
                                Settings
                            </button>

                            <div className="my-2 border-t" />

                            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                                onClick={handleLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                Đang xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
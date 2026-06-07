import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../assets/images/logo.jpg";
import {
    faXmark,
    faChartPie,
    faBox,
    faUsers,
    faCartShopping,
    faTag,
    faGear,
    faNewspaper,
    faVideo,
    faHouse,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

function NavItem({ to, icon, name, end }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                        ? "bg-amber-400 text-white"
                        : "text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                }`
            }
        >
            <FontAwesomeIcon icon={icon} className="text-base shrink-0" />
            <span className="truncate">{name}</span>
        </NavLink>
    );
}

export default function AdminSidebar({ isMobileOpen, setIsMobileOpen }) {
    return (
        <>
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    aria-label="Đóng menu"
                />
            )}

            <aside
                className={`
                    fixed left-0 top-0 z-50 h-screen w-[240px]
                    bg-white border-r border-gray-200
                    flex flex-col transition-transform duration-200
                    lg:sticky lg:translate-x-0
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* LOGO */}
                <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 h-[100px] px-4">
                    <img
                        src={logo}
                        alt="Nam Acoustic"
                        className="h-10 w-auto object-contain"
                    />
                    <button
                        type="button"
                        onClick={() => setIsMobileOpen(false)}
                        className="ml-auto flex size-7 items-center justify-center rounded text-gray-500 hover:bg-gray-100 lg:hidden"
                        aria-label="Đóng"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* MENU */}
                <nav className="flex-1 overflow-y-auto p-2">
                    <ul className="space-y-1">
                        <li>
                            <NavItem to="/admin" icon={faChartPie} name="Bảng điều khiển" end />
                        </li>
                        <li>
                            <NavItem to="/admin/home-content" icon={faHouse} name="Trang chủ" />
                        </li>
                        <li>
                            <NavItem to="/admin/about-content" icon={faInfoCircle} name="Giới thiệu" />
                        </li>
                        <li>
                            <NavItem to="/admin/products" icon={faBox} name="Sản phẩm" />
                        </li>
                        <li>
                            <NavItem to="/admin/orders" icon={faCartShopping} name="Đơn hàng" />
                        </li>
                        <li>
                            <NavItem to="/admin/users" icon={faUsers} name="Người dùng" />
                        </li>
                        <li>
                            <NavItem to="/admin/categories" icon={faTag} name="Danh mục" />
                        </li>
                        <li>
                            <NavItem to="/admin/courses" icon={faVideo} name="Khóa học" />
                        </li>
                        <li>
                            <NavItem to="/admin/blog" icon={faNewspaper} name="Blog" />
                        </li>
                    </ul>
                </nav>

                {/* FOOTER - Cài đặt */}
                <div className="shrink-0 border-t border-gray-200 p-2">
                    <NavLink
                        to="/admin/settings"
                        onClick={() => setIsMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                                isActive
                                    ? "bg-amber-500 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                            }`
                        }
                    >
                        <FontAwesomeIcon icon={faGear} className="text-base shrink-0" />
                        <span className="truncate">Cài đặt</span>
                    </NavLink>
                </div>
            </aside>
        </>
    );
}

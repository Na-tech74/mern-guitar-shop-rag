import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../../../components/Logo";
import Button from "../../../components/Button";
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
    faCopyright,
    faChevronDown,
    faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function NavItem({ to, icon, name, end }) {
    return (
        <NavLink
            to={to}
            end={end}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-gray-700 hover:bg-amber-50 hover:text-amber-600"
        >
            <FontAwesomeIcon icon={icon} className="text-base shrink-0" />
            <span className="truncate">{name}</span>
        </NavLink>
    );
}

function NavSection({ icon, name, defaultOpen = true, children }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <li>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600"
            >
                <FontAwesomeIcon icon={icon} className="text-base shrink-0" />
                <span className="flex-1 text-left truncate">{name}</span>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`size-3 transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
                />
            </button>
            {open && <ul className="ml-2 mt-1 space-y-1">{children}</ul>}
        </li>
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
                <div className="relative flex items-center justify-center shrink-0 border-b border-gray-200 h-[100px] px-4">
                    <Logo className="p-0 -ml-5" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMobileOpen(false)}
                        className="absolute right-2 top-0 lg:hidden"
                        aria-label="Đóng"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </Button>
                </div>

                {/* MENU */}
                <nav className="flex-1 overflow-y-auto p-2">
                    <ul className="space-y-1">
                        <li>
                            <NavItem to="/admin" icon={faChartPie} name="Bảng điều khiển" end />
                        </li>
                        <NavSection icon={faHouse} name="Giao diện CMS">
                            <li>
                                <NavItem to="/admin/home-content" icon={faHouse} name="Trang chủ" />
                            </li>
                            <li>
                                <NavItem to="/admin/about-content" icon={faInfoCircle} name="Giới thiệu" />
                            </li>
                            <li>
                                <NavItem to="/admin/footer-content" icon={faCopyright} name="Footer" />
                            </li>
                            <li>
                                <NavItem to="/admin/courses" icon={faVideo} name="Khóa học" />
                            </li>
                            <li>
                                <NavItem to="/admin/blog" icon={faNewspaper} name="Blog" />
                            </li>
                            <li>
                                <NavItem to="/admin/contact-content" icon={faEnvelope} name="Liên hệ" />
                            </li>
                        </NavSection>
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
                    </ul>
                </nav>

                {/* FOOTER - Cài đặt */}
                <div className="shrink-0 border-t border-gray-200 p-2">
                    <NavItem
                        to="/admin/settings"
                        icon={faGear}
                        name="Cài đặt"
                    />
                </div>
            </aside>
        </>
    );
}

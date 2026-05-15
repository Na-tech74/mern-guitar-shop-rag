// components/dashboard/AdminSidebar.jsx

import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faXmark, faChartPie, faBox, faUsers, faCartShopping, faTag, faGear, faNewspaper, faImages } from "@fortawesome/free-solid-svg-icons";

const adminSidebarMenuItems = [
    {
        title: "Quản lý",
        items: [
            { name: "Bảng điều khiển", path: "/admin", icon: faChartPie },
            { name: "Sản phẩm", path: "/admin/products", icon: faBox },
            { name: "Đơn hàng", path: "/admin/orders", icon: faCartShopping },
            { name: "Người dùng", path: "/admin/users", icon: faUsers },
            { name: "Danh mục", path: "/admin/categories", icon: faTag },
            { name: "Blog", path: "/admin/blog", icon: faNewspaper },
            { name: "Carousel", path: "/admin/carousels", icon: faImages },
            // { name: "Video", path: "/admin/carousels", icon: faImages }

        ]
    },
    {
        title: "Hệ thống",
        items: [
            { name: "Cài đặt", path: "/admin/settings", icon: faGear },
        ]
    }
];

export default function AdminSidebar({ isSidebarOpen, setIsSidebarOpen }) {

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    return (
        <>
            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-40  lg:hidden"
                />
            )}

            <aside
                className={`
                    fixed left-0 top-0 z-50
                    h-screen w-[260px]
                    border-r border-gray-200
                    bg-white
                    transition-all duration-300
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}
            >

                {/* LOGO */}
                <div className="flex items-center justify-between border-b bg-gray-200  px-3 py-3">

                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
                                Nam Acoustic
                            </h1>
                            <p className="text-sm text-black/40 sm:block">Admin Page <br />Design by Nam Nguyễn</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* MENU */}
                <div className="space-y-6 overflow-y-auto p-3">

                    {adminSidebarMenuItems.map((section, index) => (
                        <div key={index}>

                            <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                                {section.title}
                            </h3>

                            <div className="space-y-1">

                                {section.items.map((item, idx) => (
                                    <NavLink
                                        key={idx}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `
                                            flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all
                                            ${isActive
                                                ? "bg-amber-50 text-amber-700"
                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            }
                                        `
                                        }
                                    >

                                        <FontAwesomeIcon
                                            icon={item.icon}
                                            className="text-base"
                                        />

                                        <span>{item.name}</span>

                                        {item.badge && (
                                            <span
                                                className={`
                                                    ml-auto rounded-full px-2 py-0.5 text-[10px]
                                                    ${item.badge === "New"
                                                        ? "bg-gray-100 text-gray-600"
                                                        : "bg-amber-600 text-white"
                                                    }
                                                `}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* USER */}
                <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 p-3">

                    <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-gray-100">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
                            {userInfo?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <h4 className="truncate text-sm font-semibold text-gray-800">
                                {userInfo?.name}
                            </h4>

                            <p className="truncate text-xs text-gray-500">
                                Quản trị viên
                            </p>
                        </div>

                        <button>
                            <FontAwesomeIcon
                                icon={faEllipsisVertical}
                                className="text-gray-400"
                            />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
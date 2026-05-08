// components/dashboard/AdminSidebar.jsx

import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faBolt,
    faChartPie,
    faChartColumn,
    faFileLines,
    faUsers,
    faBox,
    faCartShopping,
    faTag,
    faGear,
    faBell,
    faEllipsisVertical,
    faXmark
} from "@fortawesome/free-solid-svg-icons";

export default function AdminSidebar({
    isSidebarOpen,
    setIsSidebarOpen
}) {

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const menuItems = [
        {
            title: "Overview",
            items: [
                {
                    name: "Dashboard",
                    path: "/admin",
                    icon: faChartPie,
                    badge: "3"
                },
                {
                    name: "Analytics",
                    path: "/admin/analytics",
                    icon: faChartColumn
                },
                {
                    name: "Reports",
                    path: "/admin/reports",
                    icon: faFileLines,
                    badge: "New"
                }
            ]
        },

        {
            title: "Manage",
            items: [
                {
                    name: "Users",
                    path: "/admin/users",
                    icon: faUsers
                },
                {
                    name: "Products",
                    path: "/admin/products",
                    icon: faBox
                },
                {
                    name: "Orders",
                    path: "/admin/orders",
                    icon: faCartShopping
                },
                {
                    name: "Categories",
                    path: "/admin/categories",
                    icon: faTag
                }
            ]
        },

        {
            title: "System",
            items: [
                {
                    name: "Settings",
                    path: "/admin/settings",
                    icon: faGear
                },
                {
                    name: "Notifications",
                    path: "/admin/notifications",
                    icon: faBell
                }
            ]
        }
    ];

    return (
        <>
            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
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
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                            <FontAwesomeIcon icon={faBolt} />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-gray-800">
                                AdminPanel
                            </h2>

                            <p className="text-[11px] text-gray-400">
                                v2.0
                            </p>
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

                    {menuItems.map((section, index) => (
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
                                                ? "bg-indigo-50 text-indigo-700"
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
                                                        : "bg-indigo-600 text-white"
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
                                Super Admin
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
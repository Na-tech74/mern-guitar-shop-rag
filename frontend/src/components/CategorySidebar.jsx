import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function CategorySidebar({ categories, selectedCategory, onChange }) {
    return (
        <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6 shadow-soft">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-5 bg-amber-400 rounded-full" />
                    <h3 className="font-semibold text-gray-800">Danh mục</h3>
                </div>
                <ul className="space-y-1">
                    <li>
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${!selectedCategory
                                    ? "bg-amber-50 text-amber-600 border-l-2 border-amber-400"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-l-2 border-transparent"
                                }`}
                        >
                            <span className={`size-2 rounded-full ${!selectedCategory ? "bg-amber-400" : "bg-gray-300"}`} />
                            Tất cả
                        </button>
                    </li>
                    {categories.map((cat) => (
                        <li key={cat._id}>
                            <button
                                type="button"
                                onClick={() => onChange(cat._id)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${selectedCategory === cat._id
                                        ? "bg-amber-50 text-amber-600 border-l-2 border-amber-400"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-l-2 border-transparent"
                                    }`}
                            >
                                <span className={`size-2 rounded-full ${selectedCategory === cat._id ? "bg-amber-400" : "bg-gray-300"}`} />
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}

export function MobileFilterDrawer({ open, onClose, categories, selectedCategory, onChange }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[80vw] bg-white shadow-xl flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Danh mục</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-sm" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                    <ul className="space-y-1">
                        <li>
                            <button
                                type="button"
                                onClick={() => { onChange(""); onClose(); }}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${!selectedCategory
                                        ? "bg-amber-50 text-amber-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                    }`}
                            >
                                <span className={`size-2 rounded-full ${!selectedCategory ? "bg-amber-400" : "bg-gray-300"}`} />
                                Tất cả
                            </button>
                        </li>
                        {categories.map((cat) => (
                            <li key={cat._id}>
                                <button
                                    type="button"
                                    onClick={() => { onChange(cat._id); onClose(); }}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${selectedCategory === cat._id
                                            ? "bg-amber-50 text-amber-600"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                        }`}
                                >
                                    <span className={`size-2 rounded-full ${selectedCategory === cat._id ? "bg-amber-400" : "bg-gray-300"}`} />
                                    {cat.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="p-5 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-white rounded-xl text-sm font-medium transition"
                    >
                        Xem kết quả
                    </button>
                </div>
            </div>
        </div>
    );
}

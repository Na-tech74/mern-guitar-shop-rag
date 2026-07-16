import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function CategoryItem({ cat, children, selectedCategory, onChange, depth }) {
    const [expanded, setExpanded] = useState(depth < 1);

    const isSelected = selectedCategory === cat._id;
    const hasChildren = children && children.length > 0;

    const handleClick = () => {
        if (hasChildren) {
            setExpanded(!expanded);
        } else {
            onChange(cat._id);
        }
    };

    return (
        <li>
            <button
                type="button"
                onClick={handleClick}
                className={`flex items-center justify-between w-full text-sm transition ${
                    isSelected
                        ? "text-amber-600 font-semibold"
                        : "text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                } ${depth === 0 ? "px-4 py-2.5" : "px-8 py-2"}`}
                style={{ paddingLeft: `${depth === 0 ? 16 : 24 + depth * 8}px` }}
            >
                <span className={hasChildren ? "font-semibold text-gray-800" : ""}>{cat.name}</span>
                {hasChildren && (
                    <FontAwesomeIcon icon={faChevronDown} className={`text-[10px] text-gray-400 transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`} />
                )}
            </button>
            {hasChildren && expanded && (
                <div className="bg-gray-50/50 rounded-lg mx-2 mb-1 overflow-hidden">
                    {children.map((child) => (
                        <CategoryItem
                            key={child._id}
                            cat={child}
                            children={child.children}
                            selectedCategory={selectedCategory}
                            onChange={onChange}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </li>
    );
}

function buildTree(categories) {
    const map = {};
    const roots = [];
    categories.forEach((cat) => { map[cat._id] = { ...cat, children: [] }; });
    categories.forEach((cat) => {
        const node = map[cat._id];
        if (cat.parent?._id && map[cat.parent._id]) {
            map[cat.parent._id].children.push(node);
        } else if (!cat.parent) {
            roots.push(node);
        }
    });
    return roots;
}

export default function CategorySidebar({ categories, selectedCategory, onChange }) {
    const tree = buildTree(categories);

    return (
        <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6 shadow-soft">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-5 bg-amber-400 rounded-full" />
                    <h3 className="font-semibold text-gray-800">Danh mục</h3>
                </div>
                <ul className="space-y-0.5">
                    <li>
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className={`w-full text-left px-4 py-2.5 text-sm transition ${
                                !selectedCategory
                                    ? "text-amber-600 font-semibold"
                                    : "text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                            }`}
                        >
                            Tất cả
                        </button>
                    </li>
                    {tree.map((cat) => (
                        <CategoryItem
                            key={cat._id}
                            cat={cat}
                            children={cat.children}
                            selectedCategory={selectedCategory}
                            onChange={onChange}
                            depth={0}
                        />
                    ))}
                </ul>
            </div>
        </aside>
    );
}

function MobileCategoryItem({ cat, children, selectedCategory, onChange, onClose, depth }) {
    const [expanded, setExpanded] = useState(depth < 1);

    const isSelected = selectedCategory === cat._id;
    const hasChildren = children && children.length > 0;

    const handleClick = () => {
        if (hasChildren) {
            setExpanded(!expanded);
        } else {
            onChange(cat._id);
            onClose();
        }
    };

    return (
        <li>
            <button
                type="button"
                onClick={handleClick}
                className={`flex items-center justify-between w-full text-sm transition ${
                    isSelected
                        ? "text-amber-600 font-semibold"
                        : "text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                } ${depth === 0 ? "px-4 py-2.5" : "px-8 py-2"}`}
                style={{ paddingLeft: `${depth === 0 ? 16 : 24 + depth * 8}px` }}
            >
                <span className={hasChildren ? "font-semibold text-gray-800" : ""}>{cat.name}</span>
                {hasChildren && (
                    <FontAwesomeIcon icon={faChevronDown} className={`text-[10px] text-gray-400 transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`} />
                )}
            </button>
            {hasChildren && expanded && (
                <div className="bg-gray-50/50 rounded-lg mx-2 mb-1 overflow-hidden">
                    {children.map((child) => (
                        <MobileCategoryItem
                            key={child._id}
                            cat={child}
                            children={child.children}
                            selectedCategory={selectedCategory}
                            onChange={onChange}
                            onClose={onClose}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </li>
    );
}

export function MobileFilterDrawer({ open, onClose, categories, selectedCategory, onChange }) {
    if (!open) return null;

    const tree = buildTree(categories);

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
                    <ul className="space-y-0.5">
                        <li>
                            <button
                                type="button"
                                onClick={() => { onChange(""); onClose(); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition ${
                                    !selectedCategory
                                        ? "text-amber-600 font-semibold"
                                        : "text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                                }`}
                            >
                                Tất cả
                            </button>
                        </li>
                        {tree.map((cat) => (
                            <MobileCategoryItem
                                key={cat._id}
                                cat={cat}
                                children={cat.children}
                                selectedCategory={selectedCategory}
                                onChange={onChange}
                                onClose={onClose}
                                depth={0}
                            />
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

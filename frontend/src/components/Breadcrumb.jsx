import { Link } from "react-router-dom";

export default function Breadcrumb({ items = [] }) {
    return (
        <nav className="text-sm mb-6">
            <ol className="flex items-center gap-2 text-gray-500">
                {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                        {i > 0 && <span className="text-gray-300">/</span>}
                        {item.href ? (
                            <Link to={item.href} className="hover:text-amber-600 transition">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-800 font-medium">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
import { Link } from "react-router-dom";

export default function AuthLink({ to, children, className = "" }) {
    return (
        <Link
            to={to}
            className={`text-amber-600 hover:text-amber-700 hover:underline font-medium ${className}`}
        >
            {children}
        </Link>
    );
}
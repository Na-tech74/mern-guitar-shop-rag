import { Link } from "react-router-dom";

export default function AuthLink({ to, children, className = "" }) {
    return (
        <Link to={to} className={`text-blue-500 hover:underline ${className}`}>
            {children}
        </Link>
    );
}
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function InfoBlock({ icon, title, children }) {
    return (
        <div className="bg-white rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-2 mb-1.5">
                <FontAwesomeIcon icon={icon} className="text-xs text-gray-800" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
            </div>
            <div className="space-y-0.5">{children}</div>
        </div>
    );
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const accents = {
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-sky-50 text-sky-600",
    green: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
};

export default function StatCard({ icon, label, value, accent = "amber", small }) {
    return (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-4 hover:shadow-lift transition">
            <div className="flex items-center gap-3">
                <div className={`size-10 rounded-lg ${accents[accent]} flex items-center justify-center shrink-0`}>
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 truncate">{label}</p>
                    <p className={`font-bold text-gray-900 ${small ? "text-sm" : "text-xl"} truncate`}>
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

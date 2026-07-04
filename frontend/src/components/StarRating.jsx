import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";

export default function StarRating({ value = 0, onChange, size = "sm", max = 5, readonly = false }) {
    const stars = [];

    for (let i = 1; i <= max; i++) {
        let icon;
        if (value >= i) {
            icon = faStar;
        } else if (value >= i - 0.5) {
            icon = faStarHalfStroke;
        } else {
            icon = faStar;
        }

        stars.push(
            <button
                key={i}
                type="button"
                disabled={readonly}
                onClick={() => onChange?.(i)}
                className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
                title={`${i} sao`}
            >
                <FontAwesomeIcon icon={icon} className={`${size === "lg" ? "text-lg" : size === "xs" ? "text-xs" : "text-sm"} ${value >= i ? "text-amber-400" : value >= i - 0.5 ? "text-amber-400" : "text-gray-200"}`} />
            </button>
        );
    }

    return <div className="flex items-center gap-0.5">{stars}</div>;
}

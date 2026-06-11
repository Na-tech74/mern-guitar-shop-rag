import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTruck,
    faShieldHeart,
    faHeadset,
    faAward,
    faGift,
    faRotateLeft
} from "@fortawesome/free-solid-svg-icons";

const iconMap = {
    truck: faTruck,
    shield: faShieldHeart,
    headset: faHeadset,
    award: faAward,
    gift: faGift,
    rotate: faRotateLeft,
};

export default function FeaturesBanner({ features }) {
    const items = features || [];
    if (items.length === 0) return null;

    return (
        <section className="bg-white py-5 sm:py-7">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">

                    {items.map((item, idx) => {
                        const Icon = iconMap[item.icon];
                        return (
                            <div
                                key={`${item.icon}-${idx}`}
                                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-5 lg:p-6 rounded-xl border border-gray-100 bg-white shadow-soft hover:shadow-pop hover:border-amber-200 transition-all duration-300"
                            >
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 sm:mb-1.5">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-2">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="size-10 sm:size-14 rounded-xl sm:rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                                    <FontAwesomeIcon
                                        icon={Icon}
                                        className="text-base sm:text-xl text-black"
                                    />
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </section>
    );
}

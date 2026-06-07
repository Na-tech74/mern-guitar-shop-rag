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
        <section className="bg-white py-7">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    {items.map((item, idx) => {
                        const Icon = iconMap[item.icon];
                        return (
                            <div
                                key={`${item.icon}-${idx}`}
                                className="flex flex-col items-center text-center gap-4 p-6 rounded-xl border border-gray-100 bg-white shadow-soft hover:shadow-pop hover:border-amber-200 transition-all duration-300"
                            >
                                <div className="size-14 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                    <FontAwesomeIcon
                                        icon={Icon}
                                        className="text-xl text-amber-500"
                                    />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800 text-base mb-1.5">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                            </div>
                        );
                    })}

                </div>
            </div>
        </section>
    );
}

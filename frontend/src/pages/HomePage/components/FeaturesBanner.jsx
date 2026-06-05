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

const defaultFeatures = [
    { icon: "truck", title: "Giao hàng nhanh", description: "Miễn phí giao hàng toàn quốc với đơn từ 500K" },
    { icon: "shield", title: "Bảo hành chính hãng", description: "Bảo hành lên đến 24 tháng cho tất cả sản phẩm" },
    { icon: "headset", title: "Hỗ trợ 24/7", description: "Đội ngũ tư vấn chuyên nghiệp mọi lúc" },
    { icon: "award", title: "Sản phẩm chất lượng", description: "Cam kết 100% sản phẩm chính hãng" },
];

export default function FeaturesBanner({ features }) {
    const items = (features && features.length > 0) ? features : defaultFeatures;

    return (
        <section className="bg-white py-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    {items.map((item, idx) => {
                        const Icon = iconMap[item.icon] || faTruck;
                        return (
                            <div
                                key={`${item.icon}-${idx}`}
                                className="flex items-start gap-4 p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition duration-300"
                            >

                                <div className="size-14 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FontAwesomeIcon
                                        icon={Icon}
                                        className="text-xl"
                                    />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 text-base mb-1">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 leading-relaxed">
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

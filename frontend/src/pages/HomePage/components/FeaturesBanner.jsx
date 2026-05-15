import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTruck,
    faShieldHeart,
    faHeadset,
    faAward
} from "@fortawesome/free-solid-svg-icons";

const features = [
    {
        icon: faTruck,
        title: "Giao hàng nhanh",
        description: "Miễn phí giao hàng toàn quốc với đơn từ 500K"
    },
    {
        icon: faShieldHeart,
        title: "Bảo hành chính hãng",
        description: "Bảo hành lên đến 24 tháng cho tất cả sản phẩm"
    },
    {
        icon: faHeadset,
        title: "Hỗ trợ 24/7",
        description: "Đội ngũ tư vấn chuyên nghiệp mọi lúc"
    },
    {
        icon: faAward,
        title: "Sản phẩm chất lượng",
        description: "Cam kết 100% sản phẩm chính hãng"
    }
];

export default function FeaturesBanner() {
    return (
        <section className="bg-white py-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    {features.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition duration-300"
                        >

                            {/* Icon */}
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    className="text-xl"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="font-semibold text-gray-900 text-base mb-1">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}
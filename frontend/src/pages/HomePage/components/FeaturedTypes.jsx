import { Link } from "react-router-dom";

const features = [
    {
        title: "Guitar Acoustic",
        subtitle: "Đa dạng mẫu mã",
        image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80",
        link: "/products"
    },
    {
        title: "Guitar Classic",
        subtitle: "Thiết kế sang trọng",
        image: "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=600&q=80",
        link: "/products"
    },
    {
        title: "Ukulele",
        subtitle: "Nhỏ gọn, tiện lợi",
        image: "https://images.unsplash.com/photo-1514117445517-2ec90fa4b84b?w=600&q=80",
        link: "/products"
    }
];

export default function FeaturedTypes() {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Bộ sưu tập</h2>
                    <p className="text-gray-500">Khám phá các dòng guitar phổ biến nhất</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((item, index) => (
                        <Link 
                            key={index} 
                            to={item.link}
                            className="group relative overflow-hidden rounded-xl"
                        >
                            <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                <p className="text-white/80">{item.subtitle}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
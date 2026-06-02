import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGuitar, faMusic, faAward, faUsers } from "@fortawesome/free-solid-svg-icons";
import Logo from "../../components/Logo";

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="text-sm mb-8">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                        <li>/</li>
                        <li className="text-gray-800 font-medium">Giới thiệu</li>
                    </ol>
                </nav>

                <div className="text-center mb-16">
                    <Logo/>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Cửa hàng nhạc cụ hàng đầu Việt Nam, mang đến những sản phẩm chất lượng nhất cho đam mê âm nhạc của bạn.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Câu chuyện của chúng tôi</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Nam Acoustic được thành lập với sứ mệnh mang âm nhạc đến gần hơn với mọi người. 
                            Chúng tôi tin rằng âm nhạc là ngôn ngữ chung của nhân loại, và mỗi cây đàn là một câu chuyện riêng.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Với nhiều năm kinh nghiệm trong lĩnh vực nhạc cụ, chúng tôi tự hào là đối tác tin cậy 
                            của các nghệ sĩ, nhạc công và những người yêu nhạc trên khắp cả nước.
                        </p>
                    </div>
                    <div className="rounded-xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80"
                            alt="Nam Acoustic Store"
                            className="w-full h-80 object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {[
                        { icon: faMusic, title: "Đa dạng sản phẩm", desc: "Hàng trăm mẫu đàn guitar, piano, ukulele từ các thương hiệu nổi tiếng" },
                        { icon: faAward, title: "Chất lượng cam kết", desc: "100% sản phẩm chính hãng, bảo hành lên đến 24 tháng" },
                        { icon: faUsers, title: "Đội ngũ chuyên nghiệp", desc: "Tư vấn viên giàu kinh nghiệm, sẵn sàng hỗ trợ 24/7" },
                    ].map((item) => (
                        <div key={item.title} className="text-center p-8 rounded-xl bg-white border border-gray-200 shadow-sm">
                            <div className="size-16 mx-auto mb-4 rounded-full  flex items-center justify-center">
                                <FontAwesomeIcon icon={item.icon} className="text-2xl text-black" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

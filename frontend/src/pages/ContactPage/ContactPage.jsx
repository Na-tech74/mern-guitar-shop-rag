import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhone, faEnvelope, faClock, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

const contactInfo = [
    { icon: faMapMarkerAlt, label: "Địa chỉ", value: "537/1 An Phú Đông, Q12, TP. Hồ Chí Minh" },
    { icon: faPhone, label: "Điện thoại", value: "037.862.3181" },
    { icon: faEnvelope, label: "Email", value: "namn98561@gmail.com" },
    { icon: faClock, label: "Giờ làm việc", value: "T2 - CN: 8:00 - 22:00" },
];

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <nav className="text-sm mb-6 sm:mb-8">
                    <ol className="flex items-center gap-2 text-gray-400">
                        <li><Link to="/" className="hover:text-amber-500 transition">Trang chủ</Link></li>
                        <li className="text-gray-300">/</li>
                        <li className="text-gray-600 font-medium">Liên hệ</li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">Liên hệ với chúng tôi</h1>
                    <div className="w-12 sm:w-16 h-1 bg-amber-400 rounded-full mx-auto mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-lg text-gray-500 px-4 sm:px-0">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* Contact Info */}
                    <div className="order-2 md:order-1 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800">Thông tin liên hệ</h2>
                        <div className="space-y-4">
                            {contactInfo.map((item) => (
                                    <div key={item.label} className="flex items-start gap-3 sm:gap-4 group">
                                    <div className="size-10 sm:size-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                                        <FontAwesomeIcon icon={item.icon} className="text-amber-500" />
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-sm text-gray-400">{item.label}</p>
                                        <p className="font-medium text-gray-800">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 pt-4">
                            {[
                                { icon: faFacebook, hover: "hover:bg-blue-500" },
                                { icon: faInstagram, hover: "hover:bg-pink-500" },
                                { icon: faYoutube, hover: "hover:bg-red-500" },
                            ].map(({ icon, hover }) => (
                                <a key={hover} href="#" className={`size-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 ${hover} hover:text-white transition-all`}>
                                    <FontAwesomeIcon icon={icon} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="order-1 md:order-2 bg-gray-50 rounded-2xl border border-gray-100 p-5 sm:p-8 shadow-soft">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Gửi tin nhắn</h2>
                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ tên</label>
                                <input type="text" className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-800 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 placeholder-gray-400 transition" placeholder="Nhập họ tên" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                <input type="email" className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-800 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 placeholder-gray-400 transition" placeholder="Nhập email" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tin nhắn</label>
                                <textarea rows={5} className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-800 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 placeholder-gray-400 transition resize-none" placeholder="Nội dung tin nhắn" required />
                            </div>
                            <button type="submit" className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                                <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                                Gửi tin nhắn
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="rounded-2xl overflow-hidden shadow-soft border border-gray-100">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13390.654967441898!2d106.68795299527685!3d10.823414364813097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1779364882168!5m2!1svi!2s"
                        width="100%"
                        height="400"
                        className="h-64 sm:h-[400px]"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps"
                    />
                </div>
            </div>
        </div>
    );
}

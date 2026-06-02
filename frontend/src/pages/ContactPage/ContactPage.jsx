import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhone, faEnvelope, faClock } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

export default function ContactPage() {
    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="text-sm mb-8">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                        <li>/</li>
                        <li className="text-gray-800 font-medium">Liên hệ</li>
                    </ol>
                </nav>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Liên hệ với chúng tôi</h1>
                    <p className="text-lg text-gray-600">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">Thông tin liên hệ</h2>
                        <div className="space-y-4">
                            {[
                                { icon: faMapMarkerAlt, label: "Địa chỉ", value: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh" },
                                { icon: faPhone, label: "Điện thoại", value: "037.862.3181" },
                                { icon: faEnvelope, label: "Email", value: "namn98561@gmail.com" },
                                { icon: faClock, label: "Giờ làm việc", value: "T2 - CN: 8:00 - 22:00" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-start gap-4">
                                    <div className="size-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={item.icon} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{item.label}</p>
                                        <p className="font-medium text-gray-800">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 pt-4">
                            {[{ icon: faFacebook, name: 'facebook' }, { icon: faInstagram, name: 'instagram' }, { icon: faYoutube, name: 'youtube' }].map(({ icon, name }) => (
                                <a key={name} href="#" className="size-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-amber-100 hover:text-amber-600 transition">
                                    <FontAwesomeIcon icon={icon} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Gửi tin nhắn</h2>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                                <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-500" placeholder="Nhập họ tên" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-500" placeholder="Nhập email" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tin nhắn</label>
                                <textarea rows={5} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-500" placeholder="Nội dung tin nhắn" required />
                            </div>
                            <button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition">
                                Gửi tin nhắn
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="mt-12 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13390.654967441898!2d106.68795299527685!3d10.823414364813097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1779364882168!5m2!1svi!2s"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                />
            </div>
        </div>
    );
}

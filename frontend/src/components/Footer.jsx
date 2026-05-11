import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Cột 1: Giới thiệu */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Guitar Shop</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Cửa hàng guitar hàng đầu Việt Nam. Chuyên cung cấp các loại đàn guitar chất lượng cao.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-amber-500 transition">
                                <FontAwesomeIcon icon={faFacebook} className="text-xl" />
                            </a>
                            <a href="#" className="hover:text-amber-500 transition">
                                <FontAwesomeIcon icon={faInstagram} className="text-xl" />
                            </a>
                            <a href="#" className="hover:text-amber-500 transition">
                                <FontAwesomeIcon icon={faYoutube} className="text-xl" />
                            </a>
                        </div>
                    </div>

                    {/* Cột 2: Liên kết */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Liên kết</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-amber-500 transition">Trang chủ</Link></li>
                            <li><Link to="/products" className="hover:text-amber-500 transition">Sản phẩm</Link></li>
                            <li><Link to="/about" className="hover:text-amber-500 transition">Giới thiệu</Link></li>
                            <li><Link to="/contact" className="hover:text-amber-500 transition">Liên hệ</Link></li>
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ trợ */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Hỗ trợ</h4>
                        <ul className="space-y-2">
                            <li><Link to="/faq" className="hover:text-amber-500 transition">Câu hỏi thường gặp</Link></li>
                            <li><Link to="/shipping" className="hover:text-amber-500 transition">Chính sách giao hàng</Link></li>
                            <li><Link to="/return" className="hover:text-amber-500 transition">Chính sách đổi trả</Link></li>
                            <li><Link to="/privacy" className="hover:text-amber-500 transition">Chính sách bảo mật</Link></li>
                        </ul>
                    </div>

                    {/* Cột 4: Liên hệ */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Liên hệ</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-amber-500" />
                                <span>123 Đường ABC, Quận 1, TP.HCM</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faPhone} className="text-amber-500" />
                                <span>0909 123 456</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faEnvelope} className="text-amber-500" />
                                <span>contact@guitarshop.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Guitar Shop. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
}
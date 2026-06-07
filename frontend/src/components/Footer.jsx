import { memo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

import Logo from "./Logo";

const Footer = memo(function Footer() {
  return (
    <footer className="bg-white text-gray-600 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Cột 1 - Logo: full width trên mobile */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <div className="-ml-8">
             <Logo/>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nam Acoustic là cửa hàng nhạc cụ hàng đầu tại TP.HCM,
              chuyên cung cấp đàn guitar acoustic, classic và electric
              chất lượng cao từ các thương hiệu uy tín trên thế giới.
            </p>

            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-blue-600 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-pink-500 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-red-600 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-black hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faTiktok} />
              </a>
            </div>
          </div>

          {/* Cột 2 - Danh mục */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Danh mục
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-gray-500 hover:text-amber-600 transition">Trang chủ</Link></li>
              <li><Link to="/products" className="text-sm text-gray-500 hover:text-amber-600 transition">Sản phẩm</Link></li>
              <li><Link to="/courses" className="text-sm text-gray-500 hover:text-amber-600 transition">Khóa học</Link></li>
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-amber-600 transition">Giới thiệu</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-amber-600 transition">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Cột 3 - Hỗ trợ */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Hỗ trợ
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/faq" className="text-sm text-gray-500 hover:text-amber-600 transition">Câu hỏi thường gặp</Link></li>
              <li><Link to="/shipping" className="text-sm text-gray-500 hover:text-amber-600 transition">Chính sách giao hàng</Link></li>
              <li><Link to="/return" className="text-sm text-gray-500 hover:text-amber-600 transition">Chính sách đổi trả</Link></li>
              <li><Link to="/warranty" className="text-sm text-gray-500 hover:text-amber-600 transition">Bảo hành sản phẩm</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-500 hover:text-amber-600 transition">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Cột 4 - Liên hệ: full width trên mobile */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Liên hệ
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="size-8 rounded-lg flex items-center justify-center text-amber-500 shrink-0">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm" />
                </div>
                <span className="text-sm text-gray-500">537/1 An Phú Đông, Q12, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-8 rounded-lg flex items-center justify-center text-amber-500 shrink-0">
                  <FontAwesomeIcon icon={faPhone} className="text-sm" />
                </div>
                <span className="text-sm text-gray-500">037862381</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-8 rounded-lg flex items-center justify-center text-amber-500 shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                </div>
                <span className="text-sm text-gray-500">namn98561@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="size-8 rounded-lg flex items-center justify-center text-amber-500 shrink-0">
                  <FontAwesomeIcon icon={faClock} className="text-sm" />
                </div>
                <span className="text-sm text-gray-500">T2–CN: 8:00–22:00</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="bg-amber-400 text-white text-xs px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Nam Acoustic.
            No copyright design by Nam Nguyễn
          </p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-white/70 transition">Điều khoản</Link>
            <span className="opacity-40">|</span>
            <Link to="/privacy" className="hover:text-white/70 transition">Bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faMapMarkerAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faYoutube, faTiktok } from "@fortawesome/free-brands-svg-icons";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-gray-400 leading-relaxed">
              Nam Acoustic là cửa hàng nhạc cụ hàng đầu tại TP.HCM, chuyên cung cấp đàn guitar acoustic, classic và electric chất lượng cao từ các thương hiệu uy tín trên thế giới.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-amber-600 hover:text-white transition">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-amber-600 hover:text-white transition">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-amber-600 hover:text-white transition">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-amber-600 hover:text-white transition">
                <FontAwesomeIcon icon={faTiktok} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white mb-4 pb-2 border-b border-gray-700">
              Danh mục
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-amber-400 transition">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-gray-400 hover:text-amber-400 transition">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-amber-400 transition">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-amber-400 transition">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white mb-4 pb-2 border-b border-gray-700">
              Hỗ trợ
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/faq" className="text-sm text-gray-400 hover:text-amber-400 transition">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-gray-400 hover:text-amber-400 transition">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link to="/return" className="text-sm text-gray-400 hover:text-amber-400 transition">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-sm text-gray-400 hover:text-amber-400 transition">
                  Bảo hành sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-amber-400 transition">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white mb-4 pb-2 border-b border-gray-700">
              Liên hệ
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 flex items-center justify-center text-amber-400 shrink-0">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm" />
                </div>
                <span className="text-sm text-gray-400">123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 flex items-center justify-center text-amber-400 shrink-0">
                  <FontAwesomeIcon icon={faPhone} className="text-sm" />
                </div>
                <span className="text-sm text-gray-400">0909 123 456</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 flex items-center justify-center text-amber-400 shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                </div>
                <span className="text-sm text-gray-400">contact@guitarshop.com</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 flex items-center justify-center text-amber-400 shrink-0">
                  <FontAwesomeIcon icon={faClock} className="text-sm" />
                </div>
                <span className="text-sm text-gray-400">T2–CN: 8:00–22:00</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="bg-gray-950 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Nam Acoustic. No copyright design by Nam Nguyễn
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link to="/terms" className="hover:text-amber-400 transition">Điều khoản</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-amber-400 transition">Bảo mật</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
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

const navLinks = [
  { to: "/", label: "Trang chủ" },
  { to: "/products", label: "Sản phẩm" },
  { to: "/about", label: "Giới thiệu" },
  { to: "/contact", label: "Liên hệ" },
];

const supportLinks = [
  { to: "/faq", label: "Câu hỏi thường gặp" },
  { to: "/shipping", label: "Chính sách giao hàng" },
  { to: "/return", label: "Chính sách đổi trả" },
  { to: "/warranty", label: "Bảo hành sản phẩm" },
  { to: "/privacy", label: "Chính sách bảo mật" },
];

const contactInfo = [
  {
    icon: faMapMarkerAlt,
    text: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
  },
  {
    icon: faPhone,
    text: "0909 123 456",
  },
  {
    icon: faEnvelope,
    text: "contact@guitarshop.com",
  },
  {
    icon: faClock,
    text: "T2–CN: 8:00–22:00",
  },
];

const socialLinks = [
  {
    href: "https://facebook.com",
    icon: faFacebook,
    hoverClass: "hover:bg-blue-600",
  },
  {
    href: "https://instagram.com",
    icon: faInstagram,
    hoverClass: "hover:bg-pink-500",
  },
  {
    href: "https://youtube.com",
    icon: faYoutube,
    hoverClass: "hover:bg-red-600",
  },
  {
    href: "https://tiktok.com",
    icon: faTiktok,
    hoverClass: "hover:bg-black",
  },
];

const bottomLinks = [
  { to: "/terms", label: "Điều khoản" },
  { to: "/privacy", label: "Bảo mật" },
];

const Footer = memo(function Footer() {
  return (
    <footer className="bg-white text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Cột 1 */}
          <div className="space-y-4">
            <Logo />

            <p className="text-sm text-gray-400 leading-relaxed">
              Nam Acoustic là cửa hàng nhạc cụ hàng đầu tại TP.HCM,
              chuyên cung cấp đàn guitar acoustic, classic và electric
              chất lượng cao từ các thương hiệu uy tín trên thế giới.
            </p>

            <div className="flex gap-3">
              {socialLinks.map(({ href, icon, hoverClass }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-black bg-white ${hoverClass} hover:text-white transition duration-300`}
                >
                  <FontAwesomeIcon icon={icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Cột 2 */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Danh mục
            </h4>

            <ul className="space-y-2.5">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-400 hover:text-amber-400 transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3 */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Hỗ trợ
            </h4>

            <ul className="space-y-2.5">
              {supportLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-400 hover:text-amber-400 transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4 */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Liên hệ
            </h4>

            <ul className="space-y-3">
              {contactInfo.map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-600/20 flex items-center justify-center text-amber-400 shrink-0">
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                  </div>

                  <span className="text-sm text-gray-400">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className=" bg-gradient-to-r from-amber-600 to-amber-400 text-white text-xs px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">

          <p>
            © {new Date().getFullYear()} Nam Acoustic.
            No copyright design by Nam Nguyễn
          </p>

          <div className="flex items-center gap-4">
            {bottomLinks.map(({ to, label }, index) => (
              <div key={to} className="flex items-center gap-4">
                {index > 0 && <span>|</span>}

                <Link
                  to={to}
                  className="hover:text-amber-400 transition"
                >
                  {label}
                </Link>
              </div>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
});

export default Footer;
import { memo, useState, useEffect } from "react";
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
import { footerContentAPI } from "../api";

const Footer = memo(function Footer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    footerContentAPI.get()
      .then(res => setData(res.data?.data?.content))
      .catch(() => {});
  }, []);

  const d = data || {};
  const description = d.description || "";
  const social = d.socialLinks || {};
  const contact = d.contactInfo || {};
  const categories = d.categories || [];
  const supportLinks = d.supportLinks || [];
  const bottom = d.bottomBar || {};

  return (
    <footer className="bg-white text-gray-600 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">

          {/* Cột 1 - Logo */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
          <div className="-ml-10">
                <Logo/>
          </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {description}
            </p>

            <div className="flex gap-3">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-blue-600 hover:text-white transition duration-300">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-pink-500 hover:text-white transition duration-300">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-red-600 hover:text-white transition duration-300">
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              )}
              {social.tiktok && (
                <a href={social.tiktok} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-black hover:text-white transition duration-300">
                  <FontAwesomeIcon icon={faTiktok} />
                </a>
              )}
            </div>
          </div>

          {/* Cột 2 - Danh mục */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Danh mục
            </h4>
            <ul className="space-y-2.5">
              {categories.map((item, idx) => (
                <li key={idx}>
                  <Link to={item.path} className="text-sm text-gray-500 hover:text-amber-600 transition">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3 - Hỗ trợ */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Hỗ trợ
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((item, idx) => (
                <li key={idx}>
                  <Link to={item.path} className="text-sm text-gray-500 hover:text-amber-600 transition">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4 - Liên hệ */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Liên hệ
            </h4>
            <ul className="space-y-3">
              {contact.address && (
                <li className="flex items-start gap-3">
                  <div className="size-8 rounded-lg flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm" />
                  </div>
                  <span className="text-sm text-gray-500">{contact.address}</span>
                </li>
              )}
              {contact.phone && (
                <li className="flex items-start gap-3">
                  <div className="size-8 rounded-lg flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faPhone} className="text-sm" />
                  </div>
                  <span className="text-sm text-gray-500">{contact.phone}</span>
                </li>
              )}
              {contact.email && (
                <li className="flex items-start gap-3">
                  <div className="size-8 rounded-lg flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                  </div>
                  <span className="text-sm text-gray-500">{contact.email}</span>
                </li>
              )}
              {contact.hours && (
                <li className="flex items-start gap-3">
                  <div className="size-8 rounded-lg flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faClock} className="text-sm" />
                  </div>
                  <span className="text-sm text-gray-500">{contact.hours}</span>
                </li>
              )}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="bg-amber-400 text-white text-xs px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>{bottom.copyrightText || `© ${new Date().getFullYear()} Nam Acoustic. No copyright design by Nam Nguyễn`}</p>
          <div className="flex items-center gap-4">
            {bottom.showTerms !== false && <Link to="/terms" className="hover:text-white/70 transition">Điều khoản</Link>}
            {bottom.showTerms !== false && bottom.showPrivacy !== false && <span className="opacity-40">|</span>}
            {bottom.showPrivacy !== false && <Link to="/privacy" className="hover:text-white/70 transition">Bảo mật</Link>}
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
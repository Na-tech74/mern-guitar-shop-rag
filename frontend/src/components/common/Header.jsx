import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faSearch,
  faHeart,
  faUser,
  faCartShopping,
  faBars,
  faChevronDown,
  faMedal,
  faEnvelope,
  faTimes,
  faUserPlus,
  faRightToBracket,
  faRightFromBracket,
  faHistory,
  faDiamond,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faYoutube,
  faTiktok,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // State cho dropdown menu
  const dropdownRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAccountOpen(false);
  };

  // Menu items với dropdown
  const menuItems = [
    {
      name: 'TRANG CHỦ',
      path: '/',
      hasDropdown: false
    },
    {
      name: 'GIỚI THIỆU',
      path: '/gioi-thieu',
      hasDropdown: false
    },
    {
      name: 'KHÓA HỌC',
      path: '/khoa-hoc',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Guitar cơ bản', path: '/khoa-hoc/guitar-co-ban' },
        { name: 'Guitar nâng cao', path: '/khoa-hoc/guitar-nang-cao' },
        { name: 'Piano cơ bản', path: '/khoa-hoc/piano-co-ban' },
        { name: 'Piano nâng cao', path: '/khoa-hoc/piano-nang-cao' },
        { name: 'Ukulele', path: '/khoa-hoc/ukulele' },
        { name: 'Nhạc lý', path: '/khoa-hoc/nhac-ly' },
      ]
    },
    {
      name: 'ĐÀN PIANO',
      path: '/dan-piano',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Piano cơ', path: '/dan-piano/co', badge: 'HOT' },
        { name: 'Piano điện', path: '/dan-piano/dien', badge: 'NEW' },
        { name: 'Piano cũ', path: '/dan-piano/cu', badge: 'SALE' },
        { name: 'Phụ kiện Piano', path: '/phu-kien/piano' },
      ]
    },
    {
      name: 'ĐÀN GUITAR',
      path: '/dan-guitar',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Guitar Acoustic', path: '/dan-guitar/acoustic', badge: 'BEST' },
        { name: 'Guitar Classic', path: '/dan-guitar/classic' },
        { name: 'Guitar Electric', path: '/dan-guitar/electric' },
        { name: 'Guitar Bass', path: '/dan-guitar/bass' },
        { name: 'Guitar Cũ', path: '/dan-guitar/cu', badge: 'SALE' },
        { name: 'Phụ kiện Guitar', path: '/phu-kien/guitar' },
      ]
    },
    {
      name: 'PHỤ KIỆN',
      path: '/phu-kien',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Dây đàn', path: '/phu-kien/day-dan' },
        { name: 'Capo', path: '/phu-kien/capo' },
        { name: 'Túi đàn', path: '/phu-kien/tui-dan' },
        { name: 'Giá đàn', path: '/phu-kien/gia-dan' },
        { name: 'Amply', path: '/phu-kien/amply' },
        { name: 'Tai nghe', path: '/phu-kien/tai-nghe' },
      ]
    },
    {
      name: 'LIÊN HỆ',
      path: '/lien-he',
      hasDropdown: false
    },
  ];

  return (
    <>
      <header className={`w-full z-50 transition-all duration-300 ${isSticky
          ? 'fixed top-0 shadow-2xl animate-slideDown bg-black/95 backdrop-blur-md'
          : 'relative bg-black'
        }`}>

        {/* ========== TOP BAR ========== */}
        <div className="hidden lg:block bg-gradient-to-r from-amber-50 to-gray-100 text-gray-700 text-xs py-2 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faMedal} className="text-amber-600 text-sm" />
                <FontAwesomeIcon icon={faMedal} className="text-amber-600 text-sm -ml-1" />
                <FontAwesomeIcon icon={faMedal} className="text-amber-600 text-sm -ml-1" />
              </div>
              <h3 className='font-semibold text-gray-800'>
                Thương hiệu - Chất lượng - Uy tín
              </h3>
              <span className="text-amber-600 mx-2">|</span>
              <span className="text-gray-500">Miễn phí vận chuyển đơn hàng 500k</span>
            </div>

            <div className="flex gap-5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-blue-600 transition-all hover:scale-110 transform">
                <FontAwesomeIcon icon={faFacebook} className="text-gray-600" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-red-600 transition-all hover:scale-110 transform">
                <FontAwesomeIcon icon={faYoutube} className="text-gray-600" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-black transition-all hover:scale-110 transform">
                <FontAwesomeIcon icon={faTiktok} className="text-gray-600" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-pink-600 transition-all hover:scale-110 transform">
                <FontAwesomeIcon icon={faInstagram} className="text-gray-600" />
              </a>
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              <a href="mailto:namn98561@gmail.com" className="hover:text-amber-600 transition">
                <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                namn98561@gmail.com
              </a>
              <a href="tel:0378623181" className="hover:text-amber-600 transition">
                <FontAwesomeIcon icon={faPhone} className="mr-1" />
                037.862.3181
              </a>
            </div>
          </div>
        </div>

        {/* ========== MAIN HEADER ========== */}
        <div className="py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="shrink-0 group">
              <div className="flex items-center gap-2">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
                    Nam Acoustic
                  </h1>
                  <p className="text-[9px] text-gray-400 sm:block">Premium Music Store</p>
                </div>
              </div>
            </Link>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <form onSubmit={handleSearch} className="flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm, khóa học..."
                  className="flex-1 px-4 py-2.5 outline-none text-sm rounded-l-lg border-2 border-r-0 border-gray-200 focus:border-amber-400 transition"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 px-6 text-white rounded-r-lg transition-all hover:scale-105"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </form>
            </div>

            {/* Right Icons */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/wishlist" className="relative group">
                <div className="text-gray-300 group-hover:text-amber-500 transition-colors">
                  <FontAwesomeIcon icon={faHeart} className="text-xl" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 group-hover:text-amber-500 hidden xl:inline">Yêu thích</span>
              </Link>

              {/* Account Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center gap-2 text-gray-300 hover:text-amber-500 transition-colors group"
                >
                  <FontAwesomeIcon icon={faUser} className="text-xl" />
                  <div className="hidden xl:block text-left">
                    <p className="text-xs text-gray-500 group-hover:text-amber-500">
                      {isLoggedIn ? 'Xin chào,' : 'Tài khoản'}
                    </p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      {isLoggedIn ? 'Khách hàng' : 'Đăng nhập'}
                      <FontAwesomeIcon icon={faChevronDown} className="text-[10px] opacity-50" />
                    </p>
                  </div>
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
                    {!isLoggedIn ? (
                      <>
                        <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-b">
                          <p className="text-sm font-semibold text-gray-800">Chào mừng bạn!</p>
                          <p className="text-xs text-gray-500">Đăng nhập để nhận ưu đãi đặc biệt</p>
                        </div>
                        <Link
                          to="/login"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 transition"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          <FontAwesomeIcon icon={faRightToBracket} className="w-4 text-amber-600" />
                          <span>Đăng nhập</span>
                        </Link>
                        <Link
                          to="/register"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 transition border-t"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          <FontAwesomeIcon icon={faUserPlus} className="w-4 text-green-600" />
                          <span>Đăng ký thành viên</span>
                          <span className="ml-auto text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded">+10đ</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-b">
                          <p className="text-sm font-semibold text-gray-800">Xin chào, Nguyễn Văn Nam!</p>
                          <p className="text-xs text-gray-500">namn98561@gmail.com</p>
                        </div>
                        <Link
                          to="/account"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 transition"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          <FontAwesomeIcon icon={faUser} className="w-4 text-amber-600" />
                          <span>Thông tin tài khoản</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 transition border-t"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          <FontAwesomeIcon icon={faHistory} className="w-4 text-blue-600" />
                          <span>Lịch sử đơn hàng</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition border-t"
                        >
                          <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative group">
                <div className="text-gray-300 group-hover:text-amber-500 transition-colors">
                  <FontAwesomeIcon icon={faCartShopping} className="text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-amber-500 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 group-hover:text-amber-500 hidden xl:inline">Giỏ hàng</span>
              </Link>
            </div>

            {/* Mobile Buttons */}
            <div className="flex lg:hidden items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-white text-xl hover:text-amber-500"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
              <Link to="/cart" className="relative">
                <FontAwesomeIcon icon={faCartShopping} className="text-white text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-amber-500 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white text-2xl hover:text-amber-500"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden px-4 pb-3 animate-slideDown">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="flex-1 px-4 py-2 outline-none text-sm rounded-l-lg border border-r-0 border-gray-300"
                autoFocus
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 px-5 text-white rounded-r-lg"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>
          </div>
        )}

        {/* ========== BOTTOM NAVIGATION - DESKTOP WITH DROPDOWN ========== */}
        <div className="hidden lg:block bg-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Menu với dropdown */}
              <ul className="flex gap-0">
                {menuItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="relative group"
                    onMouseEnter={() => item.hasDropdown && setOpenDropdown(idx)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      to={item.path}
                      className="text-gray-300 hover:text-amber-500 px-4 py-3 block text-sm font-medium transition-colors relative"
                    >
                      <span className="mr-1">{item.icon}</span>
                      {item.name}
                      {item.hasDropdown && (
                        <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-[10px]" />
                      )}
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>

                    {/* Dropdown Menu Desktop */}
                    {item.hasDropdown && openDropdown === idx && (
                      <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-2xl z-50 overflow-hidden animate-fadeIn">
                        <div className="py-2">
                          {item.dropdownItems.map((subItem, subIdx) => (
                            <Link
                              key={subIdx}
                              to={subItem.path}
                              className="flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <span>{subItem.name}</span>
                              {subItem.badge && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${subItem.badge === 'HOT' ? 'bg-red-500 text-white' :
                                    subItem.badge === 'NEW' ? 'bg-green-500 text-white' :
                                      subItem.badge === 'SALE' ? 'bg-orange-500 text-white' :
                                        subItem.badge === 'BEST' ? 'bg-amber-500 text-white' :
                                          'bg-gray-200'
                                  }`}>
                                  {subItem.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {/* Hotline */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-amber-600/20 to-amber-500/10 px-4 py-2 rounded-full">
                <div className="relative">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center animate-pulse">
                    <FontAwesomeIcon icon={faPhone} className="text-white text-sm" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider">HOTLINE 24/7</p>
                  <a href="tel:0378623181" className="text-white text-sm font-bold hover:text-amber-500 transition">
                    037.862.3181
                  </a>
                </div>
                <div className="border-l border-gray-700 pl-3">
                  <p className="text-[9px] text-gray-400">Tư vấn miễn phí</p>
                  <p className="text-[10px] text-amber-500 font-medium"> Gọi ngay!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky spacing */}
        {isSticky && <div className="hidden lg:block h-[132px]"></div>}
        {isSticky && <div className="lg:hidden h-[72px]"></div>}
      </header>

      {/* ========== MOBILE MENU WITH DROPDOWN ========== */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 w-80 h-full bg-white z-[1001] shadow-2xl overflow-y-auto animate-slideInRight">
            {/* Mobile Menu Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-white font-bold text-lg">Nam Acoustic Shop</h2>
                  <p className="text-amber-100 text-xs">Premium Music Store</p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>

            {/* User Info Mobile */}
            <div className="p-4 border-b">
              {!isLoggedIn ? (
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="flex-1 text-center py-2.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center py-2.5 border-2 border-amber-600 text-amber-600 rounded-lg text-sm font-medium hover:bg-amber-50 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    N
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Nguyễn Văn Nam</p>
                    <p className="text-xs text-gray-500">namn98561@gmail.com</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                      <FontAwesomeIcon icon={faDiamond} className="text-amber-600 text-xs mr-1" />
                       VIP
                       </span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">100 điểm</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Items Mobile với dropdown */}
            <div className="py-2">
              {menuItems.map((item, idx) => (
                <div key={idx}>
                  {/* Main menu item */}
                  <div className="border-b border-gray-100">
                    {item.hasDropdown ? (
                      // Nếu có dropdown thì dùng button để toggle
                      <button
                        onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                        className="flex items-center justify-between w-full px-5 py-3 text-gray-700 hover:bg-amber-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`text-xs transition-transform duration-300 ${openDropdown === idx ? 'rotate-180' : ''}`}
                        />
                      </button>
                    ) : (
                      // Không có dropdown thì dùng Link
                      <Link
                        to={item.path}
                        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    )}

                    {/* Submenu mobile */}
                    {item.hasDropdown && openDropdown === idx && (
                      <div className="bg-gray-50 pl-12">
                        {item.dropdownItems.map((subItem, subIdx) => (
                          <Link
                            key={subIdx}
                            to={subItem.path}
                            className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:text-amber-600 transition border-t border-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span>{subItem.name}</span>
                            {subItem.badge && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${subItem.badge === 'HOT' ? 'bg-red-500 text-white' :
                                  subItem.badge === 'NEW' ? 'bg-green-400 text-white' :
                                    subItem.badge === 'SALE' ? 'bg-orange-400 text-white' :
                                      subItem.badge === 'BEST' ? 'bg-amber-400 text-white' :
                                        'bg-gray-200'
                                }`}>
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Extra Links */}
            <div className="border-t my-2"></div>
            <Link
              to="/wishlist"
              className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-amber-50 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faHeart}  />
              <span>Yêu thích</span>
              <span className="ml-auto bg-gray-100 px-2 py-0.5 rounded text-xs">{wishlistCount}</span>
            </Link>

            <Link
              to="/orders"
              className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-amber-50 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faHistory}/>
              <span>Đơn hàng của tôi</span>
            </Link>

            {/* Hotline Mobile */}
            <div className="m-4 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">
              <FontAwesomeIcon icon={faPhone} className="text-amber-600 mr-1" />
               HOTLINE HỖ TRỢ</p>
              <a href="tel:0378623181" className="text-amber-700 font-bold text-lg block">
                037.862.3181
              </a>
              <p className="text-[10px] text-gray-400 mt-1">8:00 - 22:00 (Tất cả các ngày)</p>
            </div>
          </div>
        </>
      )}

      {/* ========== CSS ANIMATIONS ========== */}
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 0.5s ease-out;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
      `}</style>
    </>
  );
}
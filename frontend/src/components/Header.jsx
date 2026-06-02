import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faHeart, faUser, faCartShopping, faBars,
  faChevronDown, faEnvelope, faTimes, faRightFromBracket, faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faYoutube, faTiktok, faInstagram } from '@fortawesome/free-brands-svg-icons';
import Logo from './Logo.jsx';

const menuItems = [
  { name: 'TRANG CHỦ', path: '/', hasDropdown: false },
  {
    name: 'SẢN PHẨM', path: '/products', hasDropdown: true, dropdownItems: [
      { name: 'Guitar Acoustic', hash: 'guitar-acoustic' },
      { name: 'Guitar Classic', hash: 'guitar-classic' },
      { name: 'Piano', hash: 'piano' },
      { name: 'Ukulele', hash: 'ukulele' },
      { name: 'Tất cả sản phẩm', path: '/products' },
    ]
  },
  { name: 'KHÓA HỌC', path: '/courses', hasDropdown: false },
  { name: 'GIỚI THIỆU', path: '/about', hasDropdown: false },
  { name: 'BÀI VIẾT', path: '/blog', hasDropdown: false },
  { name: 'LIÊN HỆ', path: '/contact', hasDropdown: false },
];

const Header = memo(function Header() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const closeTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [userInfo] = useState(() => JSON.parse(sessionStorage.getItem("userInfo")));
  const isLoggedIn = !!userInfo;

  useEffect(() => {
    const updateCounts = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setCartCount(cart.length);
      setWishlistCount(wishlist.length);
    };
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };
    updateCounts();
    window.addEventListener("storage", updateCounts);
    window.addEventListener("cart-updated", updateCounts);
    window.addEventListener("wishlist-updated", updateCounts);
    document.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener("storage", updateCounts);
      window.removeEventListener("cart-updated", updateCounts);
      window.removeEventListener("wishlist-updated", updateCounts);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      const { logoutAPI } = await import("../pages/AuthPage/api/authAPI.js");
      await logoutAPI();
    } catch {
      // ignore
    }
    sessionStorage.removeItem("userInfo");
    sessionStorage.removeItem("token");
    setIsAccountOpen(false);
    navigate("/");
  };

  const scrollToCategory = useCallback((slug) => {
    navigate("/");
    let retries = 10;
    const interval = setInterval(() => {
      const el = document.getElementById(`category-${slug}`);
      if (el || --retries <= 0) {
        clearInterval(interval);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  }, [navigate]);

  return (
    <>
      <header className="w-full fixed top-0 z-50 will-change-transform">

        {/* Top Bar */}
        <div className="hidden lg:block bg-gradient-to-r from-amber-600 to-amber-400 text-white text-xs py-2">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <a href="mailto:namn98561@gmail.com" className="hover:text-amber-200 transition">
                <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                namn98561@gmail.com
              </a>
              <span className="opacity-50">|</span>
              <a href="tel:0378623181" className="hover:text-amber-200 transition">
                <FontAwesomeIcon icon={faPhone} className="mr-1" />
                037.862.3181
              </a>
            </div>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-200 transition">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-200 transition">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-200 transition">
                <FontAwesomeIcon icon={faTiktok} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-200 transition">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <Link to="/" className="shrink-0">
              <Logo />
            </Link>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg">
              <form onSubmit={handleSearch} className="flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="flex-1 px-4 py-2 outline-none text-sm rounded-l-lg border border-gray-200 bg-gray-50 focus:border-amber-500 transition"
                />
                <button type="submit" className="bg-amber-600 hover:bg-amber-500 px-4 text-white rounded-r-lg">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </form>
            </div>

            {/* Right Icons */}
            <div className="hidden md:flex items-center gap-5">
              <Link to="/wishlist" className="relative group">
                <FontAwesomeIcon icon={faHeart} className="text-xl text-gray-600 group-hover:text-amber-600 transition" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] size-4 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition"
                >
                  <FontAwesomeIcon icon={faUser} className="text-xl" />
                  <span className="text-sm hidden lg:block">
                    {isLoggedIn ? userInfo?.name : 'Đăng nhập'}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} className="text-[10px]" />
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-[100] overflow-hidden">
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                      <p className="font-medium">
                        {isLoggedIn ? `Xin chào, ${userInfo?.name}` : 'Chào mừng bạn!'}
                      </p>
                      {isLoggedIn && <p className="text-xs opacity-80">{userInfo?.email}</p>}
                    </div>
                    {!isLoggedIn ? (
                      <div className="py-2">
                        <Link to="/login" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-amber-50" onClick={() => setIsAccountOpen(false)}>
                          Đăng nhập
                        </Link>
                        <Link to="/register" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-amber-50 border-t" onClick={() => setIsAccountOpen(false)}>
                          Đăng ký
                        </Link>
                      </div>
                    ) : (
                      <div className="py-2">
                        <Link to="/account" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-amber-50" onClick={() => setIsAccountOpen(false)}>
                          Tài khoản
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-amber-50 border-t" onClick={() => setIsAccountOpen(false)}>
                          Đơn hàng
                        </Link>
                        <button type="button" onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-red-600 hover:bg-amber-50 border-t">
                          Đăng xuất
                          <FontAwesomeIcon icon={faRightFromBracket} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative group">
                <FontAwesomeIcon icon={faCartShopping} className="text-xl text-gray-600 group-hover:text-amber-600 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] size-4 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Buttons */}
            <div className="flex lg:hidden items-center gap-3">
              <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <FontAwesomeIcon icon={faSearch} className="text-xl text-amber-600" />
              </button>
              <Link to="/cart" className="relative">
                <FontAwesomeIcon icon={faCartShopping} className="text-xl text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] size-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="text-gray-700 text-2xl">
                <FontAwesomeIcon icon={faBars} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="lg:hidden px-4 pb-3 border-b border-gray-100">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="flex-1 px-4 py-2 outline-none text-sm rounded-l-lg border border-gray-200 bg-gray-50"
                autoFocus
              />
              <button type="submit" className="bg-amber-600 hover:bg-amber-500 px-5 text-white rounded-r-lg">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>
          </div>
        )}

        {/* Navigation - Desktop */}
        <div className="hidden lg:block bg-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <ul className="flex">
                {menuItems.map((item) => (
                  <li key={item.name} className="relative"
                    onMouseEnter={() => {
                      if (closeTimeoutRef.current) {
                        clearTimeout(closeTimeoutRef.current);
                        closeTimeoutRef.current = null;
                      }
                      setOpenDropdown(item.name);
                    }}
                    onMouseLeave={() => {
                      closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 300);
                    }}>
                    <Link to={item.path} className="flex items-center gap-1 text-gray-600 hover:text-amber-600 px-4 py-3 text-sm font-medium transition">
                      <span>{item.icon}</span>
                      {item.name}
                      {item.hasDropdown && <FontAwesomeIcon icon={faChevronDown} className="text-[10px]" />}
                    </Link>
                    {item.hasDropdown && openDropdown === item.name && (
                      <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-2"
                        onMouseEnter={() => {
                          if (closeTimeoutRef.current) {
                            clearTimeout(closeTimeoutRef.current);
                            closeTimeoutRef.current = null;
                          }
                        }}
                        onMouseLeave={() => {
                          closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 300);
                        }}>
                        {item.dropdownItems.map((subItem) =>
                          subItem.hash ? (
                            <button key={subItem.name} type="button" onClick={() => { setOpenDropdown(null); scrollToCategory(subItem.hash); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-amber-50 hover:text-amber-600">
                              {subItem.name}
                            </button>
                          ) : (
                            <Link key={subItem.name} to={subItem.path} className="block px-4 py-2.5 text-gray-700 hover:bg-amber-50 hover:text-amber-600">
                              {subItem.name}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span>Hỗ trợ:</span>
                <a href="tel:0378623181" className="text-amber-600 font-medium hover:underline">037.862.3181</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[1000]" onClick={() => setIsMobileMenuOpen(false)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsMobileMenuOpen(false); } }} role="button" tabIndex={0} />
          <div className="fixed top-0 left-0 w-72 h-full bg-white z-[1001] shadow-xl overflow-y-auto">
            <div className="bg-white p-4 flex justify-between items-center">
              <Link to="/" className="shrink-0">
                <Logo />
              </Link>
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-xl">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-4 border-b">
              {!isLoggedIn ? (
                <div className="flex gap-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-amber-600 text-white rounded text-sm">Đăng nhập</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-2 border border-amber-600 text-amber-600 rounded text-sm">Đăng ký</Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                    {userInfo?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{userInfo?.name}</p>
                    <p className="text-xs text-gray-500">{userInfo?.email}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="py-2">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <>
                      <button type="button" onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)} className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50">
                        <span>{item.name}</span>
                        <FontAwesomeIcon icon={faChevronDown} className={`text-xs transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      {openDropdown === item.name && (
                        <div className="bg-gray-50 pl-4">
                          {item.dropdownItems.map((subItem) =>
                            subItem.hash ? (
                              <button key={subItem.name} type="button" onClick={() => { setIsMobileMenuOpen(false); scrollToCategory(subItem.hash); }} className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-amber-600">
                                {subItem.name}
                              </button>
                            ) : (
                              <Link key={subItem.name} to={subItem.path} className="block px-4 py-2 text-sm text-gray-600 hover:text-amber-600" onClick={() => setIsMobileMenuOpen(false)}>
                                {subItem.name}
                              </Link>
                            )
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50">
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
});

export default Header;
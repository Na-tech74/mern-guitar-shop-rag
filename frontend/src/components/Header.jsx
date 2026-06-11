import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faHeart, faUser, faCartShopping, faBars,
  faChevronDown, faEnvelope, faTimes, faRightFromBracket, faPhone,
  faCamera, faTrash, faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faYoutube, faTiktok, faInstagram } from '@fortawesome/free-brands-svg-icons';
import Logo from './Logo.jsx';
import UserAvatar from './UserAvatar.jsx';
import { useUserInfo } from '../hooks/useUserInfo.js';
import { logoutAPI, userAPI } from '../api';

const Header = memo(function Header() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const closeTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const userInfo = useUserInfo();
  const isLoggedIn = !!userInfo?.email;

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
        setAvatarError("");
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
      navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch {
      // ignore
    }
    sessionStorage.removeItem("userInfo");
    sessionStorage.removeItem("token");
    window.dispatchEvent(new Event("user-info-updated"));
    setIsAccountOpen(false);
    navigate("/");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image")) {
      setAvatarError("Chỉ chấp nhận file ảnh");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setAvatarError("Ảnh tối đa 10MB");
      return;
    }

    setAvatarError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await userAPI.uploadAvatar(formData);

      const current = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
      const updated = { ...current, avatar: data.data.avatar };
      sessionStorage.setItem("userInfo", JSON.stringify(updated));
      window.dispatchEvent(new Event("user-info-updated"));
    } catch (err) {
      setAvatarError(err.response?.data?.message || "Tải ảnh thất bại");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    setUploading(true);
    setAvatarError("");
    try {
      await userAPI.deleteAvatar();
      const current = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
      const updated = { ...current, avatar: "" };
      sessionStorage.setItem("userInfo", JSON.stringify(updated));
      window.dispatchEvent(new Event("user-info-updated"));
    } catch (err) {
      setAvatarError(err.response?.data?.message || "Xóa ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const scrollToCategory = useCallback((slug) => {
    const doScroll = (el) => {
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    };
    const el = document.getElementById(`fp-${slug}`)
      || document.getElementById(`category-${slug}`);
    if (el) {
      doScroll(el);
      return;
    }
    sessionStorage.setItem('scrollToCategory', slug);
    navigate("/", { state: { _st: Date.now() }, replace: true });
  }, [navigate]);

  return (
    <>
      <header className="w-full sticky top-0 z-50 will-change-transform">

        {/* Top Bar */}
        <div className="hidden lg:block bg-amber-400 text-white text-xs py-2">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
            <div className="flex items-center gap-4">
              <a href="mailto:namn98561@gmail.com" className="hover:text-white/70 transition">
                <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                namn98561@gmail.com
              </a>
              <span className="opacity-40">|</span>
              <a href="tel:0378623181" className="hover:text-white/70 transition">
                <FontAwesomeIcon icon={faPhone} className="mr-1" />
                037.862.3181
              </a>
            </div>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition">
                <FontAwesomeIcon icon={faTiktok} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 pl-0 pr-4 sm:px-4">
            <Link to="/" className="shrink-0 -ml-6 sm:ml-0">
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
                  className="flex-1 px-4 py-2 outline-none text-sm rounded-l-lg border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:border-amber-400 transition"
                />
                <button type="submit" className="bg-amber-400 hover:bg-amber-500 px-4 text-white rounded-r-lg transition">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </form>
            </div>

            {/* Right Icons */}
            <div className="hidden md:flex items-center gap-5">
              <Link to="/wishlist" className="relative group">
                <FontAwesomeIcon icon={faHeart} className="text-xl text-gray-600 group-hover:text-amber-500 transition" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] size-4 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center gap-2 text-gray-600 hover:text-amber-500 transition"
                  aria-haspopup="menu"
                  aria-expanded={isAccountOpen}
                >
                  {isLoggedIn ? (
                    <UserAvatar user={userInfo} size="sm" />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="text-xl" />
                  )}
                  <span className="text-sm hidden lg:block max-w-[120px] truncate">
                    {isLoggedIn ? userInfo?.name : 'Đăng nhập'}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} className="text-[10px]" />
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-[100] overflow-hidden">
                    {!isLoggedIn ? (
                      <>
                        <div className="p-3 bg-amber-400 text-white">
                          <p className="font-medium">Chào mừng bạn!</p>
                          <p className="text-xs opacity-80">Đăng nhập để tiếp tục</p>
                        </div>
                        <div className="py-2">
                          <Link to="/login" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-amber-50" onClick={() => setIsAccountOpen(false)}>
                            Đăng nhập
                          </Link>
                          <Link to="/register" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-amber-50 border-t border-gray-100" onClick={() => setIsAccountOpen(false)}>
                            Đăng ký
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* USER INFO + AVATAR UPLOAD */}
                        <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-100">
                          <div className="relative shrink-0 group">
                            <UserAvatar user={userInfo} size="2xl" />
                            <button
                              type="button"
                              onClick={handleAvatarClick}
                              disabled={uploading}
                              className="
                                absolute inset-0 flex items-center justify-center
                                rounded-full bg-black/50 text-white
                                opacity-0 group-hover:opacity-100
                                transition-opacity cursor-pointer
                                disabled:cursor-not-allowed
                              "
                              title="Đổi ảnh đại diện"
                            >
                              {uploading
                                ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                : <FontAwesomeIcon icon={faCamera} />}
                            </button>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-800">
                              {userInfo?.name}
                            </p>
                            <p className="truncate text-xs text-gray-500">{userInfo?.email}</p>
                          </div>
                        </div>

                        {avatarError && (
                          <div className="px-3 py-2 text-xs text-red-600 bg-red-50 border-b border-red-100">
                            {avatarError}
                          </div>
                        )}

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />

                        <div className="py-1">
                          <button
                            type="button"
                            onClick={handleAvatarClick}
                            disabled={uploading}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          >
                            <FontAwesomeIcon icon={faCamera} className="text-base text-gray-400" />
                            <span>{userInfo?.avatar ? "Đổi ảnh đại diện" : "Tải ảnh lên"}</span>
                          </button>
                          {userInfo?.avatar && (
                            <button
                              type="button"
                              onClick={handleDeleteAvatar}
                              disabled={uploading}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-base text-gray-400" />
                              <span>Xóa ảnh hiện tại</span>
                            </button>
                          )}
                          <Link to="/account" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsAccountOpen(false)}>
                            <FontAwesomeIcon icon={faUser} className="text-base text-gray-400" />
                            <span>Tài khoản</span>
                          </Link>
                          <Link to="/orders" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsAccountOpen(false)}>
                            <FontAwesomeIcon icon={faRightFromBracket} className="text-base text-gray-400" />
                            <span>Đơn hàng</span>
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 py-1">
                          <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <FontAwesomeIcon icon={faRightFromBracket} className="text-base" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative group">
                <FontAwesomeIcon icon={faCartShopping} className="text-xl text-gray-600 group-hover:text-amber-500 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] size-4 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Buttons */}
            <div className="flex lg:hidden items-center gap-3">
              <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <FontAwesomeIcon icon={faSearch} className="text-xl text-gray-700" />
              </button>
              <Link to="/wishlist" className="relative">
                <FontAwesomeIcon icon={faHeart} className="text-xl text-gray-700" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] size-4 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative">
                <FontAwesomeIcon icon={faCartShopping} className="text-xl text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] size-4 flex items-center justify-center rounded-full">
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
          <div className="lg:hidden px-4 pb-3 border-b border-gray-200 bg-white">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="flex-1 px-4 py-2 outline-none text-sm rounded-l-lg border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400"
                autoFocus
              />
              <button type="submit" className="bg-amber-400 hover:bg-amber-500 px-5 text-white rounded-r-lg transition">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>
          </div>
        )}

        {/* Navigation - Desktop */}
        <div className="hidden lg:block bg-gray-100 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <ul className="flex">
                <li className="relative"
                  onMouseEnter={() => { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }}
                  onMouseLeave={() => { closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 300); }}>
                  <Link to="/" className="flex items-center gap-1 text-gray-800 hover:text-amber-500 px-4 py-3 text-sm font-semibold transition">
                    TRANG CHỦ
                  </Link>
                </li>
                <li className="relative"
                  onMouseEnter={() => { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; setOpenDropdown('SẢN PHẨM'); }}
                  onMouseLeave={() => { closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 300); }}>
                  <Link to="/products" className="flex items-center gap-1 text-gray-800 hover:text-amber-500 px-4 py-3 text-sm font-semibold transition">
                    SẢN PHẨM
                    <FontAwesomeIcon icon={faChevronDown} className="text-[10px]" />
                  </Link>
                  {openDropdown === 'SẢN PHẨM' && (
                    <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-2"
                      onMouseEnter={() => { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }}
                      onMouseLeave={() => { closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 300); }}>
                      <button type="button" onClick={() => { setOpenDropdown(null); scrollToCategory('guitar-acoustic'); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-amber-50 hover:text-amber-600">Guitar Acoustic</button>
                      <button type="button" onClick={() => { setOpenDropdown(null); scrollToCategory('guitar-classic'); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-amber-50 hover:text-amber-600">Guitar Classic</button>
                      <button type="button" onClick={() => { setOpenDropdown(null); scrollToCategory('guitar-bass'); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-amber-50 hover:text-amber-600">Guitar Bass</button>
                      <button type="button" onClick={() => { setOpenDropdown(null); scrollToCategory('guitar-electric'); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-amber-50 hover:text-amber-600">Guitar Electric</button>
                      <button type="button" onClick={() => { setOpenDropdown(null); scrollToCategory('ukulele'); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-amber-50 hover:text-amber-600">Ukulele</button>
                      <button type="button" onClick={() => { setOpenDropdown(null); scrollToCategory('piano'); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-amber-50 hover:text-amber-600">Piano</button>
                      <hr />
                      <Link to="/products?all=1" onClick={() => setOpenDropdown(null)} className="block px-4 py-2.5 text-gray-700 hover:bg-amber-50 hover:text-amber-600">Tất cả sản phẩm</Link>
                    </div>
                  )}
                </li>
                <li className="relative"
                  onMouseEnter={() => { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }}
                  onMouseLeave={() => { closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 300); }}>
                  <Link to="/courses" className="flex items-center gap-1 text-gray-800 hover:text-amber-500 px-4 py-3 text-sm font-semibold transition">
                    KHÓA HỌC
                  </Link>
                </li>
                <li className="relative"
                  onMouseEnter={() => { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }}
                  onMouseLeave={() => { closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 300); }}>
                  <Link to="/about" className="flex items-center gap-1 text-gray-800 hover:text-amber-500 px-4 py-3 text-sm font-semibold transition">
                    GIỚI THIỆU
                  </Link>
                </li>
                <li className="relative"
                  onMouseEnter={() => { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }}
                  onMouseLeave={() => { closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 300); }}>
                  <Link to="/blog" className="flex items-center gap-1 text-gray-800 hover:text-amber-500 px-4 py-3 text-sm font-semibold transition">
                    BÀI VIẾT
                  </Link>
                </li>
                <li className="relative"
                  onMouseEnter={() => { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }}
                  onMouseLeave={() => { closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 300); }}>
                  <Link to="/contact" className="flex items-center gap-1 text-gray-800 hover:text-amber-500 px-4 py-3 text-sm font-semibold transition">
                    LIÊN HỆ
                  </Link>
                </li>
              </ul>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <span>Hỗ trợ:</span>
                <a href="tel:0378623181" className="text-gray-800 font-semibold hover:text-amber-600">037.862.3181</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[1000] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsMobileMenuOpen(false);
              }
            }}
            role="button" tabIndex={0} />
          <div className="fixed top-0 left-0 w-72 h-full bg-white z-[1001] shadow-pop overflow-y-auto lg:hidden">
            <div className="bg-white p-4 flex justify-between items-center border-b border-gray-100">
              <Link to="/" className="shrink-0">
                <Logo />
              </Link>
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl transition">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100">
              {!isLoggedIn ? (
                <div className="flex gap-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-amber-400 hover:bg-amber-500 text-white rounded text-sm transition">Đăng nhập</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-2 border border-gray-300 text-gray-700 hover:border-amber-500 hover:text-amber-600 rounded text-sm transition">Đăng ký</Link>
                </div>
              ) : (
                <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:bg-amber-50 p-2 -m-2 rounded-lg transition">
                  <UserAvatar user={userInfo} size="lg" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{userInfo?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{userInfo?.email}</p>
                  </div>
                </Link>
              )}
            </div>

            <div className="py-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition">
                <span className="text-sm">TRANG CHỦ</span>
              </Link>
              <button type="button" onClick={() => setOpenDropdown(openDropdown === 'SẢN PHẨM' ? null : 'SẢN PHẨM')} className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition">
                <span className="text-sm">SẢN PHẨM</span>
                <FontAwesomeIcon icon={faChevronDown} className={`text-xs transition-transform ${openDropdown === 'SẢN PHẨM' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'SẢN PHẨM' && (
                <div className="pl-4">
                  <button type="button" onClick={() => { setIsMobileMenuOpen(false); scrollToCategory('guitar-acoustic'); }} className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-600">Guitar Acoustic</button>
                  <button type="button" onClick={() => { setIsMobileMenuOpen(false); scrollToCategory('guitar-classic'); }} className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-600">Guitar Classic</button>
                  <button type="button" onClick={() => { setIsMobileMenuOpen(false); scrollToCategory('guitar-bass'); }} className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-600">Guitar Bass</button>
                  <button type="button" onClick={() => { setIsMobileMenuOpen(false); scrollToCategory('guitar-electric'); }} className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-600">Guitar Electric</button>
                  <button type="button" onClick={() => { setIsMobileMenuOpen(false); scrollToCategory('ukulele'); }} className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-600">Ukulele</button>
                  <button type="button" onClick={() => { setIsMobileMenuOpen(false); scrollToCategory('piano'); }} className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-600">Piano</button>
                  <hr />
                   <Link to="/products?all=1" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-600">Tất cả sản phẩm</Link>
                  <hr />
                </div>
              )}

              <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition">
                <span className="text-sm">KHÓA HỌC</span>
              </Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition">
                <span className="text-sm">GIỚI THIỆU</span>
              </Link>
              <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition">
                <span className="text-sm">TÀI KHOẢN</span>
              </Link>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition">
                <span className="text-sm">BÀI VIẾT</span>
              </Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition">
                <span className="text-sm">LIÊN HỆ</span>
              </Link>
            </div>

            {/* Top Bar - Social */}
            <div className="flex items-center justify-center gap-6 py-3 text-gray-700">

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-blue-600 transition"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-red-600 transition"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-black transition"
              >
                <FontAwesomeIcon icon={faTiktok} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-pink-500 transition"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>

            </div>
          </div>
        </>
      )}
    </>
  );
});

export default Header;
